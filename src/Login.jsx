import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "./api";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const data = await login(email, password);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("email", email);
        navigate("/");
      } else {
        await register(email, password);
        const data = await login(email, password);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("email", email);
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="login-layout">
      {/* 左侧品牌展示 */}
      <div className="brand-panel">
        <div className="brand-decor circle-lg" />
        <div className="brand-decor circle-sm" />
        <div className="brand-decor arc" />

        <div className="brand-content">
          <h1 className="brand-title">
            StyleMate
            <br />
            <span className="brand-title-sub">你的 AI 穿搭助手</span>
          </h1>
          <p className="brand-subtitle">
            输入风格、场合与心情，
            <br />
            获取你的专属搭配方案。
          </p>

          <div className="brand-features">
            <div className="feature">✦ 智能识别衣柜单品</div>
            <div className="feature">✦ 个性化风格推荐</div>
            <div className="feature">✦ 越用越懂你</div>
          </div>
        </div>
      </div>

      {/* 右侧表单 */}
      <div className="form-panel">
        <div className="form-card">
          <div className="mode-tabs">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              登录
            </button>
            <button
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <label>邮箱</label>
            <input
              type="email"
              placeholder="请输入邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>密码</label>
            <input
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "处理中..." : mode === "login" ? "登 录" : "注 册"}
            </button>
          </form>

          <p className="form-switch">
            {mode === "login" ? "还没有账号？" : "已有账号？"}
            <span
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "立即注册" : "去登录"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}