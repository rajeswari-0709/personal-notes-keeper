const errorMsg = document.getElementById('errorMsg');

async function postJSON(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Something went wrong.');
  return json;
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
      await postJSON('/api/auth/login', { username, password });
      window.location.href = '/dashboard';
    } catch (err) {
      errorMsg.textContent = err.message;
    }
  });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
      await postJSON('/api/auth/register', { username, password });
      window.location.href = '/dashboard';
    } catch (err) {
      errorMsg.textContent = err.message;
    }
  });
}
