// AUREL — loja de moda: abertura com a marca, título do hero passando por trás das
// modelos, letreiro que acelera com a rolagem, categorias com foto seguindo o mouse,
// vitrine que troca para a foto com modelo, "shop the look", foto que cresce até a
// tela inteira e editorial em camadas.
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const suave = t => t * t * (3 - 2 * t);

const CATS = [['c-joias', 'Jewelry', 38], ['c-bolsas', 'Bags', 26], ['c-roupas', 'Coats', 19], ['c-sapatos', 'Shoes', 31], ['c-alfaiataria', 'Tailoring', 22]];
const PRODUTOS = [
  ['casaco', 'Double-breasted wool coat', 690, 'ready', 'New', 'S M L'],
  ['bolsa', 'Structured top-handle bag', 540, 'acc', 'Best seller', 'One size'],
  ['camisa', 'Silk bow blouse', 260, 'ready', '', 'S M L'],
  ['mocassim', 'Leather penny loafer', 320, 'shoes', '', '37 38 39 40'],
  ['brinco', 'Chunky gold hoops', 180, 'acc', 'New', 'One size'],
  ['cardigan', 'Cable knit cardigan', 295, 'ready', 'Best seller', 'S M L'],
  ['calca', 'Wide tailored trouser', 240, 'ready', '', 'S M L'],
  ['oculos', 'Square tortoise sunglasses', 210, 'acc', '', 'One size'],
  ['bota', 'Suede ankle boot', 380, 'shoes', 'New', '37 38 39 40'],
  ['lenco', 'Cashmere fringe scarf', 165, 'acc', '', 'One size'],
  ['tiracolo', 'Chain crossbody bag', 450, 'acc', '', 'One size'],
  ['vestido', 'Satin slip dress', 310, 'ready', 'Best seller', 'S M L'],
];
const prod = id => PRODUTOS.find(p => p[0] === id);
// pontos do "shop the look" em % da foto
const LOOK = [['casaco', 63, 56], ['tiracolo', 42, 41.5], ['bota', 51.5, 93]];

// títulos com data-letras: cada palavra numa máscara, letras sobem em sequência
$$('[data-letras]').forEach(el => {
  let k = 0;
  el.innerHTML = el.textContent.trim().split(' ').map(p => `<span class="pal">${[...p].map(c => `<i style="transition-delay:${(k++) * .025}s">${c}</i>`).join('')}</span>`).join(' ');
});

// letreiro
const FRASES = ['Autumn Edit', 'Leather', 'Satin', 'Wool', 'Cashmere', 'Free returns', 'New season'];
const trilho = $('#letreiro');
trilho.innerHTML = Array(4).fill(FRASES.map(f => `<span>${f}</span><span>—</span>`).join('')).join('');

// categorias
$('#catLista').innerHTML = CATS.map(([img, nome, q], i) => `
  <li class="cat" data-i="${i}"><span class="num">0${i + 1}</span><b>${[...nome].map((c, k) => `<i style="transition-delay:${k * .03}s">${c}</i>`).join('')}</b><span class="q">${q} pieces</span>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 12h16M14 6l6 6-6 6"/></svg></li>`).join('');
$('#catFlutua').innerHTML = CATS.map(([img, nome]) => `<img src="img/${img}.webp" alt="">`).join('');

// vitrine: foto do produto e foto com modelo (aparece no hover)
$('#grade').innerHTML = PRODUTOS.map(([id, nome, preco, tipo, selo, tams]) => `
  <article class="prod" data-tipo="${tipo}" data-id="${id}">
    <div class="prod-foto"><img class="prod-a" src="img/p-${id}.webp" alt="${nome}" loading="lazy"><img class="prod-b" src="img/m-${id}.webp" alt="" loading="lazy">
      ${selo ? `<span class="selo${selo === 'New' ? ' novo' : ''}">${selo}</span>` : ''}
      <div class="rapido"><p>Quick add</p><div class="tams">${tams.split(tams === 'One size' ? '|' : ' ').map(t => `<button>${t}</button>`).join('')}</div></div>
    </div>
    <div class="prod-info"><b>${nome}</b><span>$${preco}</span></div>
  </article>`).join('');

// shop the look
$('#lookFoto').insertAdjacentHTML('beforeend', LOOK.map(([id, x, y], i) => `<button class="ponto" data-i="${i}" style="left:${x}%;top:${y}%" aria-label="${prod(id)[1]}">${i + 1}</button>`).join(''));
$('#lookLista').innerHTML = LOOK.map(([id], i) => { const p = prod(id); return `
  <li class="look-item revela" data-i="${i}"><span class="n">0${i + 1}</span><img src="img/p-${id}.webp" alt=""><div><b>${p[1]}</b><small>${p[5] === 'One size' ? 'One size' : 'Size ' + p[5].split(' ')[1]}</small></div><span class="pr">$${p[2]}</span></li>`; }).join('');
$('#lookTotal').textContent = '$' + LOOK.reduce((s, [id]) => s + prod(id)[2], 0);
const marcarLook = i => { $$('.ponto').forEach((p, k) => p.classList.toggle('on', k === i)); $$('.look-item').forEach((p, k) => p.classList.toggle('on', k === i)); };
$$('.ponto, .look-item').forEach(el => {
  el.addEventListener('mouseenter', () => marcarLook(+el.dataset.i));
  el.addEventListener('mouseleave', () => marcarLook(-1));
  el.addEventListener('click', () => marcarLook(+el.dataset.i));
});

// rodapé: marca letra a letra
$('#rodapeMarca').innerHTML = [...'AUREL'].map((c, i) => `<i style="transition-delay:${i * .08}s">${c}</i>`).join('');

// título do hero letra a letra
$$('#heroTitulo .linha').forEach((l, k) => {
  l.innerHTML = [...l.textContent].map((c, i) => `<i style="transition-delay:${.35 + k * .18 + i * .045}s">${c}</i>`).join('');
});

// abertura: letras da marca entram, a marca vai até o logo do topo e o véu sobe
const intro = $('#intro'), introMarca = $('#introMarca');
introMarca.innerHTML = [...'AUREL'].map(c => `<span>${c}</span>`).join('');
function abrir() {
  $$('#introMarca span').forEach((s, i) => setTimeout(() => s.classList.add('on'), 120 + i * 110));
  setTimeout(() => {
    const a = introMarca.getBoundingClientRect(), b = $('#marca').getBoundingClientRect();
    introMarca.style.transform = `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px,${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(${b.width / a.width})`;
    intro.classList.add('sai');
  }, 1300);
  setTimeout(() => { document.body.classList.remove('carregando'); document.body.classList.add('pronto'); }, 1900);
  setTimeout(() => intro.remove(), 2500);
}
Promise.all([document.fonts.ready, $('#heroFoto img').decode().catch(() => {}), $('#heroFrente img').decode().catch(() => {})]).then(abrir);

// aparecer ao entrar na tela
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('visivel'); io.unobserve(e.target);
}), { rootMargin: '0px 0px -10% 0px' });
$$('.revela, [data-letras], .ed, .rodape-marca, .cat, .look-foto').forEach(el => io.observe(el));
$$('.cat').forEach((el, i) => { el.querySelectorAll('b i').forEach(x => x.style.transitionDelay = `${parseFloat(x.style.transitionDelay) + i * .07}s`); });
$$('.prod').forEach((el, i) => { el.querySelector('.prod-foto').style.transitionDelay = `${(i % 4) * .09}s`; io.observe(el); });
$$('.look-item').forEach((el, i) => el.style.transitionDelay = `${.15 + i * .1}s`);

// filtro da vitrine
$('#filtros').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  $$('#filtros button').forEach(x => x.classList.toggle('on', x === b));
  const f = b.dataset.f; let n = 0;
  $$('.prod').forEach(p => {
    const mostra = f === 'all' || p.dataset.tipo === f;
    p.classList.toggle('some', !mostra);
    if (mostra) {
      p.classList.remove('visivel'); p.querySelector('.prod-foto').style.transitionDelay = `${(n++ % 4) * .07}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('visivel')));
    }
  });
});

// sacola
let qtd = 0;
function somar(n = 1) {
  qtd += n; const q = $('#qtd'); q.textContent = qtd; q.classList.add('tem');
  q.classList.remove('pula'); void q.offsetWidth; q.classList.add('pula');
}
$('#grade').addEventListener('click', e => {
  const b = e.target.closest('.tams button'); if (!b) return;
  somar(); b.classList.add('ok'); const t = b.textContent; b.textContent = 'Added';
  setTimeout(() => { b.classList.remove('ok'); b.textContent = t; }, 1200);
});
$('#lookTudo').addEventListener('click', () => {
  somar(LOOK.length); const b = $('#lookTudo'); b.classList.add('ok');
  setTimeout(() => b.classList.remove('ok'), 1400);
});
$('#assinar').addEventListener('click', () => {
  const b = $('#assinar'); if (!$('#email').value.includes('@')) { $('#email').focus(); return; }
  b.classList.add('ok'); b.textContent = 'Subscribed'; $('#email').value = '';
});

// categorias: a foto segue o mouse com atraso e inclina conforme a velocidade
const lista = $('#catLista'), flutua = $('#catFlutua'), fotosCat = [...flutua.children];
let mx = 0, my = 0, fx = 0, fy = 0, catAtiva = -1;
lista.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
lista.addEventListener('mouseenter', e => { mx = fx = e.clientX; my = fy = e.clientY; flutua.classList.add('on'); });
lista.addEventListener('mouseleave', () => { flutua.classList.remove('on'); catAtiva = -1; fotosCat.forEach(f => f.classList.remove('on')); });
$$('.cat').forEach(li => li.addEventListener('mouseenter', () => {
  const i = +li.dataset.i; if (i === catAtiva) return;
  catAtiva = i; fotosCat.forEach((f, k) => { f.classList.toggle('on', k === i); f.style.zIndex = k === i ? 2 : 1; });
}));

// rolagem: letreiro, parallax, foto que cresce, editorial
const titulo = $('#heroTitulo'), topo = $('#topo');
const cresce = $('#cresce'), cFoto = $('#cresceFoto'), cEsq = $('#cresceEsq'), cDir = $('#cresceDir'), cFim = $('#cresceFim');
const edFotos = $$('.ed-foto img'), edFrase = $('.ed-frase');
let x = 0, yAnt = scrollY, vel = 0;
function quadro() {
  const y = scrollY, vh = innerHeight, vw = innerWidth;
  topo.classList.toggle('rolou', y > 10);
  if (y < vh * 1.2) titulo.style.transform = `translate3d(0,${y * .35}px,0)`;

  // letreiro: velocidade base + o que a rolagem empurra
  vel = lerp(vel, (y - yAnt) * .9, .1); yAnt = y;
  x -= .6 + Math.abs(vel);
  const meio = trilho.scrollWidth / 2; if (-x > meio) x += meio;
  trilho.style.transform = `translate3d(${x}px,0,0) skewX(${clamp(vel * -.4, -8, 8)}deg)`;

  // foto seguindo o mouse
  if (flutua.classList.contains('on')) {
    const dx = mx - fx; fx = lerp(fx, mx, .12); fy = lerp(fy, my, .12);
    const w = flutua.offsetWidth, h = flutua.offsetHeight;
    flutua.style.transform = `translate3d(${fx - w / 2}px,${fy - h / 2}px,0) rotate(${clamp(dx * .06, -10, 10)}deg)`;
  }

  // foto que cresce: começa como cartão no meio e termina ocupando a tela
  const r = cresce.getBoundingClientRect();
  const p = clamp(-r.top / (r.height - vh)), e = suave(clamp(p / .78));
  const mob = vw < 900;
  cFoto.style.setProperty('--w', `${lerp(mob ? 64 : 30, 100, e)}vw`);
  cFoto.style.setProperty('--h', `${lerp(mob ? 36 : 44, 100, e)}vh`);
  cFoto.style.setProperty('--r', `${lerp(4, 0, e)}px`);
  cFoto.style.setProperty('--s', lerp(1.3, 1, e));
  const abre = e * vw * .55;
  cEsq.style.transform = `translate3d(${-abre}px,-50%,0)`; cDir.style.transform = `translate3d(${abre}px,-50%,0)`;
  cEsq.style.opacity = cDir.style.opacity = 1 - clamp((e - .6) / .3);
  cFim.classList.toggle('on', p > .82);

  // editorial: fotos e frase em velocidades diferentes
  edFotos.forEach((im, i) => {
    const rr = im.parentElement.getBoundingClientRect();
    if (rr.bottom < 0 || rr.top > vh) return;
    const q = (rr.top + rr.height / 2 - vh / 2) / vh;
    im.style.transform = `translate3d(0,${-8 + q * (i ? -16 : -8)}%,0)`;
  });
  const fr = edFrase.getBoundingClientRect();
  if (fr.bottom > -200 && fr.top < vh + 200) edFrase.style.transform = `translate3d(0,${(fr.top - vh / 2) * -.18}px,0)`;

  requestAnimationFrame(quadro);
}
requestAnimationFrame(quadro);
