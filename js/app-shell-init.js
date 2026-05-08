/**
 * 全站页脚与品牌区（劲酒渠道配送为主场景）
 */
(function () {
  'use strict';

  var FOOTER_ID = 'app-shell-footer';

  function buildFooter() {
    if (document.getElementById(FOOTER_ID)) return;
    var path = (location.pathname || '').replace(/\/$/, '') || '/';
    var isHome = path === '/' || /index\.html$/i.test(path);
    var tail = isHome
      ? '劲酒终端访销配送场景 · 数据请妥善保管'
      : '劲酒终端访销配送场景 · 数据请妥善保管 · <a href="/">返回首页</a>';
    var f = document.createElement('footer');
    f.id = FOOTER_ID;
    f.className = 'app-shell-footer';
    f.setAttribute('role', 'contentinfo');
    f.innerHTML =
      '<div class="app-shell-footer__inner">' +
      '<p class="app-shell-footer__brand">劲酒 · 配送管家</p>' +
      '<p class="app-shell-footer__tagline">片区管理 · 送货履约 · 收款对账 · 日结快照</p>' +
      '<p class="app-shell-footer__meta">' +
      tail +
      '</p>' +
      '</div>';
    document.body.appendChild(f);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildFooter);
  } else {
    buildFooter();
  }
})();
