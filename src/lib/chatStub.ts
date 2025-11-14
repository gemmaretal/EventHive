export interface ChatMessage {
  id: string
  groupId: string
  userId: string
  userName: string
  content: string
  timestamp: string
}

type MessageCallback = (messages: ChatMessage[]) => void

class ChatStub {
  private messages: Map<string, ChatMessage[]> = new Map()
  private subscribers: Map<string, Set<MessageCallback>> = new Map()

  subscribe(groupId: string, callback: MessageCallback): () => void {
    if (!this.subscribers.has(groupId)) {
      this.subscribers.set(groupId, new Set())
    }
    this.subscribers.get(groupId)!.add(callback)

    const currentMessages = this.messages.get(groupId) || []
    callback(currentMessages)

    return () => {
      const callbacks = this.subscribers.get(groupId)
      if (callbacks) {
        callbacks.delete(callback)
      }
    }
  }

  unsubscribe(groupId: string, callback: MessageCallback): void {
    const callbacks = this.subscribers.get(groupId)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }

  publish(
    groupId: string,
    message: Omit<ChatMessage, 'id' | 'timestamp'>
  ): void {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    if (!this.messages.has(groupId)) {
      this.messages.set(groupId, [])
    }

    this.messages.get(groupId)!.push(newMessage)

    const callbacks = this.subscribers.get(groupId)
    if (callbacks) {
      const allMessages = this.messages.get(groupId)!
      callbacks.forEach(callback => callback(allMessages))
    }
  }

  getMessages(groupId: string): ChatMessage[] {
    return this.messages.get(groupId) || []
  }

  clearMessages(groupId: string): void {
    this.messages.set(groupId, [])
    const callbacks = this.subscribers.get(groupId)
    if (callbacks) {
      callbacks.forEach(callback => callback([]))
    }
  }
}

export const chatStub = new ChatStub()
