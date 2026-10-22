(() => {
  const serverAPI = localAPI;
  localAPI = async (url, options = {}) => {
    try {
      return await serverAPI(url, options);
    } catch (error) {
      let body = {};
      try { body = options.body ? JSON.parse(options.body) : {}; } catch {}
      const demoProfile = { familyId: 'demo', nickname: '小小冒險者', grade: 3, birthYear: 2017, parentName: '家長' };
      if (url === '/api/parent/login' && body.username === 'admin' && body.password === 'admin') {
        return { profile: demoProfile };
      }
      if (url === '/api/child/login' && body.username === 'test' && body.password === 'test') {
        return { profile: demoProfile };
      }
      throw error;
    }
  };
})();
