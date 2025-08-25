// Full corrected code for pages/chat.tsx
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient'; // Corrected Path
import AdminLayout from '../components/AdminLayout';
import styles from '../styles/AdminChat.module.css';

// ... (rest of the file is the same, but replace all to be safe)
type UserConversation = { user_id: string; username: string; last_message_time: string; };
type Message = { id: number; content: string | null; sent_by_admin: boolean; user_id: string; created_at: string; };

function ChatContent() {
  const [conversations, setConversations] = useState<UserConversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => {
    const fetchConversations = async () => { const { data } = await supabase.rpc('get_user_conversations'); if (data) setConversations(data); };
    fetchConversations();
    const channel = supabase.channel('public:messages').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => fetchConversations()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);
  useEffect(() => {
    if (!selectedUser) return;
    let channel: any;
    const fetchMessages = async () => { const { data } = await supabase.from('messages').select('*').eq('user_id', selectedUser.user_id).order('created_at'); setMessages(data || []); };
    fetchMessages();
    channel = supabase.channel(`admin-chat-for-user-${selectedUser.user_id}`).on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `user_id=eq.${selectedUser.user_id}` }, () => fetchMessages()).subscribe();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, [selectedUser]);
  useEffect(scrollToBottom, [messages]);
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = newMessage.trim();
    if (messageContent === '' || !selectedUser) return;
    const optimisticMessage: Message = { id: Date.now(), content: messageContent, sent_by_admin: true, user_id: selectedUser.user_id, created_at: new Date().toISOString() };
    setMessages(current => [...current, optimisticMessage]);
    setNewMessage('');
    await supabase.from('messages').insert({ user_id: selectedUser.user_id, content: messageContent, sent_by_admin: true });
  };
  const handleDeleteMessage = async (messageId: number) => {
    setMessages(current => current.filter(msg => msg.id !== messageId));
    await supabase.from('messages').delete().eq('id', messageId);
  };
  return (
    <div className={styles.chatContainer}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarHeader}>Conversations</h2>
        <div className={styles.conversationList}>
          {conversations.map(conv => (<div key={conv.user_id} onClick={() => setSelectedUser(conv)} className={`${styles.conversationItem} ${selectedUser?.user_id === conv.user_id ? styles.activeConversation : ''}`}><div className={styles.avatar}>{conv.username?.charAt(0).toUpperCase()}</div><div className={styles.conversationDetails}><p className={styles.conversationUsername}>{conv.username}</p><p className={styles.conversationTimestamp}>Last message: {new Date(conv.last_message_time).toLocaleString()}</p></div></div>))}
        </div>
      </div>
      <div className={styles.chatWindow}>
        {selectedUser ? (<><div className={styles.chatHeader}><h3>Chat with {selectedUser.username}</h3></div><div className={styles.messageArea}>{messages.map(msg => (<div key={msg.id} className={`${styles.messageWrapper} ${msg.sent_by_admin ? styles.adminMessage : styles.userMessage}`}><div className={`${styles.chatBubble} ${msg.sent_by_admin ? styles.adminBubble : styles.userBubble}`}>{msg.content}</div><button onClick={() => handleDeleteMessage(msg.id)} className={styles.deleteButton}>×</button></div>))}<div ref={messagesEndRef} /></div><form onSubmit={handleSendMessage} className={styles.form}><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your reply..." className={styles.input} /><button type="submit" disabled={!newMessage.trim()} className={styles.sendButton}>Send Reply</button></form></>) : (<div className={styles.placeholder}><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg><p>Select a conversation to begin chatting.</p></div>)}
      </div>
    </div>
  );
}
export default function ChatPage() { return (<AdminLayout><ChatContent /></AdminLayout>); }