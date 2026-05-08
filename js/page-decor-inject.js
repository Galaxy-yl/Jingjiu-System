/**
 * 构图版装饰：
 * - 底部：其它插图横向铺陈
 * - 上层：一张大劲酒主视觉（抠图）
 */
(function () {
  'use strict';
  if (document.getElementById('page-decor-layer')) return;

  var script = document.currentScript;
  var base = 'images/decor/';
  try {
    if (script && script.src) {
      base = new URL('../images/decor/', script.src).href;
    }
  } catch (e) {}

  var fileSoft = ['decor-mushroom.png', 'decor-village.png', 'decor-house.png'];
  var fileBottle = 'decor-bottle-cutout.png';

  /* 其它插图：底部融合带（重叠拼接） */
  var soft = [
    { b: -2, l: -3, w: 330, op: 0.2, rot: -2, f: 2, delay: -0.8 },
    { b: -1, l: 24, w: 360, op: 0.2, rot: 2, f: 1, delay: 0.4 },
    { b: -3, l: 56, w: 340, op: 0.2, rot: -1, f: 0, delay: -1.2 },
  ];

  /* 劲酒图：少量、分散，来回飘动 */
  var jingjiu = [
    { t: 8, l: 6, w: 102, op: 0.74, rot: -10, delay: -0.4 },
    { t: 15, ri: 8, w: 96, op: 0.72, rot: 9, delay: -2.1 },
    { t: 32, l: 24, w: 92, op: 0.7, rot: -7, delay: -1.3 },
    { t: 40, ri: 26, w: 98, op: 0.73, rot: 8, delay: -3.0 },
    { t: 58, l: 10, w: 106, op: 0.76, rot: -9, delay: -1.8 },
    { t: 70, ri: 10, w: 102, op: 0.74, rot: 7, delay: -2.6 },
    { t: 84, l: 42, w: 94, op: 0.71, rot: -6, delay: -0.9 },
  ];

  var root = document.createElement('div');
  root.id = 'page-decor-layer';
  root.className = 'page-decor';
  root.setAttribute('aria-hidden', 'true');

  function addImg(src, s, isJingjiu) {
    var img = document.createElement('img');
    img.className = isJingjiu
      ? 'page-decor__piece page-decor__piece--jingjiu page-decor__piece--floaty'
      : 'page-decor__piece page-decor__piece--soft page-decor__piece--softblend';
    img.src = base + src;
    img.alt = '';
    img.decoding = 'async';
    img.loading = 'lazy';
    img.style.setProperty('--w', s.w + 'px');
    img.style.setProperty('--op', String(s.op));
    img.style.setProperty('--rot', s.rot + 'deg');
    if (s.delay != null) img.style.setProperty('--delay', s.delay + 's');
    if (s.t != null) img.style.top = s.t + '%';
    if (s.l != null) img.style.left = s.l + '%';
    if (s.ri != null) {
      img.style.right = s.ri + '%';
      if (s.l == null) img.style.left = 'auto';
    }
    if (s.b != null) {
      img.style.bottom = s.b + '%';
      if (s.t == null) img.style.top = 'auto';
    }
    if (s.t == null && s.b == null) img.style.top = '10%';
    if (s.l == null && s.ri == null) img.style.left = '0';
    root.appendChild(img);
  }

  soft.forEach(function (s) {
    addImg(fileSoft[s.f % 3], s, false);
  });
  jingjiu.forEach(function (s) {
    addImg(fileBottle, s, true);
  });

  var banner = document.getElementById('mian1FileProtocolBanner');
  if (banner) {
    banner.insertAdjacentElement('afterend', root);
  } else {
    document.body.insertBefore(root, document.body.firstChild);
  }

  document.body.classList.add('page-decor-on');
})();
