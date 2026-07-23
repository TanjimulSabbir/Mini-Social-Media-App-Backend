import { prisma } from "../../lib/prisma";
import { notificationService } from "../notification/notification.service";
import {
  ICreateCommentPayload,
  IUpdateCommentPayload,
} from "./comment.interface";

const createComment = async (
  postId: string,
  payload: ICreateCommentPayload,
) => {
  const { actor, ...rest } = payload;
  await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  const comment = await prisma.comment.create({
    data: {
      ...rest,
      postId,
    },
  });

  notificationService
    .sendPostNotification({
      postId,
      actorId: actor.actorId,
      actorName: actor.actorName,
      notificationActionType: "COMMENT",
    })
    .catch((err) => console.error("Notification error:", err));

  return comment;
};

const getCommentByAuthorId = async (authorId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return comments;
};

const getCommentByCommentId = async (postId: string) => {
  const comment = await prisma.comment.findMany({
    where: {
      postId,
    },
  });
  return comment;
};

const updateComment = async (
  commentId: string,
  data: IUpdateCommentPayload,
  authorId: string,
) => {
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("Your provided input is invalid!");
  }

  const comment = await prisma.comment.update({
    where: {
      id: commentId,
      authorId,
    },
    data,
  });

  return comment;
};

const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  const comment = await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });

  return comment;
};

export const commentService = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
  deleteComment,
};
