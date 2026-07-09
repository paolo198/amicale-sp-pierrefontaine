function escapeHtmlActu(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

let actusData = [];

async function loadActus() {
  const container = document.getElementById('actus-list');
  const { data, error } = await supabaseClient
    .from('actus')
    .select('*')
    .order('date_actu', { ascending: false });

  if (error) {
    container.innerHTML = '<p class="section-text">Impossible de charger les actus pour le moment.</p>';
    return;
  }

  actusData = data || [];

  if (actusData.length === 0) {
    container.innerHTML = '<p class="section-text">Aucune actu pour le moment.</p>';
    return;
  }

  container.innerHTML = actusData.map(item => {
    const d = new Date(item.date_actu + 'T00:00:00');
    const jour = d.getDate().toString().padStart(2, '0');
    const mois = d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
    const apercu = item.contenu.length > 140 ? item.contenu.slice(0, 140) + '…' : item.contenu;
    return `
      <article class="feed-item">
        <div class="feed-date"><span class="d">${jour}</span><span class="m">${mois}</span></div>
        <div class="feed-body">
          <h3>${escapeHtmlActu(item.titre)}</h3>
          <p>${escapeHtmlActu(apercu)}</p>
          <button class="feed-more" data-id="${item.id}">En savoir plus</button>
        </div>
      </article>
    `;
  }).join('');

  container.querySelectorAll('.feed-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = actusData.find(a => a.id === btn.dataset.id);
      openActuModal(item);
    });
  });
}

function openActuModal(item) {
  const d = new Date(item.date_actu + 'T00:00:00');
  document.getElementById('actu-modal-date').textContent = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  document.getElementById('actu-modal-title').textContent = item.titre;
  document.getElementById('actu-modal-content').textContent = item.contenu;
  document.getElementById('actu-modal').classList.add('open');
}

document.getElementById('actu-modal-close').addEventListener('click', () => {
  document.getElementById('actu-modal').classList.remove('open');
});
document.getElementById('actu-modal').addEventListener('click', (e) => {
  if (e.target.id === 'actu-modal') document.getElementById('actu-modal').classList.remove('open');
});

loadActus();
