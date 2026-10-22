const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function context() {
  const c = vm.createContext({
    data: { hero: 0 }, modal: null, timer: null,
    document: { querySelectorAll: () => [] },
    Image: class {
      set src(value) { this.complete = true; this.naturalWidth = 3200; this.naturalHeight = 360; }
    },
    setInterval() {}, render() {}
  });
  vm.runInContext(fs.readFileSync('dist/hero-sprites.js', 'utf8'), c);
  return c;
}

function element() {
  const styles = {};
  return { styles, node: {
    classList: { add() {} },
    style: { setProperty(key, value) { styles[key] = value; } },
    dataset: {}, clientWidth: 250, clientHeight: 250,
    closest() { return null; }
  } };
}

test('four selectable heroes each have one ten-pose horizontal sheet', () => {
  const manifest = JSON.parse(fs.readFileSync('dist/assets/hero-sprites.json'));
  assert.equal(manifest.heroes.length, 4);
  assert.deepEqual(manifest.frameOrder, ['walk','eat','sleep','read','attack','magic','shield','sit','play','win']);
  assert.equal(manifest.columns, 10);
  for (const hero of manifest.heroes) {
    const file = path.join('dist/assets', hero.image);
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
    assert.equal(bytes.readUInt32BE(16), 3200);
    assert.equal(bytes.readUInt32BE(20), 360);
  }
});

test('pose selection stays still instead of cycling walking frames', () => {
  const c = context(); const { node, styles } = element(); c.el = node;
  vm.runInContext("paintHeroSprite(el, 3, 'walk')", c);
  const walkingPosition = styles['background-position'];
  assert.match(styles['background-image'], /hero-ranger-ten-poses\.png/);
  vm.runInContext("paintHeroSprite(el, 3, 'walk')", c);
  assert.equal(styles['background-position'], walkingPosition);
  vm.runInContext("paintHeroSprite(el, 3, 'magic')", c);
  assert.notEqual(styles['background-position'], walkingPosition);
  assert.equal(node.dataset.spriteAction, 'magic');
  assert.equal(styles.animation, 'none');
});

test('mission cycles from walk to fight and back to walk', () => {
  const c = context();
  assert.equal(vm.runInContext('combatSpriteAction(2)', c), 'walk');
  assert.equal(vm.runInContext('combatSpriteAction(8.5)', c), 'attack');
  assert.equal(vm.runInContext('combatSpriteAction(9.7)', c), 'magic');
  assert.equal(vm.runInContext('combatSpriteAction(14)', c), 'walk');
});
