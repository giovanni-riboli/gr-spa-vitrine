// auth.js — JWT mock authentication for Giovanni Riboli Espace Pro

const AUTH = {
  TOKEN_KEY: 'gr_pro_token',
  LOGIN_URL: '../espace-pro.html',
  EXPIRY_HOURS: 24,

  // Base64URL encode
  _b64url(str) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },

  // Create mock JWT
  _createToken(payload) {
    const header = this._b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = this._b64url(JSON.stringify(payload));
    const sig = this._b64url("demo-secret-signature");
    return `${header}.${body}.${sig}`;
  },

  // Decode JWT payload
  _decodeToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload;
    } catch { return null; }
  },

  // Login
  login(email, password) {
    const result = mockLogin(email, password);
    if (!result.success) return result;
    const payload = {
      ...result.user,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (this.EXPIRY_HOURS * 3600)
    };
    const token = this._createToken(payload);
    sessionStorage.setItem(this.TOKEN_KEY, token);
    return { success: true };
  },

  // Logout
  logout() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    window.location.href = this.LOGIN_URL;
  },

  // Check if token expired
  isTokenExpired(token) {
    const payload = this._decodeToken(token);
    if (!payload || !payload.exp) return true;
    return Date.now() / 1000 > payload.exp;
  },

  // Check auth — returns payload or null
  checkAuth() {
    const token = sessionStorage.getItem(this.TOKEN_KEY);
    if (!token || this.isTokenExpired(token)) return null;
    return this._decodeToken(token);
  },

  // Get current user info
  getUser() {
    return this.checkAuth();
  },

  // Protect page — call on every pro page load
  requireAuth() {
    const user = this.checkAuth();
    if (!user) {
      window.location.href = this.LOGIN_URL;
      return null;
    }
    return user;
  }
};
