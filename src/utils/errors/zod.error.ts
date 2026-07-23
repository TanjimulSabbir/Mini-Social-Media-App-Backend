import httpStatus from "http-status";
import { ZodError } from "zod";
import { TGenericErrorResponse } from "../../../types/app.error.response";

export const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const issues = err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Validation error",
    errorName: "ZodValidationError",
    errorInfo: { issues },
  };
};