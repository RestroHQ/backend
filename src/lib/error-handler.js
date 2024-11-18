import { config } from "./config";
import { fromError } from "zod-validation-error";

export const errorHandler = (error, res, code = 400) => {
  let type = "Unknown Error";
  let messages = [];

  if (error.message) {
    messages.push(error.message);
  } else {
    messages.push(error);
  }

  if (error.name === "ZodError") {
    type = "Validation Error";
    const validationError = fromError(error);

    messages = validationError.details.map((detail) => {
      return detail.message;
    });
  }

  if (code === 403) {
    type = "Forbidden";
  } else if (code === 401) {
    type = "Unauthorized";
  } else if (code === 404) {
    type = "Not Found";
  }

  if (config.NODE_ENV === "development") {
    console.error(error);
  }
  return res.status(parseInt(code)).json({ error: { type, messages } });
};
