import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabaseClient";
import AdminLayout from "../components/AdminLayout";

type UserConversation = {
  user_id: string;
  username: string;
  last_message_time: string;
};
type Message = {
  id: number;
  content: string | null;
  sent_by_admin: boolean;
  user_id: string;
  created_at: string;
};

function ChatContent() {
  const [conversations, setConversations] = useState<UserConversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserConversation | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // This logic for fetching conversations is correct and stays the same.
  useEffect(() => {
    const fetchConversations = async () => {
      const { data } = await supabase.rpc("get_user_conversations");
      if (data) setConversations(data);
    };
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  // This logic for fetching and subscribing to messages is also correct.
  useEffect(() => {
    if (!selectedUser) return;
    let channel: any;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", selectedUser.user_id)
        .order("created_at");
      setMessages(data || []);
    };
    fetchMessages();
    channel = supabase
      .channel(`admin-chat-for-user-${selectedUser.user_id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `user_id=eq.${selectedUser.user_id}`,
        },
        () => fetchMessages(),
      )
      .subscribe();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [selectedUser]);

  useEffect(scrollToBottom, [messages]);

  // --- NEW, ROBUST SEND MESSAGE FUNCTION WITH OPTIMISTIC UI ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = newMessage.trim();
    if (messageContent === "" || !selectedUser) return;

    // 1. Create a temporary message for instant display
    const optimisticMessage: Message = {
      id: Date.now(),
      content: messageContent,
      sent_by_admin: true, // This is an admin message
      user_id: selectedUser.user_id,
      created_at: new Date().toISOString(),
    };

    // 2. Add it to the screen immediately
    setMessages((currentMessages) => [...currentMessages, optimisticMessage]);
    setNewMessage("");

    // 3. In the background, send the real message to the database
    await supabase.from("messages").insert({
      user_id: selectedUser.user_id,
      content: messageContent,
      sent_by_admin: true,
    });
  };

  // --- NEW, ROBUST DELETE FUNCTION WITH OPTIMISTIC UI ---
  const handleDeleteMessage = async (messageId: number) => {
    // 1. Instantly remove the message from the screen
    setMessages((currentMessages) =>
      currentMessages.filter((msg) => msg.id !== messageId),
    );
    // 2. In the background, send the delete command
    await supabase.from("messages").delete().eq("id", messageId);
  };

  // The JSX part of the component
  return (
    <div
      style={{ display: "flex", height: "calc(100vh - 4rem)", color: "white" }}
    >
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #374151",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2
          style={{
            padding: "1rem",
            borderBottom: "1px solid #374151",
            margin: 0,
          }}
        >
          Conversations
        </h2>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {conversations.map((conv) => (
            <div
              key={conv.user_id}
              onClick={() => setSelectedUser(conv)}
              style={{
                padding: "1rem",
                cursor: "pointer",
                borderBottom: "1px solid #374151",
                backgroundColor:
                  selectedUser?.user_id === conv.user_id
                    ? "#3b82f6"
                    : "transparent",
              }}
            >
              <p style={{ margin: 0, fontWeight: "bold" }}>{conv.username}</p>
              <p
                style={{
                  margin: "0.25rem 0 0 0",
                  fontSize: "0.8rem",
                  color: "#9ca3af",
                }}
              >
                Last message:{" "}
                {new Date(conv.last_message_time).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#111827",
        }}
      >
        {selectedUser ? (
          <>
            <div
              style={{
                padding: "1rem",
                borderBottom: "1px solid #374151",
                flexShrink: 0,
              }}
            >
              <h3 style={{ margin: 0 }}>Chat with {selectedUser.username}</h3>
            </div>
            <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: msg.sent_by_admin
                      ? "flex-end"
                      : "flex-start",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: msg.sent_by_admin
                        ? "#10b981"
                        : "#374151",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "12px",
                      maxWidth: "70%",
                    }}
                  >
                    {msg.content}
                  </div>
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#9ca3af",
                      cursor: "pointer",
                      marginLeft: "0.5rem",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSendMessage}
              style={{
                display: "flex",
                padding: "1rem",
                borderTop: "1px solid #374155",
                gap: "1rem",
                flexShrink: 0,
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your reply..."
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#374151",
                  color: "white",
                }}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#10b981",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Send Reply
              </button>
            </form>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
            }}
          >
            <p>Select a conversation to begin chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <AdminLayout>
      <ChatContent />
    </AdminLayout>
  );
}
