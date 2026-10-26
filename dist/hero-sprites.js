'use strict';

// One non-animated, ten-pose horizontal sheet for each selectable hero.
const heroNames = ['knight', 'mage', 'scholar', 'ranger'];
const spriteVersion = '12';
const poseColumns = {walk:0, eat:1, sleep:2, read:3, attack:4, magic:5, shield:6, sit:7, play:8, win:9};
// Level 1 has a dedicated eight-frame walk cycle.  The artwork is normalised to
// equally sized cells with wide transparent gutters, so a frame can never bleed
// into the next one when it is shown in a small game viewport.
const levelOneWalkSheet = new Image();
levelOneWalkSheet.onload = updateHeroSprites;
levelOneWalkSheet.src = `assets/hero-level-1-walk-8frames.png?v=${spriteVersion}`;
const spriteSheets = heroNames.map(name => {
  const image = new Image();
  image.onload = updateHeroSprites;
  image.src = `assets/hero-${name}-ten-poses.png?v=${spriteVersion}`;
  return image;
});

function spriteStyle(image, columns, frame, width, height) {
  const cellWidth = image.naturalWidth / columns;
  const cellHeight = image.naturalHeight;
  const scale = Math.max(width / cellWidth, height / cellHeight);
  return {
    size: `${image.naturalWidth * scale}px ${cellHeight * scale}px`,
    position: `${(width - cellWidth * scale) / 2 - frame * cellWidth * scale}px ${(height - cellHeight * scale) / 2}px`
  };
}

function clearHomeFrame(el) {
  if (!el.classList.contains('home-frame-ready')) return;
  el.replaceChildren();
  el.classList.remove('home-frame-ready', 'home-walk-ready');
  el.style.removeProperty('background-image');
  el.style.removeProperty('background-size');
  el.style.removeProperty('background-position');
}

function paintHomeWalkFrame(el, frame) {
  const src = `assets/home-hero-frames/${String(frame).padStart(2, '0')}.png?v=${spriteVersion}`;
  let image = el.querySelector(':scope > img[data-home-frame]');
  if (!image || image.dataset.homeFrame !== String(frame)) {
    el.replaceChildren();
    image = document.createElement('img');
    image.dataset.homeFrame = String(frame);
    image.src = src;
    image.alt = '';
    image.draggable = false;
    el.append(image);
  }
  el.classList.add('painted-sprite-ready', 'home-frame-ready', 'home-walk-ready');
  el.style.setProperty('background-image', 'none', 'important');
  el.style.setProperty('transform', el.closest?.('.room-actor')?.classList.contains('facing-left') ? 'none' : 'scaleX(-1)', 'important');
  el.style.setProperty('animation', 'none', 'important');
  el.dataset.smoothWalk = 'true';
  return true;
}

function paintSmoothLevelOneWalk(el) {
  if (el.closest?.('.room-actor')) {
    return paintHomeWalkFrame(el, Math.floor(performance.now() / 150) % 8);
  }
  if (!levelOneWalkSheet.complete || !levelOneWalkSheet.naturalWidth || !el.clientWidth || !el.clientHeight) return false;
  const frame = Math.floor(performance.now() / 110) % 8;
  clearHomeFrame(el);
  const style = spriteStyle(levelOneWalkSheet, 8, frame, el.clientWidth, el.clientHeight);
  el.classList.add('painted-sprite-ready', 'smooth-walk-ready');
  el.style.setProperty('background-image', `url('assets/hero-level-1-walk-8frames.png?v=${spriteVersion}')`, 'important');
  el.style.setProperty('background-size', style.size, 'important');
  el.style.setProperty('background-position', style.position, 'important');
  el.style.setProperty('transform', el.closest?.('.room-actor')?.classList.contains('facing-left') ? 'none' : 'scaleX(-1)', 'important');
  el.style.setProperty('animation', 'none', 'important');
  el.dataset.smoothWalk = 'true';
  return true;
}


function paintHeroSprite(el, hero, action) {
  hero = Math.max(0, Math.min(heroNames.length - 1, Number(hero) || 0));
  const isAnimatedSceneHero = el.closest?.('.room-actor') || el.classList.contains('exp-hero');
  if (hero === 0 && el.closest?.('.room-actor') && action === 'walk' && paintSmoothLevelOneWalk(el)) return;
  if (hero === 0 && action === 'walk' && isAnimatedSceneHero && paintSmoothLevelOneWalk(el)) return;
  clearHomeFrame(el);
  const image = spriteSheets[hero];
  if (!image.complete || !image.naturalWidth || !el.clientWidth || !el.clientHeight) return;
  const frame = poseColumns[action] ?? poseColumns.walk;
  const style = spriteStyle(image, 10, frame, el.clientWidth, el.clientHeight);
  el.classList.add('painted-sprite-ready');
  el.style.setProperty('background-image', `url('assets/hero-${heroNames[hero]}-ten-poses.png?v=${spriteVersion}')`, 'important');
  el.style.setProperty('background-size', style.size, 'important');
  el.style.setProperty('background-position', style.position, 'important');
  if (el.closest?.('.room-actor')) {
    el.style.removeProperty('transform');
    el.style.removeProperty('animation');
  } else {
    el.style.setProperty('transform', el.closest?.('.room-actor')?.classList.contains('facing-left') ? 'none' : 'scaleX(-1)', 'important');
    el.style.setProperty('animation', 'none', 'important');
  }
  delete el.dataset.smoothWalk;
  el.dataset.spriteAction = action;
}

function roomSpriteAction(actor) {
  if (actor.classList.contains('stepping')) return 'walk';
  if (actor.classList.contains('eating')) return 'eat';
  if (actor.classList.contains('resting')) return 'sleep';
  if (actor.classList.contains('reading')) return 'read';
  if (actor.classList.contains('sitting')) return 'sit';
  if (actor.classList.contains('practicing')) return 'play';
  if (actor.classList.contains('greeting')) return 'win';
  return 'walk';
}

function combatSpriteAction(seconds) {
  const t = seconds % 18;
  if (t < 8 || t >= 12) return 'walk';
  if (t < 9.5) return 'attack';
  if (t < 10.5) return 'magic';
  if (t < 11.2) return 'shield';
  return 'attack';
}

function updateHeroSprites() {
  const hero = Math.max(0, Math.min(heroNames.length - 1, Number(data.hero) || 0));
  document.querySelectorAll('.room-actor .actor-sprite').forEach(el =>
    paintHeroSprite(el, hero, roomSpriteAction(el.closest('.room-actor'))));
  document.querySelectorAll('.exp-hero').forEach(el =>
    paintHeroSprite(el, hero, timer?.running ? combatSpriteAction(elapsed()) : 'walk'));
  document.querySelectorAll('.rest-sleeper').forEach(el =>
    paintHeroSprite(el, hero, 'sleep'));
  document.querySelectorAll('[data-party-hero]:not(.actor-sprite):not(.exp-hero):not(.rest-sleeper)').forEach(el =>
    paintHeroSprite(el, Number(el.dataset.partyHero), 'walk'));
}

// Repaint only active walking sprites at animation-frame speed.  Other poses
// remain still, while walking stays fluid during both home movement and quests.
function animateSmoothWalkFrames() {
  document.querySelectorAll('[data-smooth-walk="true"]').forEach(el => paintSmoothLevelOneWalk(el));
  requestAnimationFrame(animateSmoothWalkFrames);
}
requestAnimationFrame(animateSmoothWalkFrames);

portrait = function (i, cls = 'portrait') {
  const hero = Math.max(0, Math.min(heroNames.length - 1, Number(i) || 0));
  return `<div class="${cls} party-sprite" data-party-hero="${hero}" aria-hidden="true"></div>`;
};
setInterval(updateHeroSprites, 200);
render();
