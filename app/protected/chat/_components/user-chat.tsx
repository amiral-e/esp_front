import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserChatProps {
  message: string
  userAvatar: string
}

const UserChat = ({ message, userAvatar }: UserChatProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-3 max-w-md">
        <p className="text-sm">{message}</p>
      </div>
      <Avatar>
        <AvatarImage src={userAvatar || "/placeholder.svg"} alt="user avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default UserChat