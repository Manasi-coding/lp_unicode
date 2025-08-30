import morgan from "morgan";
import pino from "pino";
import PinoPretty from "pino-pretty";

// Morgan: Automatically logs every HTTP request.
// Pino: Lets you log anything important inside your code.
// pino-pretty: Makes Pino’s output easier to read.

const logger = pino(pretty());

export const appLogger = logger;        // for manual logging
export const requestLogger = morgan.dev();      // for automatic request logs