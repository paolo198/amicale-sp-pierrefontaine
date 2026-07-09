function escapeHtmlEvent(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

let eventsData = [];

async function loadEvents() {
  const container = document.getElementById('events-list');
  const { data, error } = await supabaseClient
    .from('evenements')
    .select('*')
    .order('date_evenement', { ascending: true });

  if (error) {
    container.innerHTML = '<p class="section-text">Impossible de charger les événements pour le moment.</p>';
    return;
  }

  eventsData = data || [];

  if (eventsData.length === 0) {
    container.innerHTML = '<p class="section-text">Aucun événement à venir pour le moment.</p>';
    return;
  }

  container.innerHTML = eventsData.map(item => {
    const d = new Date(item.date_evenement + 'T00:00:00');
    const dateAffichee = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).replace('.', '');
    const bouton = item.description ? `<button class="feed-more" data-id="${item.id}">En savoir plus</button>` : '';
    return `
      <div class="event-row">
        <div>
          <h3>${escapeHtmlEvent(item.titre)}</h3>
          <p>${escapeHtmlEvent(item.lieu)}</p>
          ${bouton}
        </div>
        <span class="event-date">${dateAffichee}</span>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.feed-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = eventsData.find(e => e.id === btn.dataset.id);
      openEventModal(item);
    });
  });
}

function openEventModal(item) {
  const d = new Date(item.date_evenement + 'T00:00:00');
  document.getElementById('event-modal-date').textContent = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + ' — ' + item.lieu;
  document.getElementById('event-modal-title').textContent = item.titre;
  document.getElementById('event-modal-content').textContent = item.description || '';
  document.getElementById('event-modal').classList.add('open');
}

document.getElementById('event-modal-close').addEventListener('click', () => {
  document.getElementById('event-modal').classList.remove('open');
});
document.getElementById('event-modal').addEventListener('click', (e) => {
  if (e.target.id === 'event-modal') document.getElementById('event-modal').classList.remove('open');
});

loadEvents();
