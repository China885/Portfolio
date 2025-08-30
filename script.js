// ===== Smooth scroll for internal links =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if(href.length > 1){
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({behavior:'smooth'});
    }
  });
});

// ===== Year in footer =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== High-tech particle grid background =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d', { alpha: true });
let w, h, dpr, points;

function resize(){
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = canvas.width = Math.floor(innerWidth * dpr);
  h = canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  initPoints();
}
window.addEventListener('resize', resize);

function initPoints(){
  const spacing = 80 * dpr;
  const cols = Math.ceil(w / spacing) + 1;
  const rows = Math.ceil(h / spacing) + 1;
  points = [];
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const px = x * spacing + (Math.random()*10-5)*dpr;
      const py = y * spacing + (Math.random()*10-5)*dpr;
      points.push({
        x:px, y:py,
        ox:px, oy:py,
        vx:(Math.random()-.5)*.05*dpr,
        vy:(Math.random()-.5)*.05*dpr
      });
    }
  }
}

function tick(){
  ctx.clearRect(0,0,w,h);
  // subtle vignette
  const grd = ctx.createRadialGradient(w*0.8, h*0.1, 0, w*0.8, h*0.1, Math.max(w,h)*0.9);
  grd.addColorStop(0,'rgba(138,92,255,0.12)');
  grd.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0,0,w,h);

  // animate points
  for(const p of points){
    p.x += p.vx;
    p.y += p.vy;
    if(Math.abs(p.x - p.ox) > 12*dpr) p.vx *= -1;
    if(Math.abs(p.y - p.oy) > 12*dpr) p.vy *= -1;
  }

  // draw links
  ctx.lineWidth = 1 * dpr;
  for(let i=0;i<points.length;i++){
    for(let j=i+1;j<i+6 && j<points.length;j++){
      const a = points[i], b = points[j];
      const dx = a.x-b.x, dy = a.y-b.y;
      const dist = Math.hypot(dx,dy);
      if(dist < 140*dpr){
        const alpha = 1 - dist/(140*dpr);
        ctx.strokeStyle = `rgba(183,132,255,${alpha*0.25})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  // draw points
  for(const p of points){
    ctx.fillStyle = 'rgba(138,92,255,0.8)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.4*dpr, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  requestAnimationFrame(tick);
}

resize();
tick();
