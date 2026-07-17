let p={
x: 0,
y: 0,
vx: 0,
vy: 0,
r: 7,
dashTime: 0,
invuln: 0 
}
let orbs = []
let foes = []
let dashCd = 0
let gracePeriod = 120
let spawnCounter = 0
function spawnOrb(){
let margin = 100
orbs.push({
x: margin + Math.random() * (canvas.width - margin * 2),
y: margin + Math.random() * (canvas.height - margin * 2),
r: 6,
pulse: Math.random() * Math.PI * 2,
val: 10
 })
}
function spawnFoe(){
let edge = Math.floor(Math.random() * 4)
let fx, fy
let margin = 50
if(edge === 0){
fx = margin + Math.random() * (canvas.width - margin * 2); fy = -margin 
}
else if(edge === 1){
fx = canvas.width + margin; fy = margin + Math.random() * (canvas.height - margin * 2) 
    }
else if(edge === 2){
fx = margin + Math.random() * (canvas.width - margin * 2); fy = canvas.height + margin 
}
else{
fx = -margin; fy = margin + Math.random() * (canvas.height - margin * 2) 
}

let f={
x: fx,
y: fy,
vx: 0,
vy: 0,
r: 10,
type: 'chaser',
hp: 1
}

if(Math.random() > 0.6){
f.type = 'drifter'
f.vx = (Math.random() - 0.5) * 4
f.vy = (Math.random() - 0.5) * 4
f.r = 8
}

foes.push(f)
}

function updateEntities(){
if(dead)
return
if(gracePeriod > 0){
gracePeriod--
}
spawnCounter++
let spawnDelay = Math.max(40, 120 - Math.floor(pts / 40))
if(spawnCounter >= spawnDelay){
spawnCounter = 0
spawnFoe()
}

let ax = 0
let ay = 0
if(keys['ArrowUp'] || keys['w'] || keys['W'])
ay -= 1
if(keys['ArrowDown'] || keys['s'] || keys['S'])
ay += 1
if(keys['ArrowLeft'] || keys['a'] || keys['A'])
ax -= 1
if(keys['ArrowRight'] || keys['d'] || keys['D'])
ax += 1

if(ax !== 0 && ay !== 0){
ax *= 0.707
ay *= 0.707
}

let accel = p.dashTime > 0 ? 0.8 : 0.35
p.vx += ax * accel
p.vy += ay * accel
let fric = p.dashTime > 0 ? 0.98 : 0.93
p.vx *= fric
p.vy *= fric
let maxSpd = p.dashTime > 0 ? 12 : 6
let spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
if(spd > maxSpd){
p.vx = (p.vx / spd) * maxSpd
p.vy = (p.vy / spd) * maxSpd
}

p.x += p.vx
p.y += p.vy

if(p.x < p.r)
p.x = p.r
if(p.x > canvas.width - p.r)
p.x = canvas.width - p.r
if(p.y < p.r)
p.y = p.r
if(p.y > canvas.height - p.r)
p.y = canvas.height - p.r

if(p.dashTime > 0){
p.dashTime--
trails.push({ x: p.x, y: p.y, r: p.r + 4, col: '#ffff00', life: 1.0 })
if(p.dashTime % 2 === 0)
burst(p.x, p.y, '#ffff00', 2, 2)
}

if(p.invuln > 0)
p.invuln--
if(dashCd > 0)
dashCd--
let barEl = document.getElementById('dashbar')
if(barEl){
let pct = Math.max(0, 1 - (dashCd / 90)) * 100
barEl.style.width = pct + '%'
}

if((keys[' '] || keys['Spacebar']) && dashCd <= 0 && spd > 1){
p.dashTime = 18
dashCd = 90
p.invuln = 20
burst(p.x, p.y, '#ffff00', 20, 5)
shake = 6
sfxDash()
}
for(let i = orbs.length - 1; i >= 0; i--){
let o = orbs[i]
o.pulse += 0.08
let dx = p.x - o.x
let dy = p.y - o.y
let dist = Math.sqrt(dx * dx + dy * dy)
if(dist < 80){
o.x += (p.x - o.x) * 0.08
o.y += (p.y - o.y) * 0.08
}
if(dist < p.r + o.r){
orbs.splice(i, 1)
let gain = o.val * mult
pts += gain
mult = Math.min(mult + 1, 10)
document.getElementById('s').innerText = Math.floor(pts)
document.getElementById('m').innerText = 'x' + mult
if(pts > hi){
hi = pts
localStorage.setItem('dv_hi', Math.floor(hi))
document.getElementById('h').innerText = Math.floor(hi)
}
burst(o.x, o.y, '#ff00aa', 12, 4)
shake = 4
sfxCollect()
spawnOrb()
 }
}
for(let i = foes.length - 1; i >= 0; i--){
let f = foes[i]
if(f.type === 'chaser'){
let dx = p.x - f.x
let dy = p.y - f.y
let dist = Math.sqrt(dx * dx + dy * dy)
if(dist > 0){
f.vx += (dx / dist) * 0.08
f.vy += (dy / dist) * 0.08
}
let fspd = Math.sqrt(f.vx * f.vx + f.vy * f.vy)
if(fspd > 3.2){
f.vx = (f.vx / fspd) * 3.2
f.vy = (f.vy / fspd) * 3.2
 }
}
f.x += f.vx
f.y += f.vy
if(f.x < -50 || f.x > canvas.width + 50)
f.vx *= -1
if(f.y < -50 || f.y > canvas.height + 50)
f.vy *= -1
let dx = p.x - f.x
let dy = p.y - f.y
let dist = Math.sqrt(dx * dx + dy * dy)
if(dist < p.r + f.r && p.invuln <= 0 && gracePeriod <= 0){
dead = true
shake = 25
burst(p.x, p.y, '#00e5ff', 50, 8)
burst(p.x, p.y, '#ff3355', 30, 6)
sfxDie()
showGameOver()
 }
}
if(mult > 1){
mult -= 0.01
if(mult < 1)
mult = 1
document.getElementById('m').innerText = 'x' + Math.floor(mult)
 }
}
function renderEntities(){
ctx.save()
if(shake > 0){
ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake)
}
ctx.fillStyle = '#ff00aa'
for(let o of orbs){
let r = o.r + Math.sin(o.pulse) * 2
ctx.beginPath()
ctx.arc(o.x, o.y, r, 0, Math.PI * 2)
ctx.fill()
}
for(let f of foes){
let col = f.type === 'chaser' ? '#ff3355' : '#ffaa00'
ctx.fillStyle = col
ctx.beginPath()
ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
ctx.fill()
}
let pcol = p.dashTime > 0 ? '#ffff00' : '#00e5ff'
ctx.fillStyle = pcol
if(p.invuln > 0 && p.invuln % 4 < 2){
ctx.globalAlpha = 0.4
}
ctx.beginPath()
ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
ctx.fill()
ctx.globalAlpha = 1
ctx.restore()
}
