"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppFrame } from "@/components/layout/AppFrame";
import { createIntent, getViewerBaseListing, loadListings, loadSession, reciprocalMatch, type Listing, type SessionState } from "@/lib/mvp";

export default function MatchesPage() {
  const [session] = useState<SessionState>(() => loadSession());
  const [listings] = useState<Listing[]>(() => loadListings().filter((item) => item.status === "live"));
  const [intentOnly, setIntentOnly] = useState(true);

  const canSeeFull = session?.accountState !== "guest";
  const canExpressIntent = session?.accountState === "assetVerified";

  const results = useMemo(() => {
    const me = getViewerBaseListing();
    return listings
      .map((listing) => ({ listing, score: reciprocalMatch(me, listing) }))
      .filter((item) => (intentOnly ? item.score.total >= 60 : true))
      .sort((a, b) => b.score.total - a.score.total);
  }, [listings, intentOnly]);

  return (
    <AppFrame eyebrow="RECIPROCAL MATCHING" title="严格互补 + 评分匹配">
      <div className="form-actions">
        <button className={`button ${intentOnly ? "button-primary" : "button-ghost"}`} onClick={() => setIntentOnly((v) => !v)}>
          {intentOnly ? "仅看意向高匹配" : "展示全部匹配"}
        </button>
        <small>评分规则：区域40 + 面积30 + 预算30</small>
      </div>

      <div className="workspace-list">
        {results.map(({ listing, score }) => (
          <article className="workspace-card" key={listing.id}>
            <div>
              <span className="match-tag">{score.total}%</span>
              <h2>
                {canSeeFull ? `${listing.current.compound} · ${listing.current.area}㎡` : "深圳 · 区域信息已模糊"}
              </h2>
              <p>
                {canSeeFull
                  ? `估值 ${listing.current.estimatedValueWan} 万；对方目标：${listing.target.districts.join("/")}，${listing.target.minArea}-${listing.target.maxArea}㎡`
                  : "请先完成手机认证后查看完整挂牌信息"}
              </p>
              <p>
                分项：位置 {score.location}/40，面积 {score.size}/30，预算 {score.budget}/30
                {score.strictReciprocal ? "（满足100%互补规则）" : "（部分条件需协商）"}
              </p>
              <ul>
                {score.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
              <div className="form-actions">
                <Link className="button button-ghost" href={`/properties/${listing.id}`}>
                  详情
                </Link>
                <button
                  className="button button-primary"
                  onClick={() => {
                    createIntent(listing.id);
                    alert("已表达置换意向，若双方同意可进入私信");
                  }}
                  disabled={!canExpressIntent}
                >
                  表达置换意向
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!canExpressIntent ? (
        <div className="empty-state compact">
          <h2>资产认证后才能表达意向和私信</h2>
          <p>请前往个人中心上传打码后的房产证或身份证。</p>
          <Link href="/profile" className="button button-primary">
            去提交认证
          </Link>
        </div>
      ) : null}
    </AppFrame>
  );
}
