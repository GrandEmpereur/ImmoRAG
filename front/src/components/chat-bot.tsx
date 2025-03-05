'use client'

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { MessageCircle, Send, FileText, Home, Search, Calculator, Upload } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import React from "react"

interface Message {
    content: string
    role: 'user' | 'assistant'
    timestamp: Date
}

interface ActionButton {
    icon: React.ReactNode
    label: string
    action: () => void
}

const WELCOME_MESSAGE: Message = {
    content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    role: 'assistant',
    timestamp: new Date()
}

export function ChatBot() {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [botAvatar, setBotAvatar] = useState('')
    const [showInput, setShowInput] = useState(false)
    const [isFileUploaded, setIsFileUploaded] = useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    useEffect(() => {
        // Charger l'avatar du bot depuis randomuser.me
        fetch('https://randomuser.me/api/')
            .then(response => response.json())
            .then(data => {
                setBotAvatar(data.results[0].picture.medium)
            })
    }, [])

    const actionButtons: ActionButton[] = [
        {
            icon: <FileText className="h-4 w-4" />,
            label: "Discussion via fichiers",
            action: () => handleActionClick("Je voudrais discuter à partir d'un fichier")
        },
    ]

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([WELCOME_MESSAGE])
        }
    }, [isOpen])

    const handleActionClick = async (message: string) => {
        setShowInput(true)
        setMessages(prev => [
            ...prev,
            {
                content: message,
                role: 'user',
                timestamp: new Date()
            },
            {
                content: message.includes("fichier") 
                    ? "Pour commencer, veuillez me transmettre votre fichier (CSV, JSON ou PDF) en utilisant le bouton d'upload ci-dessous 📎"
                    : `Je vais vous aider avec : ${message.toLowerCase()}. Que souhaitez-vous savoir ?`,
                role: 'assistant',
                timestamp: new Date()
            }
        ])
    }

    const uploadFile = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Erreur lors de l\'upload du fichier')
            }

            const data = await response.json()
            setIsFileUploaded(true)
            return data
        } catch (error) {
            console.error('Erreur:', error)
            throw error
        }
    }

    const askQuestion = async (question: string) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            })

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi de la question')
            }

            const data = await response.json()
            return data.answer
        } catch (error) {
            console.error('Erreur:', error)
            throw error
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            try {
                setMessages(prev => [...prev, {
                    content: `J'ai envoyé le fichier : ${file.name}`,
                    role: 'user',
                    timestamp: new Date()
                }])

                await uploadFile(file)
                
                setMessages(prev => [...prev, {
                    content: "J'ai bien reçu et analysé votre fichier. Vous pouvez maintenant me poser des questions sur son contenu.",
                    role: 'assistant',
                    timestamp: new Date()
                }])
            } catch (error) {
                toast.error("Erreur lors de l'upload du fichier")
                setMessages(prev => [...prev, {
                    content: "Désolé, il y a eu une erreur lors du traitement de votre fichier. Veuillez réessayer.",
                    role: 'assistant',
                    timestamp: new Date()
                }])
            }
        }
    }

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return

        const userMessage = inputMessage
        setInputMessage('')
        
        setMessages(prev => [...prev, {
            content: userMessage,
            role: 'user',
            timestamp: new Date()
        }])

        try {
            if (isFileUploaded) {
                const answer = await askQuestion(userMessage)
                setMessages(prev => [...prev, {
                    content: answer,
                    role: 'assistant',
                    timestamp: new Date()
                }])
            } else {
                setMessages(prev => [...prev, {
                    content: "Je suis là pour vous aider avec vos questions immobilières !",
                    role: 'assistant',
                    timestamp: new Date()
                }])
            }
        } catch (error) {
            toast.error("Erreur lors de l'envoi de la question")
            setMessages(prev => [...prev, {
                content: "Désolé, je n'ai pas pu traiter votre question. Veuillez réessayer.",
                role: 'assistant',
                timestamp: new Date()
            }])
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <SheetTrigger asChild>
                            <Button
                                size="icon"
                                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
                            >
                                <MessageCircle className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="mr-2">
                        <p>Discutez avec notre assistant immobilier</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <SheetContent side="right" className="w-[500px] sm:w-[540px] flex flex-col h-full p-0">
                <SheetHeader className="flex flex-row items-center gap-2 p-4 pb-0 shrink-0">
                    <Avatar>
                        <AvatarImage src={botAvatar} />
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <SheetTitle>Assistant ImmoRAG</SheetTitle>
                </SheetHeader>
                <div className="flex-1 min-h-0 mt-4">
                    <ScrollArea className="h-full border-b">
                        <div className="flex flex-col gap-4 p-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex w-full gap-2 rounded-lg p-4",
                                        message.role === "assistant"
                                            ? "bg-muted"
                                            : "bg-primary text-primary-foreground"
                                    )}
                                >
                                    {message.role === "assistant" && (
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarImage src={botAvatar} />
                                            <AvatarFallback>AI</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className="flex-1 break-words">
                                        <p className="text-sm">{message.content}</p>
                                        {message.role === "assistant" && messages.length === 1 && (
                                            <div className="mt-4 grid grid-cols-1 gap-2">
                                                {actionButtons.map((button, index) => (
                                                    <Button
                                                        key={index}
                                                        variant="outline"
                                                        className="h-auto p-3 text-sm flex items-center gap-2 justify-start"
                                                        onClick={() => handleActionClick(button.label)}
                                                    >
                                                        <div className="shrink-0">
                                                            {button.icon}
                                                        </div>
                                                        <span className="text-left">{button.label}</span>
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                {showInput && (
                    <div className="p-4 shrink-0">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }} className="flex gap-4">
                            <Input
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Écrivez votre message..."
                                className="flex-1"
                            />
                            <Button type="submit" size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                            <input
                                type="file"
                                accept=".csv,.json,.pdf"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                            />
                            <Button 
                                type="button" 
                                size="icon" 
                                variant="outline" 
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
} 