import { prisma } from "../../lib/prisma";
import { notificationService } from "../notification/notification.service";

interface IActor {
  actorId: string;
  name: string;
}

const toggleLike = async (actor: IActor, postId: string) => {
  const { actorId, name: actorName } = actor;

  // Check post exists
  await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  // Check existing like
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: actorId,
        postId,
      },
    },
  });

  // If already liked -> unlike
  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    return {
      liked: false,
      message: "Post unliked successfully",
    };
  }

  // If not liked -> create like
  const like = await prisma.like.create({
    data: {
      userId: actorId,
      postId,
    },
  });

  notificationService
    .sendPostNotification({
      postId,
      actorId,
      actorName,
      notificationActionType: "LIKE",
    })
    .catch((err) => console.error("Notification error:", err));

  return {
    liked: true,
    message: "Post liked successfully",
    like,
  };
};

export const likeService = {
  toggleLike,
};
