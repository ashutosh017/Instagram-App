import { useState } from "react";
import Home from "./Home";
import Search from "./Search";
import Profile from "./Profile";

const InstagramFeed = () => {
  const [screen, setScreen] = useState("home")
  return <div>
      <nav className="w-screen h-16 sticky  border border-b-2 flex items-center px-2">
        <h2 className="border border-black rounded-2xl bg-zinc-800 text-white w-fit p-2 text-2xl font-bold">Instagram</h2>
      </nav>
      {screen==="home"?<Home/>:screen==="search"?<Search/>:<Profile/>}

    <div className="absolute bottom-0 flex w-screen justify-between">
      <button onClick={()=>{
        setScreen('home')
      }} className="border border-black text-center flex-auto">Home</button>
      <button onClick={()=>{
        setScreen('search')

      }} className="border border-black text-center flex-auto">Search</button>
      <button onClick={()=>{
        setScreen('profile')

      }} className="border border-black text-center flex-auto">Profile</button>
    </div>
  </div>
};

export default InstagramFeed;