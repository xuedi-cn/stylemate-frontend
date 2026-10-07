import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedOutfits, deleteSavedOutfit } from "./api";

export default function Saved() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadOutfits();
  }, []);

  async function loadOutfits() {
    setLoading(true);
    setError("");
    try {
      const data = await getSavedOutfits();
      setOutfits(data.outfits || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("确定删除这套搭配吗？")) return;
    try {
      await deleteSavedOutfit(id);
      setOutfits(outfits.filter((o) => o.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="app-layout">
      {/* 顶部导航 */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-icon">S</div>
          <span>StyleMate</span>
        </div>
        <nav className="topbar-nav">
         <a onClick={() => navigate("/")}>场景推荐</a>
         <a onClick={() => navigate("/wardrobe")}>我的衣柜</a>
         <a onClick={() => navigate("/styles")}>我的风格</a>
         <a className="active">我的搭配</a>
        </nav>
        <div className="topbar-right">
          <button className="icon-btn" onClick={handleLogout} title="退出登录">
            ⏻
          </button>
        </div>
      </div>

      {/* 页面内容 */}
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">我的搭配</h1>
            <p className="page-subtitle">共 {outfits.length} 套收藏</p>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <div className="empty-state">
            <p>加载中...</p>
          </div>
        ) : outfits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✦</div>
            <p>还没有保存的搭配</p>
            <p style={{ marginTop: 8, fontSize: 13 }}>
              去「场景推荐」里看看喜欢的搭配，点「保存搭配」
            </p>
          </div>
        ) : (
          <div className="saved-grid">
            {outfits.map((outfit) => (
              <div key={outfit.id} className="saved-card">
                <div className="saved-header">
                  <div>
                    <div className="saved-name">{outfit.name || "未命名搭配"}</div>
                    {outfit.scene && (
                      <span className="saved-scene">{outfit.scene}</span>
                    )}
                  </div>
                  <button
                    className="saved-delete"
                    onClick={() => handleDelete(outfit.id)}
                    title="删除"
                  >
                    ×
                  </button>
                </div>

                <div className="saved-items">
                  {outfit.items?.slice(0, 4).map((item) => (
                    <div key={item.id} className="saved-item">
                      <img src={item.image_url} alt={item.category} />
                    </div>
                  ))}
                </div>

                {outfit.reason && (
                  <p className="saved-reason">{outfit.reason}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}