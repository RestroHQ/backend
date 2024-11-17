import { config } from "./config";
import { fromError } from "zod-validation-error";

export const errorHandler = (error, res) => {
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
  return res.status(400).json({ error: { type, messages } });
};
