/**
 * PWA：注册 Service Worker（全站页面可共用）
 */
(function () {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(function (reg) {
        console.log('[PWA] Service Worker 已注册:', reg.scope);
      })
      .catch(function (err) {
        console.warn('[PWA] Service Worker 注册失败:', err);
      });
  });
})();
