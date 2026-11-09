import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="auth-shell">
      <Link href="/" className="brand">
        换房 <i>Match</i>
      </Link>
      <div className="auth-panel">
        <span className="section-kicker">TRUST FIRST</span>
        <h1>注册流程（MVP）</h1>
        <p>本平台使用手机号验证码直接创建账号，避免匿名与机器人刷号。</p>
        <ol>
          <li>手机号 + 验证码完成账号创建（Phone Verified）。</li>
          <li>在个人中心提交房产证/身份证打码件进入资产审核。</li>
          <li>审核通过后升级为 Asset Verified，可发布房源和发起私信。</li>
        </ol>
        <Link className="button button-primary" href="/login">
          去登录 / 注册
        </Link>
      </div>
    </div>
  );
}
