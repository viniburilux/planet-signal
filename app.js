const fmt = (v, f) => (v === null || v === undefined) ? 'em validação' : f(v);
fetch('data/ucs.json').then(r => r.json()).then(d => {
  const map = L.map('mapa').setView([-12, -52], 4);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; OpenStreetMap'}).addTo(map);
  const ucs = d.ucs.slice().sort((a, b) => (b.pressao ?? -1) - (a.pressao ?? -1));
  const tb = document.querySelector('#ranking tbody');
  const ficha = document.getElementById('ficha');
  const show = u => {
    ficha.hidden = false;
    ficha.innerHTML = `<h3>${u.nome}</h3><p>${u.tipo}, ${u.uf}</p><ul>
      <li>Área coberta por CAR privados: ${fmt(u.car_pct, v => v + '%')}</li>
      <li>Supressão recente: ${fmt(u.supressao_km2, v => v + ' km²')}</li>
      <li>Crédito rural vinculado: ${fmt(u.credito_rural, v => 'R$ ' + v.toLocaleString('pt-BR'))}</li></ul>
      <p class="nota">${u.status || ''}</p>`;
  };
  ucs.forEach((u, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i + 1}</td><td>${u.nome}</td><td>${u.uf}</td><td>${fmt(u.pressao, v => v)}</td>`;
    tr.onclick = () => { show(u); map.setView([u.lat, u.lon], 7); };
    tb.appendChild(tr);
    L.marker([u.lat, u.lon]).addTo(map).bindPopup(u.nome).on('click', () => show(u));
  });
  document.getElementById('aviso').textContent = 'Posições aproximadas. Ranking nacional em construção; fonte: ' + d.fonte + '. Atualizado em ' + d.atualizado_em + '.';
});
