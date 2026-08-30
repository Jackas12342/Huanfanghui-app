import { UserRound } from "lucide-react";
import { AppFrame } from "@/components/layout/AppFrame";
export default function ProfilePage() { return <AppFrame eyebrow="MY PROFILE" title="我的资料"><div className="profile-panel"><div className="profile-avatar">林</div><div><h2>林先生</h2><p>上海 · 置换改善型住房</p></div><span className="verified"><UserRound size={14} /> 实名信息待完善</span></div><div className="empty-state compact"><h2>你的置换偏好</h2><p>完成资料后，匹配会更准确。资料编辑功能将在接入账号服务后开放。</p></div></AppFrame>; }
