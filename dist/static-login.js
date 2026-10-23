(() => {
  if (!location.hostname.endsWith('github.io') && location.protocol!=='file:') return;
  const originalFetch = window.fetch.bind(window);
  const demoProfile = { familyId: 'demo', nickname: '小小冒險者', grade: 3, birthYear: 2017, parentName: '家長' };
  const json = (body) => new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });
  window.fetch = async (input, options = {}) => {
    const url = typeof input === 'string' ? input : input.url;
    if (!url.includes('/api/')) return originalFetch(input, options);
    let body = {};
    try { body = options.body ? JSON.parse(options.body) : {}; } catch {}
    if (url.endsWith('/api/parent/login') && body.username === 'admin' && body.password === 'admin') return json({ profile: demoProfile });
    if (url.endsWith('/api/child/login') && body.username === 'test' && body.password === 'test') return json({ profile: demoProfile });
    if (url.endsWith('/api/parent/logout')) return json({});
    return new Response(JSON.stringify({ error: '公開示範版只支援 admin/admin 及 test/test 登入。' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  };
})();
