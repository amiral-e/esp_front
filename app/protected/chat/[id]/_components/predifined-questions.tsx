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

  if(questions.length === 0)
  {
    return null;
  }
  if (isLoading) {
    return (
      <div className="mb-4 px-2">
        <h3 className="text-xs font-medium text-muted-foreground mb-2">Questions suggérées</h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-7 w-28" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4 px-2">
      <h3 className="text-xs font-medium text-muted-foreground mb-2">Questions suggérées</h3>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="h-7 text-xs py-0"
            onClick={() => handleQuestionClick(question)}
          >
            <MessageSquare className="mr-1 h-3 w-3" />
            <span className="truncate max-w-[120px]">{question}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
