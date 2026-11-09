"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppFrame } from "@/components/layout/AppFrame";
import { getViewerBaseListing, loadListings, loadNotifications, loadSession, reciprocalMatch, type Listing, type Notification, type SessionState } from "@/lib/mvp";

type FeedTab = "downsize" | "upsize";

export default function DashboardPage() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tab, setTab] = useState<FeedTab>("downsize");

  useEffect(() => {
    setSession(loadSession());
    setListings(loadListings().filter((item) => item.status === "live"));
    setNotifications(loadNotifications());
  }, []);

  const matched = useMemo(() => {
    const base = getViewerBaseListing();
    return listings
      .filter((item) => item.ownerIntent === tab)
      .map((item) => ({ item, score: reciprocalMatch(base, item) }))
      .filter((entry) => entry.score.total >= 40)
      .sort((a, b) => b.score.total - a.score.total);
  }, [listings, tab]);

  const canViewFull = session?.accountState !== "guest";
  const canDM = session?.accountState === "assetVerified";

  return (
    <AppFrame eyebrow="MVP DASHBOARD" title="双向置换工作台">
      <div className="form-actions">
        <button className={`button ${tab === "downsize" ? "button-primary" : "button-ghost"}`} onClick={() => setTab("downsize")}>
          想换小（Downsize）
        </button>
        <button className={`button ${tab === "upsize" ? "button-primary" : "button-ghost"}`} onClick={() => setTab("upsize")}>
          想换大（Upsize）
        </button>
        <Link className="button button-ghost" href="/matches">
          查看完整匹配
        </Link>
      </div>

      {notifications.length > 0 ? (
        <div className="workspace-list">
          {notifications.slice(0, 2).map((note) => (
            <article className="workspace-card" key={note.id}>
              <div>
                <span className="match-tag">{note.score}% 触发通知</span>
                <h2>新匹配提醒</h2>
                <p>{note.message}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <div className="workspace-list">
        {matched.map(({ item, score }) => (
          <article className="workspace-card" key={item.id}>
            <div>
              <span className="match-tag">{score.total}%</span>
              <h2>
                {item.current.compound} · {item.current.area}㎡ · {item.current.layout}
              </h2>
              {canViewFull ? (
                <p>
                  估值约 {item.current.estimatedValueWan} 万；对方目标：{item.target.minArea}-{item.target.maxArea}㎡ {item.target.districts.join("/")}
                </p>
              ) : (
                <p>登录后查看完整资料（当前仅展示模糊信息）。</p>
              )}
              <p>
                需求标签：Looking to swap for {item.target.maxArea}㎡内，现金区间 {item.target.cashGapMinWan} ~ {item.target.cashGapMaxWan} 万
              </p>
              <div className="form-actions">
                <Link className="button button-primary" href={`/properties/${item.id}`}>
                  查看详情
                </Link>
                {canDM ? <Link className="button button-ghost" href="/messages">进入私信</Link> : <small>资产认证后才可发起私信</small>}
              </div>
            </div>
          </article>
        ))}
      </div>

      {!canViewFull ? (
        <div className="empty-state compact">
          <h2>游客只能浏览模糊列表</h2>
          <p>请先手机号登录，再提交资产认证以解锁发布与私信功能。</p>
          <Link href="/login" className="button button-primary">
            去登录
          </Link>
        </div>
      ) : null}
    </AppFrame>
  );
}
