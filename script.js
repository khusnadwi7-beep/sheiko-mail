const API_URL = "https://sheiko-mail-api.khusnadwi7.workers.dev";

// Elemen DOM
const emailDisplay = document.getElementById("emailDisplay");
const usernameInput = document.getElementById("username");
const domainSelect = document.getElementById("domain");
const inboxList = document.getElementById("inboxList");
const readPanel = document.getElementById("readPanel");
const takeEmailBtn = document.getElementById("takeEmail");
const copyBtn = document.getElementById("copyBtn");
const refreshBtn = document.getElementById("refreshBtn");
const newBtn = document.getElementById("newBtn");
const deleteBtn = document.getElementById("deleteBtn");

// Variabel state
let currentEmail = `${usernameInput.value}@${domainSelect.value}`;
let inbox = [];

// ======= UTILITY FUNCTIONS =======
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString();
}

// ======= FETCH EMAILS =======
async function fetchInbox(email) {
  inboxList.innerHTML = `<div class="empty">Loading...</div>`;
  try {
    const res = await fetch(`${API_URL}/api/inbox?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    inbox = data || [];

    if (inbox.length === 0) {
      inboxList.innerHTML = `<div class="empty">Empty Inbox</div>`;
      readPanel.innerHTML = `<div class="reader-empty">Pilih pesan untuk membaca email</div>`;
      return;
    }

    renderInbox();
  } catch (err) {
    console.error(err);
    inboxList.innerHTML = `<div class="empty">Error loading inbox</div>`;
  }
}

function renderInbox() {
  inboxList.innerHTML = "";
  inbox.forEach(email => {
    const div = document.createElement("div");
    div.className = "mail-item";
    div.innerHTML = `
      <div class="mail-from">${email.from}</div>
      <div class="mail-subject">${email.subject}</div>
      <div class="mail-date">${formatDate(email.date)}</div>
    `;
    div.onclick = () => readEmail(email.id);
    inboxList.appendChild(div);
  });
}

// ======= READ EMAIL =======
async function readEmail(id) {
  readPanel.innerHTML = `<div class="reader-empty">Loading email...</div>`;
  try {
    const res = await fetch(`${API_URL}/api/message?id=${id}`);
    const email = await res.json();

    let attachmentsHTML = "";
    if (email.attachments && email.attachments.length > 0) {
      attachmentsHTML = '<div class="attachments">Attachments:<br>';
      email.attachments.forEach(att => {
        const url = `${API_URL}/api/attachment?id=${id}&file=${encodeURIComponent(att.filename)}`;
        attachmentsHTML += `<a href="${url}" target="_blank">${att.filename}</a>`;
      });
      attachmentsHTML += '</div>';
    }

    readPanel.innerHTML = `
      <div class="reader">
        <h2>${email.subject}</h2>
        <div class="reader-meta">
          From: ${email.from}<br>
          Date: ${formatDate(email.date)}
        </div>
        <div class="reader-body">${email.text || "(No content)"}</div>
        ${attachmentsHTML}
      </div>
    `;
  } catch (err) {
    console.error(err);
    readPanel.innerHTML = `<div class="reader-empty">Error loading email</div>`;
  }
}

// ======= ACTION BUTTONS =======
takeEmailBtn.onclick = () => {
  currentEmail = `${usernameInput.value}@${domainSelect.value}`;
  emailDisplay.textContent = currentEmail;
  fetchInbox(currentEmail);
};

copyBtn.onclick = () => {
  navigator.clipboard.writeText(currentEmail);
  showToast("Email disalin!");
};

refreshBtn.onclick = () => {
  fetchInbox(currentEmail);
};

newBtn.onclick = () => {
  const rand = Math.random().toString(36).substring(2, 10);
  usernameInput.value = rand;
  currentEmail = `${rand}@${domainSelect.value}`;
  emailDisplay.textContent = currentEmail;
  fetchInbox(currentEmail);
};

deleteBtn.onclick = async () => {
  if (!confirm("Hapus semua email di inbox ini?")) return;
  try {
    await fetch(`${API_URL}/api/delete?email=${encodeURIComponent(currentEmail)}`);
    inbox = [];
    inboxList.innerHTML = `<div class="empty">Empty Inbox</div>`;
    readPanel.innerHTML = `<div class="reader-empty">Pilih pesan untuk membaca email</div>`;
    showToast("Inbox dihapus!");
  } catch (err) {
    console.error(err);
    showToast("Gagal menghapus inbox!");
  }
};

// ======= INIT =======
emailDisplay.textContent = currentEmail;
fetchInbox(currentEmail);
