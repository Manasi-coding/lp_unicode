export const searchDocuments = async (query) => {
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

    return result.hits.hits.map(hit => hit._source);
};