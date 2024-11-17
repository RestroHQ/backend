import { config } from "./config";
import { fromError } from "zod-validation-error";

export const errorHandler = (code = 400, message, res) => {
  let type = "Unknown Error";
  let messages = [];

  if (error.message) {
    messages.push(error.message);
  }

  if (error.name === "ZodError") {
    type = "Validation Error";
    const validationError = fromError(error);

    messages = validationError.details.map((detail) => {
      return detail.message;
    });
  }

  if (config.NODE_ENV === "development") {
    console.error(error);
  }
  return res.status(parseInt(code)).json({ error: { type, messages } });
};
