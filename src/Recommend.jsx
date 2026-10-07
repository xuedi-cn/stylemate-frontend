import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recommendOutfits, saveOutfit } from "./api";

export default function Recommend() {
  const [scene, setScene] = useState("");
  const [outfits, setOutfits] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedIds, setSavedIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const quickTags = ["面试", "约会", "通勤", "周末出游", "法式简约", "降温"];

  async function handleRecommend() {
    if (!scene.trim()) return;
    setLoading(true);
    setError("");
    setCurrentIndex(0);
    try {
      const data = await recommendOutfits(scene);
      setOutfits(data.outfits || []);
      setSavedIds([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const current = outfits[currentIndex];
    if (!current || saving) return;
    setSaving(true);
    try {
      await saveOutfit({
        name: current.name,
        item_ids: current.items.map((i) => i.id),
        reason: current.reason,
        scene: scene,
      });
      setSavedIds([...savedIds, currentIndex]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const current = outfits[currentIndex];

  return (
    <div className="app-layout">
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-icon">S</div>
          <span>StyleMate</span>
        </div>
        <nav className="topbar-nav">
          <a className="active">场景推荐</a>
          <a onClick={() => navigate("/wardrobe")}>我的衣柜</a>
          <a onClick={() => navigate("/styles")}>我的风格</a>
          <a onClick={() => navigate("/saved")}>我的搭配</a>
        </nav>
        <div className="topbar-right">
          <button className="icon-btn" onClick={handleLogout} title="退出登录">
            ⏻
          </button>
        </div>
      </div>

      <div className="main-grid">
        {/* 左栏 */}
        <div className="left-panel">
          <div className="scene-card">
            <h3>今天想穿什么？</h3>
            <textarea
              className="scene-input"
              placeholder="输入场合、心情或风格关键词"
              value={scene}
              onChange={(e) => setScene(e.target.value)}
              rows={3}
            />
            <button
              className="main-btn"
              onClick={handleRecommend}
              disabled={loading || !scene.trim()}
            >
              {loading ? "AI 正在搭配..." : "开始推荐"}
            </button>
          </div>

          <div className="tags">
            {quickTags.map((tag) => (
              <button
                key={tag}
                className={`tag ${scene === tag ? "active" : ""}`}
                onClick={() => setScene(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {error && <p className="form-error">{error}</p>}
        </div>

        {/* 中栏 */}
        <div className="center-panel">
          {outfits.length === 0 ? (
            <div className="carousel">
              <div className="carousel-placeholder">
                输入一个场景，
                <br />
                让我帮你搭配今天的穿搭。
              </div>
            </div>
          ) : (
            <>
              <div className="carousel">
                <OutfitCollage key={currentIndex} outfit={current} />
              </div>
              <div className="carousel-dots">
                {outfits.map((_, idx) => (
                  <button
                    key={idx}
                    className={`dot ${idx === currentIndex ? "active" : ""}`}
                    onClick={() => setCurrentIndex(idx)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* 右栏 */}
        <div className="right-panel">
          <h3>AI 推荐搭配</h3>
          {current ? (
            <>
              <div className="info-row">
                <span className="label">主题</span>
                <span className="value">{current.name}</span>
              </div>
              <div className="info-row">
                <span className="label">场景</span>
                <span className="value">{scene}</span>
              </div>
              <div className="info-row">
                <span className="label">单品</span>
                <span className="value">{current.items.length} 件</span>
              </div>

              <div className="reason-box">{current.reason}</div>

              <div className="action-row">
                <button
                  className="btn-secondary"
                  onClick={handleSave}
                  disabled={saving || savedIds.includes(currentIndex)}
                >
                  {savedIds.includes(currentIndex)
                    ? "已保存"
                    : saving
                    ? "保存中"
                    : "保存搭配"}
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    if (currentIndex < outfits.length - 1) {
                      setCurrentIndex(currentIndex + 1);
                    } else {
                      handleRecommend();
                    }
                  }}
                  disabled={loading}
                >
                  {currentIndex < outfits.length - 1 ? "下一套" : "换一套"}
                </button>
              </div>
            </>
          ) : (
            <div className="empty-hint">
              生成搭配后，
              <br />
              这里会显示详细信息。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============ 单品拼贴组件 ============ */
function OutfitCollage({ outfit }) {
  const items = outfit.items || [];
  if (items.length === 0) return null;

  const display = items.slice(0, 3);
  const n = display.length;

  return (
    <div className={`collage-stack collage-stack-${n}`}>
      {display.map((item, idx) => (
        <div key={item.id} className={`stack-card stack-card-${idx + 1}`}>
          <img src={item.image_url} alt={item.category} />
          <div className="stack-tag">
            {item.category} · {item.color}
          </div>
        </div>
      ))}
    </div>
  );
}