const inboxList = document.getElementById("inbox-list");
const emailBody = document.getElementById("email-body");
const attachmentsDiv = document.getElementById("attachments");

document.getElementById("getEmail").onclick = () => {
  const localPart = document.getElementById("local-part").value;
  const domain = document.getElementById("domain").value;
  alert(`Email dibuat: ${localPart}@${domain}`);
};

// Dummy email fetch
const dummyEmails = [
  { id: 1, from: "user@example.com", subject: "Tes", body: "Ini isi email", attachments: [] },
];

function renderInbox() {
  inboxList.innerHTML = "";
  dummyEmails.forEach(email => {
    const div = document.createElement("div");
    div.textContent = `${email.from} - ${email.subject}`;
    div.style.cursor = "pointer";
    div.onclick = () => showEmail(email);
    inboxList.appendChild(div);
  });
}

function showEmail(email) {
  emailBody.textContent = email.body;
  attachmentsDiv.innerHTML = "";
  email.attachments.forEach(att => {
    const a = document.createElement("a");
    a.href = att.url;
    a.textContent = att.filename;
    attachmentsDiv.appendChild(a);
  });
}

renderInbox();