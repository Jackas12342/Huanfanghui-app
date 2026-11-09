"use client";

import { useMemo, useState } from "react";
import { AppFrame } from "@/components/layout/AppFrame";
import {
  approveContactShareByPeer,
  blockThread,
  loadSession,
  loadThreads,
  reportThread,
  requestContactShare,
  revokeContactShare,
  sendMessage,
  type ChatThread,
  type SessionState,
} from "@/lib/mvp";

export default function MessagesPage() {
  const [session] = useState<SessionState>(() => loadSession());
  const [threads, setThreads] = useState<ChatThread[]>(() => loadThreads());
  const [selectedId, setSelectedId] = useState<string | null>(() => loadThreads()[0]?.id ?? null);
  const [draft, setDraft] = useState("");
  const [wechatDraft, setWechatDraft] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = () => {
    const next = loadThreads();
    setThreads(next);
    setSelectedId(next[0]?.id ?? null);
  };

  const selected = useMemo(() => threads.find((item) => item.id === selectedId) ?? null, [threads, selectedId]);

  const canUseDM = session?.accountState === "assetVerified";

  const onSend = () => {
    if (!selected || !draft.trim()) return;
    if (!canUseDM || !selected.bothInterested || selected.blockedBy) {
      setNotice("当前线程不可发送消息（需资产认证 + 双方互相意向 + 未屏蔽）");
      return;
    }
    sendMessage(selected.id, draft.trim());
    setDraft("");
    refresh();
  };

  if (!canUseDM) {
    return (
      <AppFrame eyebrow="SECURE CHAT" title="沟通置换机会">
        <div className="empty-state">
          <h2>私信已锁定</h2>
          <p>仅资产认证用户可发送消息，且需双方先表达置换意向。</p>
        </div>
      </AppFrame>
    );
  }

  return (
    <AppFrame eyebrow="SECURE CHAT" title="沟通置换机会">
      <div className="dashboard-grid">
        <section className="dashboard-card">
          <h2>会话列表</h2>
          {threads.map((thread) => (
            <button key={thread.id} className="button button-ghost" onClick={() => setSelectedId(thread.id)}>
              {thread.peerName} · {thread.bothInterested ? "已互相意向" : "等待互相意向"}
            </button>
          ))}
        </section>

        <section className="dashboard-card">
          {selected ? (
            <>
              <h2>与 {selected.peerName} 的安全对话</h2>
              <p>
                状态：{selected.bothInterested ? "可沟通" : "未互相意向"} / {selected.blockedBy ? "已屏蔽" : "正常"}
              </p>
              <div className="workspace-list">
                {selected.messages.map((message) => (
                  <article className="workspace-card" key={message.id}>
                    <p>
                      <strong>{message.from === "me" ? "我" : message.from === "peer" ? "对方" : "系统"}：</strong>
                      {message.body}
                    </p>
                  </article>
                ))}
              </div>

              <label>
                输入消息
                <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="仅在双方互相意向后可发送" />
              </label>
              <div className="form-actions">
                <button className="button button-primary" onClick={onSend}>
                  发送
                </button>
                <button
                  className="button button-ghost"
                  onClick={() => {
                    blockThread(selected.id);
                    refresh();
                  }}
                >
                  屏蔽用户
                </button>
                <button
                  className="button button-ghost"
                  onClick={() => {
                    reportThread(selected.id, "疑似引流/不当言论");
                    refresh();
                    setNotice("已提交举报，管理员会处理。");
                  }}
                >
                  举报
                </button>
              </div>

              <hr />
              <h3>微信联系方式交换（默认遮罩）</h3>
              <label>
                我的微信号
                <input value={wechatDraft} onChange={(e) => setWechatDraft(e.target.value)} placeholder="例如 house_trade_88" />
              </label>
              <div className="form-actions">
                <button
                  className="button button-primary"
                  onClick={() => {
                    if (!wechatDraft.trim()) {
                      setNotice("请先输入微信号");
                      return;
                    }
                    requestContactShare(selected.id, wechatDraft.trim());
                    refresh();
                    setNotice("你已发起联系方式分享申请，待对方确认。默认仍为遮罩显示。");
                  }}
                >
                  发起分享申请
                </button>
                <button
                  className="button button-ghost"
                  onClick={() => {
                    approveContactShareByPeer(selected.id);
                    refresh();
                    setNotice("（演示）对方已确认，联系方式已解锁。 ");
                  }}
                >
                  模拟对方确认
                </button>
                <button
                  className="button button-ghost"
                  onClick={() => {
                    revokeContactShare(selected.id);
                    refresh();
                    setNotice("已撤回联系方式分享。 ");
                  }}
                >
                  撤回分享
                </button>
              </div>
              {selected.contactShare ? (
                <p>
                  联系方式：
                  {selected.contactShare.acceptedByPeer
                    ? selected.contactShare.requesterWechatRaw
                    : selected.contactShare.requesterWechatMasked}
                </p>
              ) : (
                <p>尚未分享联系方式</p>
              )}
            </>
          ) : (
            <p>暂无会话</p>
          )}
        </section>
      </div>

      {notice ? <div className="workspace-note">{notice}</div> : null}
    </AppFrame>
  );
}
