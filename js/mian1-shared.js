/**
 * 配送管家系统 - 全站共享逻辑（快照、搜索、API 根路径）
 * 部署到子路径或更换端口时，可在任意页面于本脚本之前设置：
 *   window.MIAN1_API_BASE = 'https://你的域名/api';
 * file:// 打开页面时回退到 localhost:3000/api。
 */
(function (global) {
  'use strict';

  function getApiBase() {
    if (typeof global.MIAN1_API_BASE === 'string' && global.MIAN1_API_BASE.trim()) {
      return global.MIAN1_API_BASE.replace(/\/$/, '');
    }
    try {
      var u = new URL(global.location.href);
      if (u.protocol === 'file:') {
        return 'http://localhost:3000/api';
      }
      return u.origin + '/api';
    } catch (e) {
      return 'http://localhost:3000/api';
    }
  }

  function getDailySnapshot(date) {
    try {
      if (!date) return [];
      return JSON.parse(global.localStorage.getItem('daily_snapshot_' + date) || '[]');
    } catch (e) {
      console.error('读取本地全量快照失败:', e);
      return [];
    }
  }

  function getDeliverySnapshot(date) {
    try {
      if (!date) return [];
      return JSON.parse(global.localStorage.getItem('delivery_data_' + date) || '[]');
    } catch (e) {
      console.error('读取本地送货存档失败:', e);
      return [];
    }
  }

  async function getServerSnapshotAsync(date) {
    try {
      if (!date) return [];
      var response = await global.fetch(
        getApiBase() + '/snapshots/' + encodeURIComponent(date)
      );
      if (!response.ok) return [];
      var payload = await response.json();
      return Array.isArray(payload.data) ? payload.data : [];
    } catch (error) {
      console.error('读取服务端快照失败:', error);
      return [];
    }
  }

  async function putServerSnapshot(date, stores) {
    try {
      if (!date || !Array.isArray(stores)) return;
      await global.fetch(getApiBase() + '/snapshots/' + encodeURIComponent(date), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: stores }),
      });
    } catch (error) {
      console.error('保存服务端快照失败:', error);
    }
  }

  /**
   * 历史日数据：服务端快照 > 本地 daily_snapshot > 本地 delivery_data
   */
  async function getBestSnapshot(date) {
    var serverSnapshot = await getServerSnapshotAsync(date);
    if (serverSnapshot.length > 0) return serverSnapshot;
    var localSnapshot = getDailySnapshot(date);
    if (localSnapshot.length > 0) return localSnapshot;
    var deliverySnapshot = getDeliverySnapshot(date);
    if (deliverySnapshot.length > 0) return deliverySnapshot;
    return [];
  }

  /**
   * 子页返回配送页：带上片区与日期。优先用当前页 URL 的 date，否则用配送页写入的 sessionStorage。
   */
  function navigateBackToPeisong() {
    var u;
    try {
      u = new URLSearchParams(global.location.search);
    } catch (e) {
      u = new URLSearchParams();
    }
    var a = u.get('area') || 'all';
    var d = u.get('date');
    if (!d) {
      try {
        d = global.sessionStorage.getItem('peisong_stats_date');
      } catch (err) {}
    }
    var href = 'peisong.html?area=' + encodeURIComponent(a) + '&showContent=true';
    if (d && /^\d{4}-\d{2}-\d{2}$/.test(String(d))) {
      href += '&date=' + encodeURIComponent(d);
    }
    global.location.href = href;
  }

  function filterStoresBySearch(stores, q) {
    var t = (q || '').trim().toLowerCase();
    if (!t) return stores;
    return stores.filter(function (s) {
      var n = (s.name || '').toLowerCase();
      var c = (s.contact || '').toLowerCase();
      var p = (s.phone || '').toLowerCase();
      return n.indexOf(t) !== -1 || c.indexOf(t) !== -1 || p.indexOf(t) !== -1;
    });
  }

  var toastStyleInjected = false;
  /**
   * 底部轻提示（约 3 秒消失）。type: success | error | info
   */
  function showToast(message, type) {
    if (!message || !global.document || !global.document.body) return;
    type = type || 'info';
    if (!toastStyleInjected && global.document) {
      toastStyleInjected = true;
      var st = global.document.createElement('style');
      st.textContent =
        '@keyframes mian1ToastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';
      global.document.head.appendChild(st);
    }
    var rootId = 'mian1-toast-root';
    var root = global.document && global.document.getElementById(rootId);
    if (!root) {
      root = global.document.createElement('div');
      root.id = rootId;
      root.setAttribute(
        'style',
        'position:fixed;left:50%;bottom:max(1.25rem,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:99999;pointer-events:none;max-width:min(92vw,24rem);display:flex;flex-direction:column;align-items:center;gap:0.5rem;'
      );
      global.document.body.appendChild(root);
    }
    var bg =
      type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#0369a1';
    var el = global.document.createElement('div');
    el.setAttribute(
      'style',
      'background:' +
        bg +
        ';color:#fff;padding:0.65rem 1rem;border-radius:0.5rem;box-shadow:0 10px 40px rgba(0,0,0,.18);font-size:0.875rem;line-height:1.4;pointer-events:auto;animation:mian1ToastIn .28s ease;text-align:center;'
    );
    el.textContent = message;
    root.appendChild(el);
    global.setTimeout(function () {
      el.style.opacity = '0';
      el.style.transition = 'opacity .28s ease';
      global.setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 300);
    }, 3200);
  }

  global.Mian1 = {
    getApiBase: getApiBase,
    getDailySnapshot: getDailySnapshot,
    getDeliverySnapshot: getDeliverySnapshot,
    getServerSnapshot: getServerSnapshotAsync,
    putServerSnapshot: putServerSnapshot,
    getBestSnapshot: getBestSnapshot,
    navigateBackToPeisong: navigateBackToPeisong,
    filterStoresBySearch: filterStoresBySearch,
    showToast: showToast,
  };
})(typeof window !== 'undefined' ? window : this);
