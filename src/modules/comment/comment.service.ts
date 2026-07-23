import { prisma } from "../../lib/prisma";
import { notificationService } from "../notification/notification.service";
import {
  ICreateCommentPayload,
  IUpdateCommentPayload,
} from "./comment.interface";

const createComment = async (
  postId: string,
  actor: { id: string; name: string },
  payload: { content: string },
) => {
  await prisma.post.findUniqueOrThrow({
    where: { id: postId },
  });

  const comment = await prisma.comment.create({
    data: {
      content: payload.content,
      authorId: actor.id,
      postId,
    },
  });

  notificationService
    .sendPostNotification({
      postId,
      actorId: actor.id,
      actorName: actor.name,
      notificationActionType: "COMMENT",
    })
    .catch((err) => console.error("Notification error:", err));

  return comment;
};
const getCommentByPostId = async (postId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return comments;
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
  getCommentByPostId,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
  deleteComment,
};
