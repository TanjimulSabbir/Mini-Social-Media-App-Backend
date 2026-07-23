import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";
import AppError from "../../utils/errors/app.error";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userService.registerUserIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: { user },
    });
  },
);

const updateMyProfileFcmTokenInDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    if (!userId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "User ID is required in the request parameters",
      );
    }
    const payload = req.body;

    const updatedUser = await userService.updateMyProfileFcmTokenInDB(
      userId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User profile updated successfully",
      data: { updatedUser },
    });
  },
);

export const userController = {
  updateMyProfileFcmTokenInDB,
  registerUser,
};
