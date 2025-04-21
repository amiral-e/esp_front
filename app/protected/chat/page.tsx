"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Modal from "./_components/modal"
import { getUserInfo } from "@/actions/oauth"
import { useEffect, useState } from "react"

const ConversationPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string }>({ id: "" })

  useEffect(() => {
    const userInfo = async () => {
      const user = await getUserInfo()
      if (user && user.id) {
        setUser({ id: user.id })
      }
    }
    userInfo()
  }, [])

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-3xl font-bold tracking-tight">Commencer une conversation</h1>
        <p className="text-muted-foreground">
          Posez des questions, obtenez des réponses, et explorez vos collections de documents.
        </p>
        <Modal userId={user.id || ""}>
          <Button size="lg" className="mt-4">
            <PlusCircle className="mr-2 h-5 w-5" />
            Nouvelle conversation
          </Button>
        </Modal>
      </div>
    </div>
  )
}

export default ConversationPage