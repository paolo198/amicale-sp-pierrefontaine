const loginSection = document.getElementById('admin-login');
const panelSection = document.getElementById('admin-panel');

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

document.getElementById('actu-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const titre = document.getElementById('actu-titre').value;
  const date_actu = document.getElementById('actu-date').value;
  const contenu = document.getElementById('actu-contenu').value;
  const { error } = await supabaseClient.from('actus').insert({ titre, date_actu, contenu });
  if (!error) {
    e.target.reset();
    loadAdminActus();
  } else {
    alert('Erreur lors de la publication.');
  }
});

document.getElementById('event-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const titre = document.getElementById('event-titre').value;
  const date_evenement = document.getElementById('event-date').value;
  const lieu = document.getElementById('event-lieu').value;
  const description = document.getElementById('event-description').value;
  const { error } = await supabaseClient.from('evenements').insert({ titre, date_evenement, lieu, description });
  if (!error) {
    e.target.reset();
    loadAdminEvents();
  } else {
    alert('Erreur lors de la publication.');
  }
});

async function loadAdminActus() {
  const { data } = await supabaseClient.from('actus').select('*').order('date_actu', { ascending: false });
  const container = document.getElementById('actus-admin-list');
  if (!data || data.length === 0) {
    container.innerHTML = '<p class="section-text">Aucune actu.</p>';
    return;
  }
  container.innerHTML = data.map(item => `
    <div class="admin-item">
      <div>
        <strong>${escapeHtml(item.titre)}</strong>
        <span class="admin-item-date">${item.date_actu}</span>
      </div>
      <button class="admin-delete" data-table="actus" data-id="${item.id}">Supprimer</button>
    </div>
  `).join('');
  attachDeleteHandlers();
}

async function loadAdminEvents() {
  const { data } = await supabaseClient.from('evenements').select('*').order('date_evenement', { ascending: true });
  const container = document.getElementById('events-admin-list');
  if (!data || data.length === 0) {
    container.innerHTML = '<p class="section-text">Aucun événement.</p>';
    return;
  }
  container.innerHTML = data.map(item => `
    <div class="admin-item">
      <div>
        <strong>${escapeHtml(item.titre)}</strong>
        <span class="admin-item-date">${item.date_evenement} — ${escapeHtml(item.lieu)}</span>
      </div>
      <button class="admin-delete" data-table="evenements" data-id="${item.id}">Supprimer</button>
    </div>
  `).join('');
  attachDeleteHandlers();
}

function attachDeleteHandlers() {
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
