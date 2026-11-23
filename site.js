document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => { const target = document.querySelector(link.getAttribute('href')); if (target) { event.preventDefault(); target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); history.replaceState(null,'',link.getAttribute('href')); } }));
document.querySelectorAll('.video-toggle').forEach(videoToggle => {
  const video = document.getElementById(videoToggle.getAttribute('aria-controls'));
  if (!video) return;
  const label = video.id === 'podcast-preview' ? 'podcast preview' : video.id === 'builders-preview' ? 'builders showcase preview' : 'campaign preview';
  const update = () => {
    videoToggle.textContent = video.paused ? 'Play' : 'Pause';
    videoToggle.setAttribute('aria-label', (video.paused ? 'Play ' : 'Pause ') + label);
  };
  video.addEventListener('play', update);
  video.addEventListener('pause', update);
  videoToggle.addEventListener('click', () => {
    if (video.paused) video.play().catch(update);
    else video.pause();
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.autoplay = false;
    video.pause();
  } else video.play().catch(update);
  update();
});
