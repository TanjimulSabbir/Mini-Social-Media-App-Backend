import { prisma } from "../../lib/prisma";


const toggleLike = async (
    userId: string,
    postId: string
) => {

    // Check post exists
    await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    });


    // Check existing like
    const existingLike = await prisma.like.findUnique({
        where: {
            userId_postId: {
                userId,
                postId
            }
        }
    });


    // If already liked -> unlike
    if(existingLike){

        await prisma.like.delete({
            where:{
                id: existingLike.id
            }
        });


        return {
            liked: false,
            message: "Post unliked successfully"
        };
    }


    // If not liked -> create like
    const like = await prisma.like.create({
        data:{
            userId,
            postId
        }
    });


    return {
        liked: true,
        message: "Post liked successfully",
        like
    };
};


export const likeService = {
    toggleLike
};