"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { AppFrame } from "@/components/layout/AppFrame";
import { createIntent, getViewerBaseListing, loadListings, loadSession, reciprocalMatch, type Listing, type SessionState } from "@/lib/mvp";

export default function PropertyPage() {
  const params = useParams<{ id: string }>();
  const [id, setId] = useState<string>("");
  const [listing, setListing] = useState<Listing | null>(null);
  const [session, setSession] = useState<SessionState | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const nextId = params.id ?? "";
    setId(nextId);
    setListing(loadListings().find((item) => item.id === nextId) ?? null);
    setSession(loadSession());
  }, [params.id]);

  const score = useMemo(() => {
    if (!listing) return null;
    return reciprocalMatch(getViewerBaseListing(), listing);
  }, [listing]);

  if (!listing) {
    return (
      <AppFrame eyebrow="PROPERTY DETAIL" title="房源详情">
        <div className="empty-state">未找到房源</div>
      </AppFrame>
    );
  }

  const canSeeFull = session?.accountState !== "guest";
  const canIntent = session?.accountState === "assetVerified";

  return (
    <AppFrame eyebrow="PROPERTY DETAIL" title={`${listing.current.compound} · ${listing.current.area}㎡`}>
      <div className="detail-layout">
        <div className="detail-info">
          <span className="match-tag">{score?.total ?? 0}% 匹配</span>
          <h2>{canSeeFull ? `${listing.current.layout} · ${listing.current.orientation}` : "登录后查看完整户型和朝向"}</h2>
          <p>
            {canSeeFull
              ? `${listing.current.city}${listing.current.district} · 建成年份 ${listing.current.buildingYear}`
              : "游客状态下仅提供模糊展示"}
          </p>
          <div className="detail-stats">
            <strong>
              {canSeeFull ? `${listing.current.estimatedValueWan}万` : "***"}
              <small>参考估值</small>
            </strong>
            <strong>
              {listing.target.minArea}-{listing.target.maxArea}㎡
              <small>目标面积</small>
            </strong>
            <strong>
              {listing.target.cashGapMinWan}~{listing.target.cashGapMaxWan}万
              <small>现金差</small>
            </strong>
          </div>

          <p>对方目标区域：{listing.target.districts.join("/")}</p>
          <p>规则结果：{score?.strictReciprocal ? "满足严格双向互补" : "部分条件需协商"}</p>

          <div className="form-actions">
            <button
              className="button button-primary"
              onClick={() => {
                if (!canIntent) {
                  setNotice("资产认证通过后才能表达意向");
                  return;
                }
                createIntent(listing.id);
                setNotice("已表达意向，若双方同意可在消息页沟通。");
              }}
            >
              表达置换意向
            </button>
            <Link className="button button-ghost" href="/messages">
              去消息
            </Link>
          </div>

          {notice ? <p>{notice}</p> : null}
          <Link href="/matches" className="back-link">
            <ArrowLeft size={15} /> 返回匹配列表 · {id}
          </Link>
        </div>
      </div>
    </AppFrame>
  );
}
