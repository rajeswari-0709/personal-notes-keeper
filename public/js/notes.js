const notesGrid = document.getElementById('notesGrid');
const emptyMsg = document.getElementById('emptyMsg');
const noteForm = document.getElementById('noteForm');
const noteIdInput = document.getElementById('noteId');
const noteTitleInput = document.getElementById('noteTitle');
const noteContentInput = document.getElementById('noteContent');
const saveBtn = document.getElementById('saveBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const searchInput = document.getElementById('searchInput');
const welcomeUser = document.getElementById('welcomeUser');
const logoutBtn = document.getElementById('logoutBtn');

// Check session on page load; redirect to login if not authenticated
async function checkSession() {
  const res = await fetch('/api/auth/me');
  const data = await res.json();
  if (!data.loggedIn) {
    window.location.href = '/';
  } else {
    welcomeUser.textContent = `(${data.username})`;
  }
}

async function fetchNotes(query = '') {
  const url = query ? `/api/notes?q=${encodeURIComponent(query)}` : '/api/notes';
  const res = await fetch(url);
  if (res.status === 401) {
    window.location.href = '/';
    return [];
  }
  return res.json();
}

function renderNotes(notes) {
  notesGrid.innerHTML = '';
  emptyMsg.style.display = notes.length === 0 ? 'block' : 'none';

  notes.forEach((note) => {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `
      <h3>${escapeHtml(note.title)}</h3>
      <p>${escapeHtml(note.content || '')}</p>
      <div class="note-actions">
        <button class="edit-btn" data-id="${note._id}">Edit</button>
        <button class="delete-btn" data-id="${note._id}">Delete</button>
      </div>
    `;
    notesGrid.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function loadAndRender(query = '') {
  const notes = await fetchNotes(query);
  renderNotes(notes);
}

// Create or update note
noteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = noteIdInput.value;
  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();

  if (!title) return;

  const payload = { title, content };
  const url = id ? `/api/notes/${id}` : '/api/notes';
  const method = id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    resetForm();
    loadAndRender(searchInput.value.trim());
  } else {
    const data = await res.json();
    alert(data.message || 'Error saving note.');
  }
});

// Edit / Delete button clicks (event delegation)
notesGrid.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('delete-btn')) {
    if (!confirm('Delete this note?')) return;
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    if (res.ok) loadAndRender(searchInput.value.trim());
  }

  if (e.target.classList.contains('edit-btn')) {
    const res = await fetch('/api/notes');
    const notes = await res.json();
    const note = notes.find((n) => n._id === id);
    if (note) {
      noteIdInput.value = note._id;
      noteTitleInput.value = note.title;
      noteContentInput.value = note.content || '';
      saveBtn.textContent = 'Update Note';
      cancelEditBtn.style.display = 'inline-block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
});

cancelEditBtn.addEventListener('click', resetForm);

function resetForm() {
  noteIdInput.value = '';
  noteTitleInput.value = '';
  noteContentInput.value = '';
  saveBtn.textContent = 'Add Note';
  cancelEditBtn.style.display = 'none';
}

// Search with debounce
let debounceTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    loadAndRender(searchInput.value.trim());
  }, 300);
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/';
});

// Init
checkSession();
loadAndRender();
