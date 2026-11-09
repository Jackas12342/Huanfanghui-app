"use client";

import Link from "next/link";
import { useState } from "react";
import { bindWechat, loadSession, requestOtp, verifyOtp, type SessionState } from "@/lib/mvp";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [wechatId, setWechatId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [session, setSession] = useState<SessionState>(() => loadSession());

  const onSendOtp = () => {
    const result = requestOtp(phone.trim());
    setMessage(result.message);
    setSession(loadSession());
  };

  const onVerifyOtp = () => {
    const result = verifyOtp(phone.trim(), otp.trim());
    setMessage(result.message);
    setSession(loadSession());
  };

  const onBindWechat = () => {
    if (!wechatId.trim()) {
      setMessage("请输入微信号再绑定");
      return;
    }
    bindWechat(wechatId.trim());
    setMessage("微信已绑定（演示）");
    setSession(loadSession());
  };

  return (
    <div className="auth-shell">
      <Link href="/" className="brand">
        换房 <i>Match</i>
      </Link>
      <div className="auth-panel">
        <span className="section-kicker">MOBILE OTP LOGIN</span>
        <h1>手机号 + 短信验证码登录</h1>
        <p>优先真实用户：验证码 60 秒冷却，输错 5 次锁定 10 分钟。</p>

        <label>
          手机号
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="例如 13800000000" />
        </label>

        <div className="form-actions">
          <button className="button button-ghost" type="button" onClick={onSendOtp} disabled={!phone.trim()}>
            发送验证码
          </button>
          <small>演示验证码：123456</small>
        </div>

        <label>
          验证码
          <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6位验证码" />
        </label>

        <button className="button button-primary" type="button" onClick={onVerifyOtp} disabled={!phone.trim() || !otp.trim()}>
          登录 / 注册
        </button>

        <hr />

        <label>
          微信号（用于后续交易联络）
          <input value={wechatId} onChange={(e) => setWechatId(e.target.value)} placeholder="可选，后续可在个人中心绑定" />
        </label>
        <button className="button button-ghost" type="button" onClick={onBindWechat}>
          绑定微信（模拟 OAuth）
        </button>

        {message ? <p className="auth-foot">{message}</p> : null}
        <p className="auth-foot">当前状态：{session.accountState}</p>
        <span className="auth-foot">
          还没有账号？ <Link href="/register">查看注册说明</Link>
        </span>
      </div>
    </div>
  );
}
