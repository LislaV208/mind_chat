export interface Conversation {
    id: string
    title: string
    messages: Message[]
    lastMessage?: string
    createdAt: Date
    updatedAt: Date
}

export interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}
