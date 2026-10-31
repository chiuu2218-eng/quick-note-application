const form = document.querySelector("#note-form");
const titleInput = document.querySelector("#note-title");
const contentInput = document.querySelector("#note-content");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const formMessage = document.querySelector("#form-message");
const refreshButton = document.querySelector("#refresh-button");

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

function renderNotes(notes) {
  noteCount.textContent = notes.length;
  if (!notes.length) {
    notesList.innerHTML = '<div class="empty-state"><span class="empty-icon">✧</span><strong>No notes yet</strong><br />Your next great idea can start right here.</div>';
    return;
  }

  notesList.innerHTML = notes.map(note => `
    <article class="note-card">
      <h3>${escapeHTML(note.title)}</h3>
      <p>${escapeHTML(note.content)}</p>
      <div class="note-meta">
        <span class="note-date">${escapeHTML(formatDate(note.createdAt))}</span>
        <button class="delete-button" type="button" data-delete-id="${escapeHTML(note.id)}" aria-label="Delete ${escapeHTML(note.title)}">Delete ×</button>
      </div>
    </article>
  `).join("");
}

async function loadNotes() {
  notesList.innerHTML = '<div class="loading-card">Loading your notes…</div>';
  try {
    const notes = await request("/notes");
    renderNotes(notes);
  } catch (error) {
    notesList.innerHTML = `<div class="empty-state">${escapeHTML(error.message)}<br />Please refresh the page and try again.</div>`;
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  formMessage.textContent = "";
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title || !content) {
    formMessage.textContent = "Please fill in both fields.";
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Saving…";
  try {
    await request("/notes", {
      method: "POST",
      body: JSON.stringify({ title, content })
    });
    form.reset();
    formMessage.style.color = "#25875f";
    formMessage.textContent = "Your note has been saved!";
    await loadNotes();
    titleInput.focus();
  } catch (error) {
    formMessage.style.color = "#c34444";
    formMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = "<span>＋</span> Add note";
  }
});

notesList.addEventListener("click", async event => {
  const button = event.target.closest("[data-delete-id]");
  if (!button) return;
  const noteId = button.dataset.deleteId;
  button.disabled = true;
  button.textContent = "Deleting…";
  try {
    await request(`/notes/${encodeURIComponent(noteId)}`, { method: "DELETE" });
    await loadNotes();
  } catch (error) {
    button.disabled = false;
    button.textContent = "Try again";
    formMessage.style.color = "#c34444";
    formMessage.textContent = error.message;
  }
});

refreshButton.addEventListener("click", loadNotes);
loadNotes();
