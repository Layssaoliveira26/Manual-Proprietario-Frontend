const mockPayload = {
  profile: "CONSTRUTOR", 
  email: "teste@mock.com",
  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // expira em 24h
};

const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
const payload = btoa(JSON.stringify(mockPayload));
const fakeToken = `${header}.${payload}.fakesignature`;

localStorage.setItem("token", fakeToken);
console.log("✅ Mock token injetado! Recarregue a página.");