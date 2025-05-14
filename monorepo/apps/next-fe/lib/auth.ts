'use server'
import axios from "axios";
import { cookies } from "next/headers";

export const setToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set("token",token)
}
export const getToken = async ()=>{
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    return token?.value;
}
export const getSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const response = await axios.get("http://localhost:3001/api/v1/users", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if(response.status !== 200){
        return null;
    }
    return response;
}



