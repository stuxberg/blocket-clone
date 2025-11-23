export const checkAuth = async () => {
  const res = await fetch("http://localhost:8000/api/auth/status", {
    credentials: "include",
  });

  return res.json();
};

export const login = async (formData) => {
  const res = await fetch("http://localhost:8000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  return res.json();
};

export const register = async (formData) => {
  const res = await fetch("http://localhost:8000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    credentials: "include",
  });
  return res;
};
