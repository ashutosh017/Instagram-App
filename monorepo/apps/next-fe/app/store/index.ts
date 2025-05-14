import { create } from "zustand"

interface User {
  id: string;
  name: string;
  username: string;
  profilePic: string;
  description: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}
interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
}


export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
