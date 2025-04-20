"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const ConversationPage = () => {
  const router = useRouter()

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-3xl font-bold tracking-tight">Commencer une conversation</h1>
        <p className="text-muted-foreground">
          Posez des questions, obtenez des réponses, et explorez vos collections de documents.
        </p>
        <Button size="lg" className="mt-4" onClick={() => router.push("/conversation/new")}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Nouvelle conversation
        </Button>
      </div>
    </div>
  )
}

export default ConversationPage