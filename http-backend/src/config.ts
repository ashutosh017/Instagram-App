
export const JWT_SECRET = process.env.JWT_SECRET ?? "jwt_secret"
export const commentSelect: any = (depth: number) => {
  if (depth == 0) return;
  return {
    text: true,
    replies: commentSelect(depth - 1),
    dateAdded: true,
    likes: true,
  };
};