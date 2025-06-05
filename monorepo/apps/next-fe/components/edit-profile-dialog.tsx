"use client";
import { CldUploadWidget } from "next-cloudinary";

import { CldUploadButton } from "next-cloudinary";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { getToken } from "@/lib/auth";
import axios from "axios";
import { useUserStore } from "@/app/store";

export function EditProfileDialog() {
  const [open, setOpen] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const profilePicRef = useRef<string>("")
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUserStore();
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfilePic(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebsite(e.target.value);
  };

  const handleSave = async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) {
      return;
    }

    await handleUpload();
    console.log("profilePicRef.current", profilePicRef.current);
    const response = await axios.put(
      "http://localhost:3001/api/v1/users/profile",
      {
        profilePic:
          profilePicRef.current.length > 0 ? profilePicRef.current : (user?.profilePic ?? ""),
        name: name.length > 0 ? name : (user?.name ?? ""),
        username: username.length > 0 ? username : (user?.username ?? ""),
        about: bio.length > 0 ? bio : (user?.description ?? ""),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      setOpen(false);
    }
    setLoading(false);

  };
  const handleUpload = async () => {
    console.log("handleupload called");
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "instagram-app"); // replace with your preset

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      // setImageUrl(data.secure_url);

      // ✅ Send URL to your backend
      // await axios.post("/api/your-backend-endpoint", {
      //   imageUrl: data.secure_url,
      // });
      console.log("Image uploaded:", data.secure_url);
      setProfilePic(data.secure_url);
      profilePicRef.current = data.secure_url;
    } catch (err) {
      console.error("Upload failed:", err);
    } 
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src="/placeholder.svg?height=96&width=96&text=User"
                  alt="Profile"
                />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              {/* <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Change profile picture</span>
              </Button> */}
            </div>
            <span className="text-sm text-muted-foreground">
              Change profile photo
            </span>
          </div>

          <div className="grid gap-2">
            {/* <Label htmlFor="profilePic ">Profile Picture Link</Label> */}

            {/* <CldUploadWidget uploadPreset="instagram-app">
              {({  }) => {
                return <button onClick={() => handleUpload()}>Upload an Image</button>;
              }}
            </CldUploadWidget> */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
               className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />

            {/* <button disabled={!file || loading} onClick={handleUpload}>
              Upload
            </button> */}
            {/* <Input id="porfilePic" defaultValue={user?.profilePic } onChange={handleProfilePicChange} /> */}

            {/* <CldUploadButton uploadPreset="<Upload Preset>" /> */}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              defaultValue={user?.name}
              onChange={handleNameChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              defaultValue={user?.username}
              onChange={handleUsernameChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              defaultValue={user?.description}
              rows={3}
              onChange={handleBioChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              defaultValue={website}
              onChange={handleWebsiteChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={loading}  onClick={handleSave}>{loading?"Saving Changes...":"Save Changes"}</Button>
        </DialogFooter>
        
      </DialogContent>
    </Dialog>
  );
}
