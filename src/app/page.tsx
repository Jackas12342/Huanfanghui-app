"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Building2 } from "lucide-react";
import { loadListings, loadSession, type Listing } from "@/lib/mvp";

export default function Home() {
  const [isGuest, setIsGuest] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const session = loadSession();
    setIsGuest(session.accountState === "guest");
    setListings(loadListings().slice(0, 3));
  }, []);

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Building2 size={18} />
          </span>
          <span>
            换房 <i>Match</i>
          </span>
        </Link>
        <div className="form-actions">
          <Link href="/login" className="button button-ghost button-small">
            登录
          </Link>
          <Link href="/dashboard" className="button button-primary button-small">
            进入工作台 <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      <main className="content-section" style={{ paddingTop: 40 }}>
        <div className="section-heading">
          <div>
            <span className="section-kicker">TRUST-BASED EXCHANGE</span>
            <h2>先验证身份，再做双向匹配</h2>
          </div>
          <p>
            游客仅可看模糊房源；手机号认证后可看全量；
            <br />
            资产认证通过后可发布与私信。
          </p>
        </div>

        <div className="workspace-list">
          {listings.map((item) => (
            <article className={`workspace-card ${isGuest ? "blurred-card" : ""}`} key={item.id}>
              <div>
                <span className="match-tag">{item.ownerIntent === "downsize" ? "想换小" : "想换大"}</span>
                <h2>
                  {item.current.district} · {isGuest ? "***㎡" : `${item.current.area}㎡`} · {item.current.layout}
                </h2>
                <p>
                  {isGuest
                    ? "登录后可查看完整估值、目标区域、现金差与匹配逻辑。"
                    : `估值 ${item.current.estimatedValueWan} 万；目标 ${item.target.minArea}-${item.target.maxArea}㎡ ${item.target.districts.join("/")}`}
                </p>
              </div>
            </article>
          ))}
        </div>

        {isGuest ? (
          <div className="empty-state compact" style={{ marginTop: 24 }}>
            <h2>当前为游客模式</h2>
            <p>请先手机号登录，后续在个人中心完成资产认证解锁完整功能。</p>
            <Link href="/login" className="button button-primary">
              立即登录
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
}
