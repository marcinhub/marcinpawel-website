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

// Start silent Nansen previews when they enter the visible page.
const nansenPreviews = document.querySelectorAll('.nansen-project video');
const reducePreviewMotion = matchMedia('(prefers-reduced-motion: reduce)');
const startNansenPreview = video => {
  if (reducePreviewMotion.matches) return;
  video.muted = true;
  video.defaultMuted = true;
  video.play().catch(() => {});
};
const nansenPreviewObserver = new IntersectionObserver(entries => {
  entries.forEach(({target, isIntersecting}) => {
    if (isIntersecting) startNansenPreview(target);
  });
}, {threshold: 0.15});
nansenPreviews.forEach(video => {
  nansenPreviewObserver.observe(video);
  video.addEventListener('canplay', () => startNansenPreview(video));
  if (reducePreviewMotion.matches) { video.autoplay = false; video.pause(); }
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) nansenPreviews.forEach(video => startNansenPreview(video));
});
