import { Client } from "@elastic/elasticsearch";
import { appLogger } from "../middleware/logger.js";

// Initialize the Elasticsearch client using environment variables
const client = new Client({
  cloud: { id: process.env.ELASTIC_CLOUD_ID },
  auth: { apiKey: process.env.ELASTIC_API_KEY },
});

// Index (store) a document in Elasticsearch so it becomes searchable
export const indexDocument = async (doc) => {
  try {
    await client.index({
      index: "documents",
      id: doc._id.toString(),
      document: {
        title: doc.title,
        content: doc.content,
        tags: doc.tags ?? [],
        createdBy: doc.createdBy.toString(),
        createdAt: doc.createdAt,
      },
    });
    appLogger.info({ docId: doc._id }, "Document indexed in Elasticsearch");
  } catch (err) {
    appLogger.error({ err }, "Failed to index document in Elasticsearch");
    throw err;
  }
};

// Search documents in Elasticsearch using fuzzy multi-match + phrase-prefix
export const searchDocuments = async (query) => {
  try {
    const result = await client.search({
      index: "documents",
      query: {
        bool: {
          should: [
            {
              multi_match: {
                query,
                fields: ["title^2", "content", "tags"],
                fuzziness: "AUTO",
              },
            },
            {
              match_phrase_prefix: {
                title: query,
              },
            },
          ],
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source);
  } catch (err) {
    appLogger.error({ err, query }, "Elasticsearch search failed");
    throw err;
  }
};