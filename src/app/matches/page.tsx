import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { AppFrame } from "@/components/layout/AppFrame";

export default function MatchesPage() { return <AppFrame eyebrow="RECIPROCAL MATCHING" title="与你的需求，刚好互补"><div className="workspace-note"><Sparkles size={17} /><span>以下匹配基于演示数据。接入后端后，这里将由真实房产和置换需求实时计算。</span></div><div className="workspace-list"><article className="workspace-card"><div className="demo-image" /><div><span className="match-tag">95% 高匹配</span><h2>仁恒滨江园 · 145㎡四居</h2><p>对方想换一套 60–80㎡ 的两居，与你的房产和需求形成互补。</p><Link className="button button-primary" href="/properties/prop-2">查看匹配详情 <ArrowRight size={16} /></Link></div></article><article className="workspace-card"><div className="demo-image second" /><div><span className="match-tag">88% 高匹配</span><h2>万科城市花园 · 118㎡三居</h2><p>面积、户型与预算均在你的置换范围内，等待进一步确认。</p><Link className="button button-ghost" href="/properties/prop-3">查看房产详情 <ArrowRight size={16} /></Link></div></article></div></AppFrame>; }
