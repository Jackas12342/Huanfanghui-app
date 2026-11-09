"use client";

import Link from "next/link";
import { ArrowLeft, Bell, Building2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { accountStateLabel, loadSession, signOut, verificationLabel, type SessionState } from "@/lib/mvp";

export function AppFrame({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  const [session, setSession] = useState<SessionState | null>(null);

  useEffect(() => {
    setSession(loadSession());
  }, []);

  const onSignOut = () => {
    signOut();
    setSession(loadSession());
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Building2 size={18} />
          </span>
          <span>
            换房 <i>Match</i>
          </span>
        </Link>
        <nav className="app-nav">
          <Link href="/dashboard">工作台</Link>
          <Link href="/matches">智能匹配</Link>
          <Link href="/messages">消息</Link>
          <Link href="/properties/new">发布</Link>
          <Link href="/profile">我的</Link>
          <Link href="/admin">审核台</Link>
        </nav>
        <div className="app-user">
          <Bell size={18} />
          <span>{session?.phone ? session.phone : "游客"}</span>
          <span className="user-avatar">房</span>
          {session?.accountState !== "guest" ? (
            <button className="button button-ghost button-small" onClick={onSignOut}>
              退出
            </button>
          ) : null}
        </div>
      </header>
      <main className="app-main">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} /> 返回首页
        </Link>
        <span className="section-kicker">{eyebrow}</span>
        <h1 className="app-title">{title}</h1>
        {session ? (
          <div className="workspace-note">
            <span>账号状态：{accountStateLabel(session.accountState)}</span>
            <span>资产认证：{verificationLabel(session.verificationStatus)}</span>
            <span>微信绑定：{session.wechatBound ? "已绑定" : "未绑定"}</span>
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
