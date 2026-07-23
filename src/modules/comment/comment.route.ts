import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { commentController } from "./comment.controller";

const router = Router();

router.post(
  "/",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  commentController.createComment,
);

router.get(
  "/:postId",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  commentController.getCommentByPostId,
);

router.delete(
  "/:commentId",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  commentController.deleteComment,
);

export const commentRoutes = router;
