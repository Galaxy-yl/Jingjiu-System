// 可选：在支持 ES module 的环境中封装 API（与 backend/server.js 默认端口一致）
const API_BASE_URL = 'http://localhost:3000/api';

// 商家相关API
export async function getMerchants(area = null, search = null) {
  let url = `${API_BASE_URL}/merchants`;
  const params = new URLSearchParams();
  if (area) params.append('area', area);
  if (search) params.append('search', search);
  if (params.toString()) url += `?${params.toString()}`;
  
  const response = await fetch(url);
  return response.json();
}

export async function getMerchant(id) {
  const response = await fetch(`${API_BASE_URL}/merchants/${id}`);
  return response.json();
}

export async function createMerchant(data) {
  const response = await fetch(`${API_BASE_URL}/merchants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function updateMerchant(id, data) {
  const response = await fetch(`${API_BASE_URL}/merchants/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function deleteMerchant(id) {
  const response = await fetch(`${API_BASE_URL}/merchants/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

// 送货记录API
export async function getDeliveries(merchantId = null, date = null) {
  let url = `${API_BASE_URL}/deliveries`;
  const params = new URLSearchParams();
  if (merchantId) params.append('merchantId', merchantId);
  if (date) params.append('date', date);
  if (params.toString()) url += `?${params.toString()}`;
  
  const response = await fetch(url);
  return response.json();
}

export async function createDelivery(data) {
  const response = await fetch(`${API_BASE_URL}/deliveries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function deleteDelivery(id) {
  const response = await fetch(`${API_BASE_URL}/deliveries/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

// 片区API
export async function getAreas() {
  const response = await fetch(`${API_BASE_URL}/areas`);
  return response.json();
}

export async function createArea(name) {
  const response = await fetch(`${API_BASE_URL}/areas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  return response.json();
}

/** 某日历史快照（与前端列表页 getBestSnapshot 数据源一致） */
export async function getSnapshot(date) {
  if (!date) return [];
  const response = await fetch(`${API_BASE_URL}/snapshots/${encodeURIComponent(date)}`);
  if (!response.ok) return [];
  const payload = await response.json();
  return Array.isArray(payload.data) ? payload.data : [];
}
