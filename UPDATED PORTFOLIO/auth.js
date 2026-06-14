/* ============================================
   THEME TOGGLE (shared across auth pages)
============================================ */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const root = document.documentElement;

function applyTheme(theme) {
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    themeIcon.className = 'fa-solid fa-moon';
  } else {
    root.removeAttribute('data-theme');
    themeIcon.className = 'fa-solid fa-sun';
  }
}

applyTheme(localStorage.getItem('theme') || 'dark');

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

/* ============================================
   TOAST NOTIFICATIONS
============================================ */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ============================================
   HELPERS
============================================ */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}
function setError(id, message) {
  const errorEl = document.getElementById(id + 'Error');
  const inputEl = document.getElementById(id);
  if (!errorEl || !inputEl) return;
  errorEl.textContent = message;
  inputEl.classList.toggle('invalid', !!message);
}

/* Simple hashing (NOT secure - frontend demo only) */
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

/* ============================================
   SHOW / HIDE PASSWORD
============================================ */
document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target') || 'password';
    const input = document.getElementById(targetId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'fa-solid fa-eye-slash';
      btn.setAttribute('aria-label', 'Hide password');
    } else {
      input.type = 'password';
      icon.className = 'fa-solid fa-eye';
      btn.setAttribute('aria-label', 'Show password');
    }
  });
});

/* ============================================
   REGISTER FORM
============================================ */
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name) { setError('name', 'Please enter your full name.'); valid = false; }
    else setError('name', '');

    if (!email) { setError('email', 'Please enter your email.'); valid = false; }
    else if (!emailRegex.test(email)) { setError('email', 'Please enter a valid email.'); valid = false; }
    else {
      const users = getUsers();
      if (users.some(u => u.email === email)) {
        setError('email', 'An account with this email already exists.');
        valid = false;
      } else {
        setError('email', '');
      }
    }

    if (!password) { setError('password', 'Please enter a password.'); valid = false; }
    else if (password.length < 6) { setError('password', 'Password must be at least 6 characters.'); valid = false; }
    else setError('password', '');

    if (!confirmPassword) { setError('confirmPassword', 'Please confirm your password.'); valid = false; }
    else if (password !== confirmPassword) { setError('confirmPassword', 'Passwords do not match.'); valid = false; }
    else setError('confirmPassword', '');

    if (!valid) {
      showToast('Please fix the errors in the form.', 'error');
      return;
    }

    const users = getUsers();
    users.push({
      name,
      email,
      password: hashPassword(password),
      joined: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    saveUsers(users);

    showToast('Account created successfully! Redirecting to login...', 'success');
    setTimeout(() => window.location.href = 'login.html', 1500);
  });
}

/* ============================================
   LOGIN FORM
============================================ */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    if (!email) { setError('email', 'Please enter your email.'); valid = false; }
    else if (!emailRegex.test(email)) { setError('email', 'Please enter a valid email.'); valid = false; }
    else setError('email', '');

    if (!password) { setError('password', 'Please enter your password.'); valid = false; }
    else setError('password', '');

    if (!valid) {
      showToast('Please fix the errors in the form.', 'error');
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user || user.password !== hashPassword(password)) {
      setError('password', 'Incorrect email or password.');
      showToast('Invalid email or password.', 'error');
      return;
    }

    const session = { email: user.email, name: user.name, remember };
    localStorage.setItem('session', JSON.stringify(session));

    showToast(`Welcome back, ${user.name}! Redirecting...`, 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1200);
  });
}

/* ============================================
   DASHBOARD
============================================ */
const viewMode = document.getElementById('viewMode');
if (viewMode) {
  const session = JSON.parse(localStorage.getItem('session') || 'null');

  if (!session) {
    window.location.href = 'login.html';
  } else {
    const users = getUsers();
    const user = users.find(u => u.email === session.email);

    if (!user) {
      localStorage.removeItem('session');
      window.location.href = 'login.html';
    } else {
      // Populate view
      document.getElementById('welcomeMsg').textContent = `Welcome back, ${user.name}!`;
      document.getElementById('viewName').textContent = user.name;
      document.getElementById('viewEmail').textContent = user.email;
      document.getElementById('viewJoined').textContent = user.joined || '—';
      document.getElementById('dashAvatar').src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;

      const editForm = document.getElementById('editForm');
      const editBtn = document.getElementById('editBtn');
      const editName = document.getElementById('editName');
      const editEmail = document.getElementById('editEmail');

      editBtn.addEventListener('click', () => {
        const isHidden = editForm.hidden;
        if (isHidden) {
          editName.value = user.name;
          editEmail.value = user.email;
          editForm.hidden = false;
          viewMode.hidden = true;
          editBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Cancel';
        } else {
          editForm.hidden = true;
          viewMode.hidden = false;
          editBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Edit Profile';
        }
      });

      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        const newName = editName.value.trim();
        const newEmail = editEmail.value.trim().toLowerCase();

        if (!newName) { setError('editName', 'Please enter your name.'); valid = false; }
        else setError('editName', '');

        if (!newEmail) { setError('editEmail', 'Please enter your email.'); valid = false; }
        else if (!emailRegex.test(newEmail)) { setError('editEmail', 'Please enter a valid email.'); valid = false; }
        else if (newEmail !== user.email && users.some(u => u.email === newEmail)) {
          setError('editEmail', 'This email is already in use.'); valid = false;
        } else {
          setError('editEmail', '');
        }

        if (!valid) {
          showToast('Please fix the errors in the form.', 'error');
          return;
        }

        // Update user record
        user.name = newName;
        user.email = newEmail;
        const updatedUsers = users.map(u => (u.email === session.email ? user : u));
        saveUsers(updatedUsers);

        // Update session
        localStorage.setItem('session', JSON.stringify({ ...session, email: newEmail, name: newName }));

        // Refresh view
        document.getElementById('welcomeMsg').textContent = `Welcome back, ${user.name}!`;
        document.getElementById('viewName').textContent = user.name;
        document.getElementById('viewEmail').textContent = user.email;
        document.getElementById('dashAvatar').src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;

        editForm.hidden = true;
        viewMode.hidden = false;
        editBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Edit Profile';

        showToast('Profile updated successfully!', 'success');
      });
    }
  }
}

/* ============================================
   LOGOUT
============================================ */
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('session');
    showToast('Logged out successfully.', 'success');
    setTimeout(() => window.location.href = 'login.html', 1000);
  });
}
