import { CommentStatus } from "../../../generated/prisma/enums";

export interface ICreateCommentPayload {
  postId: string;
  authorId: string;
  content: string;
  actor: {
    actorId: string;
    actorName: string;
  }; // Assuming 'actor' is a field in the comment
}

export interface IUpdateCommentPayload {
  content?: string;
  status?: CommentStatus;
}
