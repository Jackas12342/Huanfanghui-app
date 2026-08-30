import { MessageCircle } from "lucide-react";
import { AppFrame } from "@/components/layout/AppFrame";
export default function MessagesPage() { return <AppFrame eyebrow="MESSAGES" title="沟通置换机会"><div className="empty-state"><MessageCircle size={32} /><h2>双方有意后，在这里开始沟通</h2><p>消息功能将在接入账号与实时通讯服务后开放。目前你有 3 条待处理的匹配通知。</p></div></AppFrame>; }
