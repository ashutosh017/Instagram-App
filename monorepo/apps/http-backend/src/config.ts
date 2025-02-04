

export const commentSelect: any = (depth: number) => {
  if (depth == 0) return;
  return {
    text: true,
    replies: {
      select:commentSelect(depth - 1)
    },
    dateAdded: true,
    likes: true,
  };
};