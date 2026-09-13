(() => {
  const canvas = document.querySelector('#ambient-field');
  const context = canvas.getContext('2d');
  const toggle = document.querySelector('.motion-toggle');
  if (!context) { canvas.hidden = true; toggle.hidden = true; return; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let motionChoice = new URLSearchParams(location.search).get('motion');
  if (!['on', 'off'].includes(motionChoice)) {
    try { motionChoice = localStorage.getItem('site-motion'); } catch { motionChoice = null; }
  }
  let paused = motionChoice === 'off' || (motionChoice !== 'on' && reduced.matches);
  let width = 0, height = 0, frame = 0, previous = 0, phase = 0;
  function rememberMotion() {
    motionChoice = paused ? 'off' : 'on';
    try { localStorage.setItem('site-motion', motionChoice); } catch { /* Storage is optional. */ }
    // An explicit entry URL must not override a later click after a refresh.
    const url = new URL(location.href);
    if (url.searchParams.has('motion')) {
      url.searchParams.delete('motion');
      try { history.replaceState(null, '', url); } catch { /* Embedded previews may restrict history. */ }
    }
  }
  if (['on', 'off'].includes(motionChoice)) rememberMotion();
  let pointer = {x:0, y:0}, eased = {x:0, y:0};
  let palette = [];
  const galaxy = document.createElement('canvas');
  galaxy.width = galaxy.height = 640;
  const galaxyContext = galaxy.getContext('2d');
  // A decorative Andromeda-inspired spiral, not an astronomical simulation.
  // Cache the stars once per theme; each animation frame only rotates the texture.
  function buildGalaxy(dark) {
    if (!galaxyContext) return;
    const g = galaxyContext, centre = 320;
    g.clearRect(0, 0, 640, 640);
    let seed = 31;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const halo = g.createRadialGradient(centre, centre, 8, centre, centre, 302);
    halo.addColorStop(0, dark ? 'rgba(244,211,162,.55)' : 'rgba(180,133,79,.38)');
    halo.addColorStop(.22, dark ? 'rgba(166,177,201,.22)' : 'rgba(81,139,157,.2)');
    halo.addColorStop(.7, dark ? 'rgba(113,160,203,.1)' : 'rgba(57,117,136,.08)');
    halo.addColorStop(1, 'rgba(90,150,180,0)');
    g.fillStyle = halo; g.fillRect(0, 0, 640, 640);
    for (let i = 0; i < 2600; i++) {
      const r = 292 * Math.pow(random(), .76);
      const arm = i % 2 * Math.PI;
      const angle = arm + r * .026 + (random() - .5) * (i % 5 === 0 ? 6.28 : .85);
      const x = centre + Math.cos(angle) * r, y = centre + Math.sin(angle) * r;
      const alpha = (.2 + random() * .65) * (1 - Math.pow(r / 305, 3));
      const warm = r < 70 || i % 7 === 0;
      g.fillStyle = 'rgba(' + (dark ? (warm ? '250,220,177' : '176,213,239') : (warm ? '151,104,59' : '44,110,133')) + ',' + alpha + ')';
      const size = .55 + random() * 1.8;
      g.fillRect(x, y, size, size);
    }
    // Narrow dust lanes follow the two spiral arms.
    for (let arm = 0; arm < 2; arm++) {
      g.beginPath();
      for (let r = 38; r < 275; r += 2) {
        const a = arm * Math.PI + r * .026 + .24;
        const x = centre + Math.cos(a) * r, y = centre + Math.sin(a) * r;
        if (r === 38) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.strokeStyle = dark ? 'rgba(24,39,51,.28)' : 'rgba(42,79,85,.16)';
      g.lineWidth = 5; g.stroke();
    }
    const core = g.createRadialGradient(centre, centre, 0, centre, centre, 77);
    core.addColorStop(0, dark ? 'rgba(255,244,213,.98)' : 'rgba(198,146,80,.85)');
    core.addColorStop(.2, dark ? 'rgba(254,225,178,.8)' : 'rgba(198,153,98,.5)');
    core.addColorStop(1, 'rgba(210,175,130,0)');
    g.fillStyle = core; g.fillRect(centre - 77, centre - 77, 154, 154);
  }
  function drawGalaxy() {
    if (!galaxyContext) return;
    const small = width < 650;
    const radius = small ? 70 : 115;
    const x = small ? 78 : 132, y = height - (small ? 70 : 92);
    context.save();
    context.translate(x, y);
    context.rotate(-.38);
    // Rotate in the galaxy's plane, then project its inclined disc.
    context.scale(1, .4);
    context.rotate(phase * .12);
    context.drawImage(galaxy, -radius, -radius, radius * 2, radius * 2);
    context.restore();
  }
  // Procedural illustrative planets: cached spherical lighting, cloud bands,
  // atmospheric rims and a layered ring system, with no external image requests.
  function planetSprite(kind) {
    const surface = document.createElement('canvas');
    surface.width = surface.height = 192;
    const sc = surface.getContext('2d');
    if (!sc) return surface;
    const pixels = sc.createImageData(192, 192);
    for (let y = 0; y < 192; y++) for (let x = 0; x < 192; x++) {
      const nx = (x - 95.5) / 94, ny = (y - 95.5) / 94;
      const rr = nx * nx + ny * ny;
      if (rr > 1) continue;
      const nz = Math.sqrt(1 - rr);
      const longitude = Math.atan2(nx, nz), latitude = Math.asin(ny);
      const turbulence = Math.sin(longitude * 11 + Math.sin(latitude * 19) * .8)
        + .4 * Math.sin(longitude * 31 - latitude * 23)
        + .2 * Math.sin(longitude * 61 + latitude * 47);
      const band = Math.sin(latitude * (kind === 0 ? 37 : 18) + turbulence * .45);
      const clouds = Math.pow(Math.max(0, Math.sin(latitude * 25 + turbulence * 1.7)), 9);
      const base = kind === 0 ? [192, 151, 100] : kind === 1 ? [48, 127, 170] : [95, 164, 170];
      const light = .16 + .84 * Math.max(0, nx * -.57 + ny * -.46 + nz * .68);
      const rim = Math.pow(1 - nz, 5) * Math.max(0, -.5 * nx - .4 * ny + .55);
      const at = (y * 192 + x) * 4;
      for (let c = 0; c < 3; c++) pixels.data[at + c] = Math.min(255,
        (base[c] + band * (kind === 0 ? 19 : 12) + clouds * (kind === 0 ? 24 : 64)) * light
        + rim * (c === 0 ? 38 : 85));
      pixels.data[at + 3] = Math.min(255, (1 - Math.sqrt(rr)) * 94 * 255);
    }
    sc.putImageData(pixels, 0, 0);
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 400;
    const g = sprite.getContext('2d');
    if (!g) return surface;
    g.translate(200, 200); g.rotate(kind === 0 ? -.38 : .22);
    const glow = g.createRadialGradient(0, 0, 85, 0, 0, 110);
    glow.addColorStop(0, kind === 0 ? 'rgba(224,190,128,.2)' : 'rgba(118,203,236,.3)');
    glow.addColorStop(1, 'rgba(100,190,220,0)');
    g.fillStyle = glow; g.fillRect(-115, -115, 230, 230);
    function rings(front) {
      for (let ring = 0; ring < 18; ring++) {
        if (ring === 11 || ring === 12) continue;
        const r = 125 + ring * 3.2;
        g.beginPath(); g.ellipse(0, 0, r, r * .32, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2);
        g.strokeStyle = 'rgba(' + (ring % 3 === 0 ? '131,111,82' : '207,182,137') + ',' + (front ? .82 : .5) + ')';
        g.lineWidth = 2.6; g.stroke();
      }
    }
    if (kind === 0) rings(false);
    g.drawImage(surface, -96, -96);
    if (kind === 0) rings(true);
    return sprite;
  }
  const planets = [planetSprite(0), planetSprite(1), planetSprite(2)];
  function drawPlanets() {
    const mobile = width < 650;
    // Keep these small, in the outer margins, where the artwork stays visible.
    const bodies = [
      {x: width - (mobile ? 48 : 87), y: mobile ? height - 145 : height * .73, size: mobile ? 70 : 116, speed: .12},
      {x: width - (mobile ? 25 : 48), y: height * .23, size: mobile ? 50 : 78, speed: .1},
      {x: mobile ? 26 : 54, y: height * .4, size: mobile ? 40 : 60, speed: .08}
    ];
    bodies.forEach((body, i) => {
      if (mobile && i === 2) return;
      const x = body.x + Math.sin(phase * body.speed + i) * (mobile ? 7 : 18);
      const y = body.y + Math.sin(phase * body.speed * .8 + i * 2) * (mobile ? 12 : 20);
      context.save();
      context.globalAlpha = document.body.classList.contains('theme-dark') ? .84 : .65;
      context.drawImage(planets[i], x - body.size / 2, y - body.size / 2, body.size, body.size);
      context.restore();
    });
  }
  const particles = Array.from({length:52}, (_, i) => ({
    x: ((i * 73 + 17) % 101) / 101,
    y: ((i * 47 + 9) % 97) / 97,
    size: [2,3,4,6][i % 4],
    speed: .15 + (i % 7) * .06,
    offset: i * 2.399,
  }));
  function readTheme() {
    const dark = document.body.classList.contains('theme-dark');
    palette = dark ? ['167,203,188','132,187,211','204,159,127'] : ['40,103,94','87,151,178','170,124,89'];
    buildGalaxy(dark);
  }
  function resize() {
    width = innerWidth; height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio,0,0,ratio,0,0);
    draw();
  }
  function draw() {
    context.clearRect(0,0,width,height);
    // Keep marks near the edges subtle enough to preserve reading contrast.
    const cx=width*.80+eased.x*12, cy=height*.43+eased.y*10;
    const radius=Math.min(width*.32,440);
    context.lineWidth=1;
    for(let ring=0;ring<3;ring++){
      context.strokeStyle='rgba('+palette[ring%2]+','+(ring===0?.16:.10)+')';
      context.beginPath();
      context.ellipse(cx,cy,radius+ring*42,(radius+ring*42)*.62, -.52+phase*.018,0,Math.PI*2);
      context.stroke();
      for(let j=0;j<5;j++){
        const angle=phase*(.08+ring*.018)+j*Math.PI*2/5+ring;
        const x=(radius+ring*42)*Math.cos(angle), y=(radius+ring*42)*.62*Math.sin(angle);
        const rotation=-.52+phase*.018;
        const px=cx+x*Math.cos(rotation)-y*Math.sin(rotation);
        const py=cy+x*Math.sin(rotation)+y*Math.cos(rotation);
        context.fillStyle='rgba('+palette[(ring+j)%3]+',.32)';
        context.beginPath(); context.arc(px,py,ring===0?2:1.3,0,Math.PI*2); context.fill();
      }
    }
    const limit = width<650 ? 24 : particles.length;
    for(let i=0;i<limit;i++){
      const p=particles[i];
      const x=p.x*width+Math.sin(phase*p.speed*.16+p.offset)*18+eased.x*5;
      const y=(p.y*height-phase*p.speed*3+height*10)%height;
      const edge=Math.abs(x/width-.5)*2;
      const alpha=.09+edge*.16;
      context.fillStyle='rgba('+palette[i%3]+','+alpha+')';
      context.fillRect(Math.round(x/2)*2,Math.round(y/2)*2,p.size,p.size);
    }
    // A slow, sampled wave suggests a spatial scan rather than a screen overlay.
    for(let i=0;i<32;i++){
      const x=width*.04+i*width*.03;
      const y=height*.87+Math.sin(i*.22+phase*.16)*18+Math.cos(i*.1+phase*.08)*10;
      context.fillStyle='rgba('+palette[0]+',.13)';
      context.fillRect(Math.round(x),Math.round(y),2,2);
    }
    drawGalaxy();
    drawPlanets();
  }
  function tick(now) {
    frame=0;
    if(paused || document.hidden) return;
    if(now-previous>=1000/30){
      phase+=Math.min((now-previous)/1000,.05);
      previous=now;
      eased.x+=(pointer.x-eased.x)*.025; eased.y+=(pointer.y-eased.y)*.025;
      draw();
    }
    frame=requestAnimationFrame(tick);
  }
  function sync(){
    cancelAnimationFrame(frame); frame=0; previous=performance.now();
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Play background animation' : 'Pause background animation');
    toggle.querySelector('.motion-label').textContent=paused?'Motion off · Play':'Motion on · Pause';
    toggle.querySelector('.motion-icon').textContent=paused?'▷':'Ⅱ';
    canvas.dataset.motion=paused?'paused':document.hidden?'suspended':'running';
    if(!paused&&!document.hidden) frame=requestAnimationFrame(tick);
    else draw();
  }
  toggle.addEventListener('click',()=>{paused=!paused;rememberMotion();sync()});
  reduced.addEventListener('change',()=>{if (!['on','off'].includes(motionChoice)) paused=reduced.matches;pointer={x:0,y:0};eased={x:0,y:0};sync()});
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('resize',resize,{passive:true});
  window.addEventListener('pointermove',event=>{
    if(paused || event.pointerType==='touch')return;
    pointer={x:event.clientX/width-.5,y:event.clientY/height-.5};
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{pointer={x:0,y:0}},{passive:true});
  new MutationObserver(()=>{readTheme();draw()}).observe(document.body,{attributes:true,attributeFilter:['class']});
  readTheme(); resize(); sync();
})();
