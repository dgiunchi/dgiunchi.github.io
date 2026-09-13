(() => {
  const canvas = document.querySelector('#ambient-field');
  const context = canvas.getContext('2d');
  const toggle = document.querySelector('.motion-toggle');
  if (!context) { canvas.hidden = true; toggle.hidden = true; return; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, width = 0, height = 0, frame = 0, previous = 0, phase = 0;
  let pointer = {x:0, y:0}, eased = {x:0, y:0};
  let palette = [];
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
        context.fillRect(Math.round(px/2)*2,Math.round(py/2)*2,ring===0?5:3,ring===0?5:3);
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
    toggle.querySelector('.motion-label').textContent=paused?'Play motion':'Pause motion';
    toggle.querySelector('.motion-icon').textContent=paused?'▷':'Ⅱ';
    canvas.dataset.motion=paused?'paused':document.hidden?'suspended':'running';
    if(!paused&&!document.hidden) frame=requestAnimationFrame(tick);
    else draw();
  }
  toggle.addEventListener('click',()=>{paused=!paused;sync()});
  reduced.addEventListener('change',()=>{paused=reduced.matches;pointer={x:0,y:0};eased={x:0,y:0};sync()});
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
