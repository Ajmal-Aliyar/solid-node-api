import { NextFunction, Request, Response } from "express";
import { BaseError } from "@/errors/base-error";
import { errorResponse } from "@/utils/api-response";
import { HTTP_STATUS } from "@/constants/http-status";
import { ERROR_MESSAGES } from "@/constants/messages";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof BaseError) {
    return errorResponse(res, err.statusCode, err.message);
  }

  console.error("Unhandled Error:", err);
  return errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
};
