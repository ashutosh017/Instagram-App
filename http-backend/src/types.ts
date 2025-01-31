import z from "zod";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const signinSchema = z.object({
  username: z.string().min(3).max(100),
  password: z.string().min(3).max(100),
});

export const signupSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().min(3).max(100).email(),
  username: z.string().min(3).max(100),
  password: z.string().min(3).max(100),
  profilePic: z.string().min(3).max(100),
});

export const sendMessageSchema = z.object({
  message: z.string().max(10000),
});

export const editProfileSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  email: z.string().min(3).max(100).email().optional(),
  username: z.string().min(3).max(100).optional(),
  password: z.string().min(3).max(100).optional(),
  profilePic: z.string().min(3).max(100).optional(),
  about: z.string().max(200).optional(),
  gender: z.enum(["MALE", "FEMALE", "PREFER_NOT_TO_SAY"]).optional(),
  DOB: z.coerce.date().optional(),
});

export const changePrivacySchema = z.object({
  setTo: z.enum(["PUBLIC", "PRIVATE"]),
});

export const changePasswordSchema = z.object({
  newPassword: z.string().min(4).max(1000),
});

// ***************************

export const likedPostsSchema = z.object({
  postId: z.string().nonempty(),
});

export const commentsSchema = z.object({
  postId: z.string().nonempty().max(1000),
  comment: z.string().min(1).max(1000),
});

export const sharesSchema = z.object({
  postId: z.string().nonempty().max(1000),
  recepientIds: z.array(z.string()).max(100).nonempty(),
});

export const uploadPostSchema = z.object({
  postUrl: z.string().nonempty(),
  description: z.string().max(500).optional(),
  tags: z.array(z.string()).max(20).optional(),
});

export const postIdType = z.string().nonempty().max(100);

export const updatePostSchema = z.object({
  postId:z.string().nonempty().max(100),
  description: z.string().nonempty().max(500).optional(),
  tags: z.array(z.string()).max(20).optional(),
});


// *************************************

export const replyToCommentSchema = z.object({
  commentId: z.string().nonempty().max(100),
  postId:z.string().nonempty().max(100),
  reply:z.string().nonempty().max(1000)
})