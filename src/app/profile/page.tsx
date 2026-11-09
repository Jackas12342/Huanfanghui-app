"use client";

import { useEffect, useState } from "react";
import { AppFrame } from "@/components/layout/AppFrame";
import { loadSession, loadVerificationSubmissions, submitVerification, verificationLabel, type SessionState, type VerificationSubmission } from "@/lib/mvp";

export default function ProfilePage() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [submissions, setSubmissions] = useState<VerificationSubmission[]>([]);
  const [docType, setDocType] = useState<"房产证" | "身份证">("房产证");
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setSession(loadSession());
    setSubmissions(loadVerificationSubmissions());
  }, []);

  const onSubmit = () => {
    if (!fileName.trim()) {
      setMessage("请填写打码文件名或上传说明");
      return;
    }
    submitVerification(docType, fileName.trim());
    setSession(loadSession());
    setSubmissions(loadVerificationSubmissions());
    setMessage("资料已提交，状态为审核中。审核通过后可发布房源和私信。 ");
  };

  return (
    <AppFrame eyebrow="VERIFICATION CENTER" title="我的资料与认证状态">
      <div className="profile-panel">
        <div className="profile-avatar">房</div>
        <div>
          <h2>{session?.phone ?? "游客"}</h2>
          <p>账号等级：{session?.accountState ?? "guest"}</p>
        </div>
        <span className="verified">资产认证：{session ? verificationLabel(session.verificationStatus) : "未提交"}</span>
      </div>

      <div className="form-panel">
        <h2>提交资产认证（房产证/身份证打码件）</h2>
        <div className="form-grid">
          <label>
            证件类型
            <select value={docType} onChange={(e) => setDocType(e.target.value as "房产证" | "身份证")}>
              <option value="房产证">房产证</option>
              <option value="身份证">身份证</option>
            </select>
          </label>
          <label>
            文件名（演示）
            <input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="例如 property-redacted.jpg" />
          </label>
        </div>
        <div className="form-actions">
          <button className="button button-primary" onClick={onSubmit}>
            提交审核
          </button>
        </div>
        {message ? <p>{message}</p> : null}
      </div>

      <div className="workspace-list">
        {submissions.length === 0 ? (
          <div className="empty-state compact">
            <p>暂无认证记录</p>
          </div>
        ) : (
          submissions.map((submission) => (
            <article className="workspace-card" key={submission.id}>
              <div>
                <h2>{submission.docType}</h2>
                <p>文件：{submission.fileName}</p>
                <p>状态：{verificationLabel(submission.status)}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </AppFrame>
  );
}
