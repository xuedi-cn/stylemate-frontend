import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStyles, uploadStyle, deleteStyle } from "./api";

export default function Styles() {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadStyles();
  }, []);

  async function loadStyles() {
    setLoading(true);
    setError("");
    try {
      const data = await getStyles();
      setStyles(data.styles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      await uploadStyle(file);
      setModalOpen(false);
      await loadStyles();
      alert("上传成功，AI 正在分析风格标签，稍后刷新可看到");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(styleId) {
    if (!confirm("确定删除这张风格图吗？")) return;
    try {
      await deleteStyle(styleId);
      setStyles(styles.filter((s) => s.id !== styleId));
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
             <a className="active">我的风格</a>
             <a onClick={() => navigate("/saved")}>我的搭配</a>
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
            <h1 className="page-title">我的风格</h1>
            <p className="page-subtitle">
              上传你喜欢的穿搭风格图，AI 会参考这些图为你推荐搭配
            </p>
          </div>
          <button className="add-btn" onClick={() => setModalOpen(true)}>
            + 添加风格图
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <div className="empty-state">
            <p>加载中...</p>
          </div>
        ) : styles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✦</div>
            <p>还没有风格参考图</p>
            <p style={{ marginTop: 8, fontSize: 13 }}>
              上传你喜欢的穿搭照片，让 AI 更懂你的审美
            </p>
          </div>
        ) : (
          <div className="wardrobe-grid">
            {styles.map((style) => (
              <div key={style.id} className="wardrobe-card">
                <div className="wardrobe-img-wrapper">
                  <img src={style.image_url} alt="风格参考" />
                  <button
                    className="wardrobe-delete"
                    onClick={() => handleDelete(style.id)}
                    title="删除"
                  >
                    ×
                  </button>
                </div>
                <div className="wardrobe-info">
                  {style.style_tags && style.style_tags.length > 0 ? (
                    <div className="wardrobe-tags">
                      {style.style_tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="mini-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="wardrobe-name">分析中...</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 上传弹窗 */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>添加风格参考图</h3>
            <p className="modal-desc">
              上传一张你喜欢的穿搭照片，AI 会提取风格标签
            </p>
            <label className="upload-zone">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                style={{ display: "none" }}
              />
              <div className="upload-zone-content">
                {uploading ? "上传中..." : "点击选择图片"}
              </div>
            </label>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setModalOpen(false)}
                disabled={uploading}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}