import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

interface UserChatProps {
  message: string;
  userAvatar: string;
}

const UserChat = ({ message, userAvatar }: UserChatProps) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={userAvatar} alt="user avatar" />
        <AvatarFallback>CC</AvatarFallback>
      </Avatar>
      <div className="text-md">{message}</div>
    </div>
  );
};

export default UserChat;
