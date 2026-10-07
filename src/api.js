const API_BASE = "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/login";
    throw new Error("登录已过期，请重新登录");
  }

  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = { detail: "请求失败" };
    }
    throw new Error(err.detail || "请求失败");
  }

  return res.json();
}

function authHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  return {
    "x-token": `Bearer ${token}`,
    ...extra,
  };
}

/* ============ 认证 ============ */

export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email, password) {
  return request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

/* ============ 单品 ============ */

export async function getItems() {
  return request("/items/", { headers: authHeaders() });
}

export async function uploadItem(file) {
  const formData = new FormData();
  formData.append("file", file);
  return request("/items/upload", {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
}

export async function deleteItem(itemId) {
  return request(`/items/${itemId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

/* ============ 风格参考图 ============ */

export async function getStyles() {
  return request("/styles/", { headers: authHeaders() });
}

export async function uploadStyle(file) {
  const formData = new FormData();
  formData.append("file", file);
  return request("/styles/upload", {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
}

export async function deleteStyle(styleId) {
  return request(`/styles/${styleId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

/* ============ 搭配推荐 ============ */

export async function recommendOutfits(scene) {
  return request(`/outfits/recommend?scene=${encodeURIComponent(scene)}`, {
    method: "POST",
    headers: authHeaders(),
  });
}

export async function saveOutfit(data) {
  return request("/outfits/save", {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });
}

export async function getSavedOutfits() {
  return request("/outfits/saved", { headers: authHeaders() });
}

export async function deleteSavedOutfit(outfitId) {
  return request(`/outfits/${outfitId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}