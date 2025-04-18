import { useEffect } from "react";
import { Link, useNavigate } from "react-router";


function App() {
  const navigate = useNavigate();
  useEffect(()=>{
    const token = localStorage.getItem("token")
    console.log("token: ",token)
    if(token){
      console.log("yes token exists");
      navigate("/feed")
      return;
    }
    navigate("/auth")
  },[])
  return (
    <div>

    </div>
  );
}

export default App;
