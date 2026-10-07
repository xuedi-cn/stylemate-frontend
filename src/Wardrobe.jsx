import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getItems, uploadItem, deleteItem } from "./api";

// 品类顺序和显示名
const CATEGORY_ORDER = [
  { key: "上衣", label: "上装" },
  { key: "衬衫", label: "衬衫" },
  { key: "裙子", label: "裙装" },
  { key: "裤子", label: "下装" },
  { key: "连衣裙", label: "连衣裙" },
  { key: "外套", label: "外套" },
  { key: "鞋", label: "鞋" },
  { key: "包", label: "包" },
  { key: "配饰", label: "配饰" },
];

export default function Wardrobe() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const data = await getItems();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      await uploadItem(file);
      setModalOpen(false);
      await loadItems();
      alert("上传成功，AI 正在分析标签，稍后刷新可看到完整信息");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(itemId) {
    if (!confirm("确定删除这件单品吗？")) return;
    try {
      await deleteItem(itemId);
      setItems(items.filter((i) => i.id !== itemId));
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // 按品类分组
  const grouped = {};
  items.forEach((item) => {
    const cat = item.category || "未分类";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  // 按预定义顺序排列，未分类的放最后
  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => grouped[c.key]),
    ...(grouped["未分类"] ? [{ key: "未分类", label: "未分类" }] : []),
  ];

  return (
    <div className="app-layout">
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-icon">S</div>
          <span>StyleMate</span>
        </div>
        <nav className="topbar-nav">
          <a onClick={() => navigate("/")}>场景推荐</a>
          <a className="active">我的衣柜</a>
          <a onClick={() => navigate("/styles")}>我的风格</a>
          <a onClick={() => navigate("/saved")}>我的搭配</a>
        </nav>
        <div className="topbar-right">
          <button className="icon-btn" onClick={handleLogout} title="退出登录">
            ⏻
          </button>
        </div>
      </div>

      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">我的衣柜</h1>
            <p className="page-subtitle">
              共 {items.length} 件单品，按品类分组
            </p>
          </div>
          <button className="add-btn" onClick={() => setModalOpen(true)}>
            + 添加单品
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <div className="empty-state"><p>加载中...</p></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👕</div>
            <p>衣柜还是空的，点右上角添加第一件单品吧</p>
          </div>
        ) : (
          <div className="wardrobe-groups">
            {orderedCategories.map((cat) => (
              <div key={cat.key} className="wardrobe-group">
                <div className="group-header">
                  <h3 className="group-title">{cat.label}</h3>
                  <span className="group-count">{grouped[cat.key].length} 件</span>
                </div>
                <div className="group-row">
                  {grouped[cat.key].map((item) => (
                    <div key={item.id} className="mini-card">
                      <img src={item.image_url} alt={item.category || "单品"} />
                      <button
                        className="mini-delete"
                        onClick={() => handleDelete(item.id)}
                        title="删除"
                      >
                        ×
                      </button>
                      <div className="mini-card-info">
                        <span className="mini-color">{item.color || "—"}</span>
                        {item.style_tags && item.style_tags.length > 0 && (
                          <span className="mini-tag-inline">
                            {item.style_tags[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
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
            <h3>添加单品</h3>
            <p className="modal-desc">
              上传一张衣服照片，AI 会自动识别品类、颜色、风格
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