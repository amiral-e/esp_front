"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { formatMarkdown } from "@/lib/formatMarkdown"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface MessageProps {
    message: {
        role: string
        content: string
        sources?: {
            collection: string
            documents: string[]
        }[]
    }
}

export default function MessageBubble({ message }: MessageProps) {
    const [copied, setCopied] = useState(false)
    const [sourcesOpen, setSourcesOpen] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const hasSources = message.sources && message.sources.length > 0

    return (
        <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10 border">
                <AvatarFallback>AI</AvatarFallback>
            </Avatar>

            <div className="flex flex-col w-full max-w-[85%]">
                <span className="text-sm font-medium mb-1">Assistant</span>

                <div className="rounded-2xl px-4 py-3 bg-muted">
                    <div
                        className="text-sm prose prose-slate dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
                    />

                    <div className="flex items-center mt-2 gap-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={handleCopy}>
                            {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                            {copied ? "Copié" : "Copier"}
                        </Button>
                    </div>
                </div>

                {hasSources && (
                    <Collapsible open={sourcesOpen} onOpenChange={setSourcesOpen} className="mt-2 w-full">
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-xs">
                                {sourcesOpen ? "Masquer les sources" : "Afficher les sources"}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                            <Card className="bg-muted/50 border-dashed">
                                <CardContent className="p-3">
                                    <h4 className="text-xs font-medium mb-2">Sources:</h4>
                                    <div className="space-y-2">
                                        {message.sources?.map((source, idx) => (
                                            <div key={idx} className="text-xs">
                                                <Badge variant="outline" className="mb-1">
                                                    {source.collection.split("_")[1]}
                                                </Badge>
                                                <ul className="list-disc pl-4 space-y-1">
                                                    {source.documents.map((doc, docIdx) => (
                                                        <li key={docIdx}>{doc}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </CollapsibleContent>
                    </Collapsible>
                )}
            </div>
        </div>
    )
}