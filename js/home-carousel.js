/**
 * 首页功能亮点轮播（自动播放 + 指示点 + 左右键，尊重 prefers-reduced-motion）
 */
(function () {
  'use strict';

  var track = document.getElementById('homeCarouselTrack');
  var dotsRoot = document.getElementById('homeCarouselDots');
  var prevBtn = document.getElementById('homeCarouselPrev');
  var nextBtn = document.getElementById('homeCarouselNext');
  if (!track || !dotsRoot) return;

  var slides = track.children;
  var n = slides.length;
  if (n === 0) return;

  var i = 0;
  var timer = null;
  var intervalMs = 5200;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function go(index) {
    i = ((index % n) + n) % n;
    track.style.transform = 'translateX(-' + i * 100 + '%)';
    var dots = dotsRoot.querySelectorAll('.home-carousel__dot');
    for (var d = 0; d < dots.length; d++) {
      dots[d].setAttribute('aria-current', d === i ? 'true' : 'false');
    }
  }

  function schedule() {
    if (reducedMotion || timer) return;
    timer = window.setInterval(function () {
      go(i + 1);
    }, intervalMs);
  }

  function unschedule() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  for (var b = 0; b < n; b++) {
    (function (idx) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'home-carousel__dot';
      dot.setAttribute('aria-label', '第 ' + (idx + 1) + ' 张');
      dot.addEventListener('click', function () {
        unschedule();
        go(idx);
        schedule();
      });
      dotsRoot.appendChild(dot);
    })(b);
  }
  go(0);

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      unschedule();
      go(i - 1);
      schedule();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      unschedule();
      go(i + 1);
      schedule();
    });
  }

  var root = track.closest('.home-carousel');
  if (root) {
    root.addEventListener('mouseenter', unschedule);
    root.addEventListener('mouseleave', schedule);
    root.addEventListener('focusin', unschedule);
    root.addEventListener('focusout', schedule);
  }

  if (!reducedMotion) {
    schedule();
  }
})();
