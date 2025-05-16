"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supautil";
import { BankStatement, Transaction } from "@/types/statement";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";

// Update the Message interface to be more specific
interface Message {
    role: 'user' | 'model' | 'assistant';
    parts: string[];
}

export default function AdvisorPage() {
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [conversationObject, setConversationObject] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchTransactions();
        initializeChat();
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [chatHistory]);

    const fetchTransactions = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: statements } = await supabase
            .from('statements')
            .select('*')
            .eq('user_id', session.user.id);

        if (statements) {
            const allTx = statements.flatMap(s => {
                try {
                    return typeof s.transactions === 'string'
                        ? JSON.parse(s.transactions)
                        : s.transactions || [];
                } catch (e) {
                    console.error('Error parsing transactions:', e);
                    return [];
                }
            });
            setTransactions(allTx);
        }
    };

    const initializeChat = async () => {
        console.log('🔧 Initializing chat...');
        try {
            const response = await axios.post('/api/message', {});
            console.log('🎉 Chat initialized with response:', response.data);
            const apiData = response?.data;
            if (apiData) {
                setConversationObject(apiData?.conversation);
                // Ensure role is typed correctly
                setChatHistory([{ 
                    role: 'model' as const, 
                    parts: [apiData.message] 
                }]);
                console.log('✨ Initial chat state set with history:', chatHistory);
            }
        } catch (error) {
            console.error('❌ Error initializing chat:', error);
        }
    };

    const handleChatInput = async () => {
        const message = messageInput;
        if (messageInput === '') return;

        setLoading(true);
        console.log('🚀 Sending message:', message);
        
        try {
            // Use type assertion to ensure correct typing
            const updatedHistory: Message[] = [
                ...chatHistory,
                {
                    role: 'user' as const,
                    parts: [message]
                }
            ];
            setChatHistory(updatedHistory);
            
            console.log('📤 Making API request...');
            const apiResponse = await axios.post('/api/message', {
                message,
                conversation: conversationObject
            });

            console.log('📥 Received API response:', apiResponse.data);
            const apiData = apiResponse?.data;
            
            if (apiData?.message) {
                const newHistory: Message[] = [
                    ...updatedHistory,
                    {
                        role: 'model' as const,
                        parts: [apiData.message]
                    }
                ];
                setChatHistory(newHistory);
                setConversationObject(apiData?.conversation);
                console.log('🔄 Chat history updated:', newHistory);
            }
        } catch (error) {
            console.error('❌ Error sending message:', error);
            const errorHistory: Message[] = [
                ...chatHistory,
                {
                    role: 'model' as const,
                    parts: ['Sorry, I encountered an error. Please try again.']
                }
            ];
            setChatHistory(errorHistory);
        } finally {
            console.log('✅ Chat interaction completed');
            setLoading(false);
            setMessageInput('');
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Card className="h-[80vh] flex flex-col">
                <ScrollArea ref={scrollRef} className="flex-1 p-4">
                    <div className="space-y-4">
                        {chatHistory.map((message, index) => (
                            <div
                                key={`${message.role}-${index}`}
                                className={`flex items-start gap-3 ${
                                    message.role === 'model' ? 'flex-row' : 'flex-row-reverse'
                                }`}
                            >
                                <Avatar>
                                    <AvatarFallback>
                                        {message.role === 'model' ? 'AI' : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                                        message.role === 'model'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    {message.parts[0]}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-2 text-gray-500">
                                <div className="animate-bounce">●</div>
                                <div className="animate-bounce delay-100">●</div>
                                <div className="animate-bounce delay-200">●</div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleChatInput();
                    }}
                    className="p-4 border-t"
                >
                    <div className="flex gap-2">
                        <Input
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Ask about your finances..."
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading}>
                            Send
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}