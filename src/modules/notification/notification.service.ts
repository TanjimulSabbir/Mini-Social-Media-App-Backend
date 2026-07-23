import { prisma } from "../../lib/prisma";
import { sendNotification } from "../../utils/sendNotifications";
import { INotificationActionType } from "./notification.interface";

interface ISendPostNotificationPayload {
  postId: string;
  actorId: string;
  actorName: string;
  notificationActionType: INotificationActionType;
}

const sendPostNotification = async (payload: ISendPostNotificationPayload) => {
  const { postId, actorId, actorName, notificationActionType } = payload;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: {
        select: {
          id: true,
          fcmToken: true,
          name: true,
        },
      },
    },
  });

  if (!post) return;

  // User has not enabled notifications
  if (!post.author.fcmToken) return;

  // Don't notify yourself
  if (post.author.id === actorId) return;

  let title = "";
  let body = "";

  switch (notificationActionType) {
    case "LIKE":
      title = "New Like ❤️";
      body = `Hi ${post.author.name}!, ${actorName} liked your post.`;
      break;

    case "COMMENT":
      title = "New Comment 💬";
      body = `Hi ${post.author.name}!, ${actorName} commented on your post.`;
      break;
  }

  await sendNotification({
    token: post.author.fcmToken,
    title,
    body,
  });
};

export const notificationService = {
  sendPostNotification,
};
