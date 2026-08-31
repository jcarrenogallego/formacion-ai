#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const zlib = require('node:zlib');

const deckPath =
  process.env.SESSION_TIMER_DECK ||
  path.join(__dirname, 'Sesion 01 - Fundamentos de IA.html');
const guidePath =
  process.env.SESSION_TIMER_GUIDE ||
  path.join(__dirname, 'Guia de lectura - Sesion 01.html');
const html = fs.readFileSync(deckPath, 'utf8');
const guideHtml = fs.readFileSync(guidePath, 'utf8');
const manifestMatch = html.match(
  /<script type="__bundler\/manifest">\s*([\s\S]*?)\s*<\/script>/,
);
assert.ok(manifestMatch, 'The bundled manifest must exist');

const manifest = JSON.parse(manifestMatch[1]);
const timerResource = Object.values(manifest).find((resource) => {
  if (!resource.mime.includes('javascript')) return false;
  const source = zlib.gunzipSync(Buffer.from(resource.data, 'base64')).toString();
  return source.includes("customElements.define('session-timer'");
});
assert.ok(timerResource, 'The session-timer resource must exist');
const timerSource = zlib
  .gunzipSync(Buffer.from(timerResource.data, 'base64'))
  .toString();
const guideTemplateMatch = guideHtml.match(
  /<script type="__bundler\/template">\s*([\s\S]*?)\s*<\/script>/,
);
assert.ok(guideTemplateMatch, 'The bundled guide template must exist');
const guideTemplate = JSON.parse(guideTemplateMatch[1]);
const guideLogicMatch = guideTemplate.match(
  /<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/,
);
assert.ok(guideLogicMatch, 'The guide component logic must exist');
const guideLogic = `${guideLogicMatch[1]}\nglobalThis.GuideComponent = Component;`;

let now = 0;
let nextIntervalId = 1;
const intervals = new Map();
const storage = new Map();
const registry = new Map();
const channels = new Map();
const timerWindowListeners = new Map();

class FakeBroadcastChannel {
  constructor(name) {
    this.name = name;
    this.listeners = new Set();
    const peers = channels.get(name) || new Set();
    peers.add(this);
    channels.set(name, peers);
  }

  addEventListener(type, listener) {
    if (type === 'message') this.listeners.add(listener);
  }

  postMessage(data) {
    for (const peer of channels.get(this.name) || []) {
      if (peer === this) continue;
      for (const listener of peer.listeners) listener({ data });
      peer.onmessage?.({ data });
    }
  }

  close() {
    channels.get(this.name)?.delete(this);
  }
}

class FakeElement {
  constructor() {
    this.attributes = new Map();
    this.listeners = new Map();
    this.shadowRoot = null;
    this.textContent = '';
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  hasAttribute(name) {
    return this.attributes.has(name);
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  dispatch(type, event = {}) {
    this.listeners.get(type)?.(event);
  }

  attachShadow() {
    const num = new FakeElement();
    const chip = new FakeElement();
    this.shadowRoot = {
      innerHTML: '',
      querySelector(selector) {
        return selector === '.num' ? num : selector === '.chip' ? chip : null;
      },
    };
    return this.shadowRoot;
  }
}

const clock = {
  advance(milliseconds) {
    const target = now + milliseconds;
    while (true) {
      let dueId = null;
      let dueAt = Infinity;
      for (const [id, interval] of intervals) {
        if (interval.next < dueAt) {
          dueId = id;
          dueAt = interval.next;
        }
      }
      if (dueAt > target) break;
      now = dueAt;
      const interval = intervals.get(dueId);
      if (!interval) continue;
      interval.next += interval.delay;
      interval.callback();
    }
    now = target;
  },
};

const context = {
  Buffer,
  Date: class extends Date {
    static now() {
      return now;
    }
  },
  HTMLElement: FakeElement,
  customElements: {
    define(name, constructor) {
      registry.set(name, constructor);
    },
    get(name) {
      return registry.get(name);
    },
  },
  localStorage: {
    getItem(key) {
      return storage.get(key) ?? null;
    },
    setItem(key, value) {
      storage.set(key, value);
    },
    removeItem(key) {
      storage.delete(key);
      for (const listener of timerWindowListeners.get('storage') || []) {
        listener({ key });
      }
    },
    key(index) {
      return Array.from(storage.keys())[index] ?? null;
    },
    get length() {
      return storage.size;
    },
  },
  BroadcastChannel: FakeBroadcastChannel,
  setInterval(callback, delay) {
    const id = nextIntervalId++;
    intervals.set(id, { callback, delay, next: now + delay });
    return id;
  },
  clearInterval(id) {
    intervals.delete(id);
  },
};
context.window = {
  BroadcastChannel: FakeBroadcastChannel,
  addEventListener(type, listener) {
    const listeners = timerWindowListeners.get(type) || new Set();
    listeners.add(listener);
    timerWindowListeners.set(type, listeners);
  },
};

vm.runInNewContext(timerSource, context, { filename: 'session-timer.js' });
const SessionTimer = registry.get('session-timer');

class FakeDCLogic {
  setState(update, callback) {
    const next = typeof update === 'function' ? update(this.state) : update;
    this.state = { ...this.state, ...next };
    callback?.();
  }
}

class FakeIntersectionObserver {
  observe() {}
  disconnect() {}
}

const guideWindow = {
  BroadcastChannel: FakeBroadcastChannel,
  addEventListener() {},
  removeEventListener() {},
};
const guideContext = {
  BroadcastChannel: FakeBroadcastChannel,
  DCLogic: FakeDCLogic,
  IntersectionObserver: FakeIntersectionObserver,
  document: {
    addEventListener() {},
    removeEventListener() {},
    querySelectorAll() {
      return [];
    },
  },
  localStorage: context.localStorage,
  requestAnimationFrame() {
    return 1;
  },
  cancelAnimationFrame() {},
  window: guideWindow,
};
vm.runInNewContext(guideLogic, guideContext, { filename: 'guide-logic.js' });
const GuideComponent = guideContext.GuideComponent;

function createTimer(group, seconds) {
  const timer = new SessionTimer();
  timer.setAttribute('group', group);
  timer.setAttribute('minutes', String(seconds / 60));
  timer.connectedCallback();
  return timer;
}

function click(timer) {
  timer.shadowRoot.querySelector('.chip').dispatch('click');
}

function state(group) {
  return JSON.parse(storage.get(`om-session-timer:${group}`));
}

function createGuide() {
  const guide = new GuideComponent();
  guide.componentDidMount();
  return guide;
}

let failures = 0;
function test(name, run) {
  storage.clear();
  try {
    run();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${name}`);
    console.error(error.message);
  }
}

test('a one-second countdown stops exactly at zero', () => {
  const countdown = createTimer('countdown', 1);
  try {
    click(countdown);
    clock.advance(1000);
    assert.equal(countdown.shadowRoot.querySelector('.num').textContent, '00:00');
    assert.deepEqual(state('countdown'), { running: false, left: 0, ts: now });
    assert.equal(intervals.size, 0, 'A completed timer must stop its interval');
    clock.advance(2000);
    assert.equal(countdown.shadowRoot.querySelector('.num').textContent, '00:00');
  } finally {
    countdown.disconnectedCallback();
  }
});

test('starting B pauses A and clicking B again pauses B', () => {
  const timerA = createTimer('A', 60);
  const timerB = createTimer('B', 60);
  try {
    click(timerA);
    clock.advance(1000);
    click(timerB);
    assert.deepEqual(state('A'), { running: false, left: 59, ts: now });
    assert.deepEqual(state('B'), { running: true, left: 60, ts: now });
    assert.ok(intervals.size > 0, 'Timer B must have an active interval');

    click(timerB);
    assert.deepEqual(state('B'), { running: false, left: 60, ts: now });
    assert.equal(intervals.size, 0, 'Pausing the active timer must stop the interval');
  } finally {
    timerA.disconnectedCallback();
    timerB.disconnectedCallback();
  }
});

test('clicking a completed timer does not restart it', () => {
  storage.set(
    'om-session-timer:completed',
    JSON.stringify({ running: false, left: 0, ts: now }),
  );
  const completed = createTimer('completed', 60);
  try {
    click(completed);
    assert.deepEqual(state('completed'), { running: false, left: 0, ts: now });
    assert.equal(intervals.size, 0, 'A completed timer must not restart on click');
  } finally {
    completed.disconnectedCallback();
  }
});

test('disconnecting all timers clears live intervals', () => {
  const timer = createTimer('cleanup', 60);
  click(timer);
  assert.ok(intervals.size > 0, 'The running timer must own a live interval');
  timer.disconnectedCallback();
  assert.equal(intervals.size, 0, 'Disconnecting the timer must clean up its interval');
});

test('the guide exposes an accessible Iniciar button after its introduction', () => {
  const header = guideTemplate.match(/<header[\s\S]*?<\/header>/)?.[0] || '';
  const introEnd = header.indexOf('más 10 minutos de descanso.</p>');
  const buttonStart = header.indexOf('<button', introEnd);
  assert.ok(introEnd >= 0, 'The complete introduction must remain in the header');
  assert.ok(buttonStart > introEnd, 'The button must follow the introduction');
  assert.match(
    header.slice(buttonStart),
    /^<button[^>]*type="button"[^>]*sc-camel-on-click="\{\{ startSession \}\}"[^>]*>[\s\S]*?Iniciar[\s\S]*?<\/button>/,
  );
});

test('Iniciar resets every mounted timer, persists the reset, and preserves other keys', () => {
  const timerA = createTimer('A', 60);
  const timerB = createTimer('B', 120);
  const guide = createGuide();
  try {
    storage.set('om-sesion01-slide', '23');
    storage.set('course-preference', 'preserve-me');
    click(timerA);
    clock.advance(9000);
    assert.equal(state('A').running, true, 'Timer A must be advanced before reset');
    assert.equal(
      timerA.shadowRoot.querySelector('.num').textContent,
      '00:51',
      'Timer A must expose its advanced persisted clock before reset',
    );
    click(timerB);
    clock.advance(7000);
    assert.equal(state('B').running, true, 'Timer B must be advanced before reset');

    guide.renderVals().startSession();

    assert.deepEqual(state('A'), { running: false, left: 60, ts: now });
    assert.deepEqual(state('B'), { running: false, left: 120, ts: now });
    assert.equal(timerA.shadowRoot.querySelector('.num').textContent, '1 min');
    assert.equal(timerB.shadowRoot.querySelector('.num').textContent, '2 min');
    assert.equal(intervals.size, 0, 'Reset must stop the shared ticker');
    clock.advance(3000);
    assert.deepEqual(state('A'), { running: false, left: 60, ts: now - 3000 });
    assert.deepEqual(state('B'), { running: false, left: 120, ts: now - 3000 });
    assert.equal(storage.get('om-sesion01-slide'), '23');
    assert.equal(storage.get('course-preference'), 'preserve-me');

    guide.renderVals().startSession();
    assert.deepEqual(state('A'), { running: false, left: 60, ts: now });
    assert.deepEqual(state('B'), { running: false, left: 120, ts: now });
    assert.equal(storage.get('om-sesion01-slide'), '23');
    assert.equal(storage.get('course-preference'), 'preserve-me');
  } finally {
    guide.componentWillUnmount();
    timerA.disconnectedCallback();
    timerB.disconnectedCallback();
  }

  const reloadedA = createTimer('A', 60);
  const reloadedB = createTimer('B', 120);
  try {
    assert.equal(reloadedA.shadowRoot.querySelector('.num').textContent, '1 min');
    assert.equal(reloadedB.shadowRoot.querySelector('.num').textContent, '2 min');
    assert.equal(state('A').running, false);
    assert.equal(state('B').running, false);
  } finally {
    reloadedA.disconnectedCallback();
    reloadedB.disconnectedCallback();
  }
});

test('Iniciar is safe when timer persistence and the sync channel are unavailable', () => {
  const guide = new GuideComponent();
  const originalKey = context.localStorage.key;
  Object.defineProperty(context.localStorage, 'length', {
    configurable: true,
    get() {
      throw new Error('storage unavailable');
    },
  });
  context.localStorage.key = () => {
    throw new Error('storage unavailable');
  };
  guide.chan = null;
  try {
    assert.doesNotThrow(() => guide.renderVals().startSession());
  } finally {
    context.localStorage.key = originalKey;
    Object.defineProperty(context.localStorage, 'length', {
      configurable: true,
      get() {
        return storage.size;
      },
    });
  }
});

test('storage events reset an open deck when BroadcastChannel is unavailable', () => {
  const timer = createTimer('storage-fallback', 60);
  const guide = createGuide();
  try {
    click(timer);
    clock.advance(5000);
    assert.equal(timer.shadowRoot.querySelector('.num').textContent, '00:55');
    guide.chan.close();
    guide.chan = null;

    guide.renderVals().startSession();

    assert.equal(storage.has('om-session-timer:storage-fallback'), false);
    assert.equal(timer.shadowRoot.querySelector('.num').textContent, '1 min');
    assert.equal(intervals.size, 0, 'The storage fallback must stop the ticker');
  } finally {
    guide.componentWillUnmount();
    timer.disconnectedCallback();
  }
});

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log('session-timer invariants: PASS');
}
