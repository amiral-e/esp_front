"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { sendMessage } from "@/actions/conversations"
import { useChatContext } from "./chat-context"
import { getPredifinedQuestions } from "@/actions/predifined_questions"

export default function PredefinedQuestions() {
  const [questions, setQuestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const { id } = useParams()
  const router = useRouter()
  const { setIsLoading: setChatLoading } = useChatContext()

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getPredifinedQuestions()
        setQuestions(response || [])
      } catch (error) {
        console.error("Error fetching predefined questions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const handleQuestionClick = async (questionText: string) => {
    setChatLoading(true)
    try {
      await sendMessage(Number(id), questionText)
      router.refresh()
    } catch (error) {
      console.error("Error sending predefined question:", error)
    } finally {
      setChatLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mb-6">
        <h3 className="text-xs font-medium text-muted-foreground mb-3">Questions suggérées</h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-32 rounded-full" />
          ))}
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return null
  }

  const visibleQuestions = showAll ? questions : questions.slice(0, 2)

  return (
    <div className="mt-2 mb-2">
      <h3 className="text-xs font-medium text-muted-foreground mb-3">Questions suggérées</h3>
      <div className="flex flex-wrap gap-2">
        {visibleQuestions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-full px-4 bg-background hover:bg-muted"
            onClick={() => handleQuestionClick(question)}
          >
            <MessageSquare className="mr-2 h-2 w-2" />
            <span>{question}</span>
          </Button>
        ))}
  
        {questions.length > 2 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs px-4 underline"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Voir moins" : "Voir plus..."}
          </Button>
        )}
      </div>
    </div>
  )  
}