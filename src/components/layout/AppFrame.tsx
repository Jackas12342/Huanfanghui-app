import Link from "next/link";
import { ArrowLeft, Bell, Building2 } from "lucide-react";

export function AppFrame({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return <div className="app-shell"><header className="app-header"><Link href="/" className="brand"><span className="brand-mark"><Building2 size={18} /></span><span>换房 <i>Match</i></span></Link><nav className="app-nav"><Link href="/dashboard">工作台</Link><Link href="/matches">智能匹配</Link><Link href="/messages">消息</Link><Link href="/profile">我的</Link></nav><div className="app-user"><Bell size={18} /><span>林先生</span><span className="user-avatar">林</span></div></header><main className="app-main"><Link href="/" className="back-link"><ArrowLeft size={15} /> 返回首页</Link><span className="section-kicker">{eyebrow}</span><h1 className="app-title">{title}</h1>{children}</main></div>;
}
