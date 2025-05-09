import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import EditProfile from "./EditProfile";
export default function () {
    const [subScreen,setSubScreen] = useState("")
  const [userMetadata, setUserMetadata] = useState<{
    followersCount: number;
    followingCount: number;
    description: string | null;
    profilePic: string ;
  }>();
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BACKEND_URL}/api/v1/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserMetadata(res.data.data);
      console.log(res.data);
    })();
  }, []);
  return (
    <div className="px-2 flex flex-col justify-center">
      <section className="flex justify-around border border-black mt-2 h-32 items-center ">
        <div className=" flex flex-col  px-4 py-2  border ">
          <div className="border border-black rounded-full p-4 h-16 w-16 flex items-center justify-center">
            <img
              src={userMetadata ? userMetadata.profilePic : ""}
              alt="Profile"
            />
          </div>
          <div>
            <p>{userMetadata?.description ?? "bio..."}</p>
          </div>
        </div>
        <div className="flex space-x-4  border">
          <div className="text-center">
            <p>0</p>
            <p>Posts</p>
          </div>
          <div className="text-center">
            <p>{userMetadata ? userMetadata.followersCount : "0"}</p>
            <p>Followers</p>
          </div>
          <div className="text-center">
            <p>{userMetadata ? userMetadata.followingCount : "0"}</p>
            <p>Following</p>
          </div>
        </div>
      </section>

      <section className="flex justify-around  mt-2 items-center w-screen ">
        <button className="border flex-auto text-center cursor-pointer" onClick={()=>{
            setSubScreen("edit-profile")
        }}>Edit Profile</button>
        <button className="border flex-auto text-center cursor-pointer">Share Profile</button>
      </section>

      {subScreen==="edit-profile"?<EditProfile/>:""}
    </div>
  );
}
