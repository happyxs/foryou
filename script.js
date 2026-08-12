(function(){
  // ---------- starfield ----------
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let w, h;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(140, Math.floor((w*h)/9000));
    stars = Array.from({length: count}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.4 + 0.3,
      baseAlpha: Math.random()*0.6 + 0.2,
      speed: Math.random()*0.02 + 0.005,
      phase: Math.random()*Math.PI*2
    }));
  }
  window.addEventListener('resize', resize);
  resize();

  let t = 0;
  function drawStars(){
    ctx.clearRect(0,0,w,h);
    t += 1;
    for(const s of stars){
      const twinkle = Math.sin(t*s.speed + s.phase)*0.5 + 0.5;
      ctx.beginPath();
      ctx.globalAlpha = s.baseAlpha * (0.5 + twinkle*0.5);
      ctx.fillStyle = '#e6d3ff';
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawStars);
  }
  drawStars();

  // ---------- open interaction ----------
  const treasure = document.getElementById('treasure');
  const message = document.getElementById('message');
  let opened = false;

  function spawnBurst(){
    const rect = treasure.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const colors = ['#e9b8ff','#c084fc','#9b5de5','#ffffff'];
    for(let i=0;i<28;i++){
      const p = document.createElement('div');
      p.className = 'burst-particle';
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.background = colors[Math.floor(Math.random()*colors.length)];
      document.body.appendChild(p);

      const angle = Math.random()*Math.PI*2;
      const dist = 60 + Math.random()*160;
      const dx = Math.cos(angle)*dist;
      const dy = Math.sin(angle)*dist;
      const dur = 900 + Math.random()*700;

      p.animate([
        { transform:'translate(-50%,-50%) scale(0.4)', opacity:0 },
        { transform:`translate(calc(-50% + ${dx*0.3}px), calc(-50% + ${dy*0.3}px)) scale(1)`, opacity:1, offset:0.25 },
        { transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`, opacity:0 }
      ], { duration: dur, easing:'cubic-bezier(.2,.7,.3,1)' });

      setTimeout(()=> p.remove(), dur + 50);
    }
  }

  function spawnFloatingHearts(){
    const shapes = ['💜','✨'];
    for(let i=0;i<9;i++){
      setTimeout(()=>{
        const el = document.createElement('div');
        el.className = 'float-heart';
        el.textContent = shapes[Math.floor(Math.random()*shapes.length)];
        el.style.left = (Math.random()*90 + 5) + 'vw';
        el.style.fontSize = (14 + Math.random()*16) + 'px';
        document.body.appendChild(el);

        const dur = 4500 + Math.random()*2500;
        const drift = (Math.random()*80 - 40);
        el.animate([
          { transform:'translate(0,0)', opacity:0 },
          { transform:`translate(${drift*0.3}px, -40vh)`, opacity:0.9, offset:0.15 },
          { transform:`translate(${drift}px, -110vh)`, opacity:0 }
        ], { duration: dur, easing:'ease-out' });

        setTimeout(()=> el.remove(), dur + 50);
      }, i*260);
    }
  }

  function openTreasure(){
    if(opened) return;
    opened = true;
    treasure.classList.add('opened');
    spawnBurst();
    setTimeout(()=>{
      message.classList.add('show');
      spawnFloatingHearts();
    }, 260);
  }

  treasure.addEventListener('click', openTreasure);
  treasure.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      openTreasure();
    }
  });
})();
