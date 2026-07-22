import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { likeService } from "./like.service";


const toggleLike = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const userId = req.user?.id as string;

        const { postId } = req.params;


        const result = await likeService.toggleLike(
            userId,
            postId as string
        );


        sendResponse(res,{
            success:true,
            statusCode:httpStatus.OK,
            message: result.message,
            data:{
                liked: result.liked
            }
        });
    }
);


export const likeController = {
    toggleLike
};