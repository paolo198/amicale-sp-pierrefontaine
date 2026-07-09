const loginSection = document.getElementById('admin-login');
const panelSection = document.getElementById('admin-panel');

let adminActusData = [];
let adminEventsData = [];

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    loginSection.style.display = 'none';
    panelSection.style.display = 'block';
    loadAdminActus();
    loadAdminEvents();
  } else {
    loginSection.style.display = 'block';
    panelSection.style.display = 'none';
  }
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  const errorEl = document.getElementById('login-error');
  if (error) {
    errorEl.textContent = 'Identifiants incorrects.';
  } else {
    errorEl.textContent = '';
    checkAuth();
  }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  checkAuth();
});

/* ---------- Actus ---------- */

document.getElementById('actu-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const editId = document.getElementById('actu-edit-id').value;
  const titre = document.getElementById('actu-titre').value;
  const date_actu = document.getElementById('actu-date').value;
  const contenu = document.getElementById('actu-contenu').value;

  let error;
  if (editId) {
    ({ error } = await supabaseClient.from('actus').update({ titre, date_actu, contenu }).eq('id', editId));
  } else {
    ({ error } = await supabaseClient.from('actus').insert({ titre, date_actu, contenu }));
  }

  if (!error) {
    resetActuForm();
    loadAdminActus();
  } else {
    alert('Erreur lors de la publication.');
  }
});

document.getElementById('actu-cancel-edit').addEventListener('click', resetActuForm);

function resetActuForm() {
  document.getElementById('actu-form').reset();
  document.getElementById('actu-edit-id').value = '';
  document.getElementById('actu-form-title').textContent = 'Ajouter une actu';
  document.getElementById('actu-submit-btn').textContent = "Publier l'actu";
  document.getElementById('actu-cancel-edit').style.display = 'none';
}

function editActu(id) {
  const item = adminActusData.find(a => a.id === id);
  if (!item) return;
  document.getElementById('actu-edit-id').value = item.id;
  document.getElementById('actu-titre').value = item.titre;
  document.getElementById('actu-date').value = item.date_actu;
  document.getElementById('actu-contenu').value = item.contenu;
  document.getElementById('actu-form-title').textContent = "Modifier l'actu";
  document.getElementById('actu-submit-btn').textContent = 'Enregistrer les modifications';
  document.getElementById('actu-cancel-edit').style.display = 'inline-block';
  document.getElementById('actu-form').scrollIntoView({ behavior: 'smooth' });
}

async function loadAdminActus() {
  const { data } = await supabaseClient.from('actus').select('*').order('date_actu', { ascending: false });
  adminActusData = data || [];
  const container = document.getElementById('actus-admin-list');
  if (adminActusData.length === 0) {
    container.innerHTML = '<p class="section-text">Aucune actu.</p>';
    return;
  }
  container.innerHTML = adminActusData.map(item => `
    <div class="admin-item">
      <div>
        <strong>${escapeHtml(item.titre)}</strong>
        <span class="admin-item-date">${item.date_actu}</span>
      </div>
      <div style="display:flex; gap:14px;">
        <button class="admin-edit" data-table="actus" data-id="${item.id}">Modifier</button>
        <button class="admin-delete" data-table="actus" data-id="${item.id}">Supprimer</button>
      </div>
    </div>
  `).join('');
  attachRowHandlers();
}

/* ---------- Événements ---------- */

document.getElementById('event-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const editId = document.getElementById('event-edit-id').value;
  const titre = document.getElementById('event-titre').value;
  const date_evenement = document.getElementById('event-date').value;
  const lieu = document.getElementById('event-lieu').value;
  const description = document.getElementById('event-description').value;

  let error;
  if (editId) {
    ({ error } = await supabaseClient.from('evenements').update({ titre, date_evenement, lieu, description }).eq('id', editId));
  } else {
    ({ error } = await supabaseClient.from('evenements').insert({ titre, date_evenement, lieu, description }));
  }

  if (!error) {
    resetEventForm();
    loadAdminEvents();
  } else {
    alert('Erreur lors de la publication.');
  }
});

document.getElementById('event-cancel-edit').addEventListener('click', resetEventForm);

function resetEventForm() {
  document.getElementById('event-form').reset();
  document.getElementById('event-edit-id').value = '';
  document.getElementById('event-form-title').textContent = 'Ajouter un événement';
  document.getElementById('event-submit-btn').textContent = "Publier l'événement";
  document.getElementById('event-cancel-edit').style.display = 'none';
}

function editEvent(id) {
  const item = adminEventsData.find(e => e.id === id);
  if (!item) return;
  document.getElementById('event-edit-id').value = item.id;
  document.getElementById('event-titre').value = item.titre;
  document.getElementById('event-date').value = item.date_evenement;
  document.getElementById('event-lieu').value = item.lieu;
  document.getElementById('event-description').value = item.description || '';
  document.getElementById('event-form-title').textContent = "Modifier l'événement";
  document.getElementById('event-submit-btn').textContent = 'Enregistrer les modifications';
  document.getElementById('event-cancel-edit').style.display = 'inline-block';
  document.getElementById('event-form').scrollIntoView({ behavior: 'smooth' });
}

async function loadAdminEvents() {
  const { data } = await supabaseClient.from('evenements').select('*').order('date_evenement', { ascending: true });
  adminEventsData = data || [];
  const container = document.getElementById('events-admin-list');
  if (adminEventsData.length === 0) {
    container.innerHTML = '<p class="section-text">Aucun événement.</p>';
    return;
  }
  container.innerHTML = adminEventsData.map(item => `
    <div class="admin-item">
      <div>
        <strong>${escapeHtml(item.titre)}</strong>
        <span class="admin-item-date">${item.date_evenement} — ${escapeHtml(item.lieu)}</span>
      </div>
      <div style="display:flex; gap:14px;">
        <button class="admin-edit" data-table="evenements" data-id="${item.id}">Modifier</button>
        <button class="admin-delete" data-table="evenements" data-id="${item.id}">Supprimer</button>
      </div>
    </div>
  `).join('');
  attachRowHandlers();
}

/* ---------- Boutons Modifier / Supprimer ---------- */

function attachRowHandlers() {
  document.querySelectorAll('.admin-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.table === 'actus') {
        editActu(btn.dataset.id);
      } else {
        editEvent(btn.dataset.id);
      }
    });
  });

  document.querySelectorAll('.admin-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Supprimer cet élément ?')) return;
      const table = btn.dataset.table;
      const id = btn.dataset.id;
      await supabaseClient.from(table).delete().eq('id', id);
      if (table === 'actus') loadAdminActus(); else loadAdminEvents();
    });
  });
}

checkAuth();
