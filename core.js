const canvas = document.getElementById('g')
const ctx = canvas.getContext('2d')
let pts = 0
let hi = localStorage.getItem('dv_hi') || 0
let dead = false
let running = false
let paused = false
let keys = {}
let mult = 1
let dust = []
document.getElementById('h').innerText = Math.floor(hi)
window.addEventListener('keydown', e=>{
keys[e.key] = true
if(e.key === ' ')
e.preventDefault()
if((e.key === 'p' || e.key === 'Escape') && running && !dead){
paused = !paused
if(paused){
document.getElementById('menu').classList.remove('hidden')
document.querySelector('.core').innerText = 'PAUSED'
}
else{
document.getElementById('menu').classList.add('hidden')
document.querySelector('.core').innerText = 'DRIFT VOID'
 }
}
if((e.key === 'r' || e.key === 'R') && dead)
boot()
})
window.addEventListener('keyup', e => keys[e.key] = false)
window.addEventListener('resize', () => {
resize()
if(!running){
p.x = canvas.width / 2
p.y = canvas.height / 2
 }
})
function showGameOver(){
document.getElementById('fs').innerText = Math.floor(pts)
document.getElementById('fh').innerText = Math.floor(hi)
document.getElementById('menu').classList.add('hidden')
document.getElementById('gameover').classList.remove('hidden')
}

function spawnDust(){
dust.push({
x: Math.random() * canvas.width,
y: Math.random() * canvas.height,
vx: (Math.random() - 0.5) * 0.5,
vy: (Math.random() - 0.5) * 0.5,
life: 1.0,
decay: 0.002 + Math.random() * 0.003
 })
}

function boot(){
initAudio()
resize()
pts = 0
dead = false
running = true
paused = false
mult = 1
gracePeriod = 120
spawnCounter = 0
p.x = canvas.width / 2
p.y = canvas.height / 2
p.vx = 0
p.vy = 0
p.dashTime = 0
p.invuln = 0
dashCd = 0
orbs = []
foes = []
parts = []
trails = []
dust = []
shake = 0
document.getElementById('s').innerText = 0
document.getElementById('m').innerText = 'x1'
document.getElementById('dashbar').style.width = '100%'
document.getElementById('menu').classList.add('hidden')
document.getElementById('gameover').classList.add('hidden')
document.querySelector('.core').innerText = 'Void Sprinter'

for(let i = 0; i < 3; i++)
spawnOrb()
}
function loop(){
ctx.fillStyle = 'rgba(8, 8, 12, 0.35)'
ctx.fillRect(0, 0, canvas.width, canvas.height)
if(dust.length < 60)
spawnDust()
for(let i = dust.length - 1; i >= 0; i--){
let d = dust[i]
d.x += d.vx
d.y += d.vy
d.life -= d.decay
if(d.life <= 0)
dust.splice(i, 1)
}
if(running && !paused){
updateFx()
updateEntities()
}
renderFx()
if(running)
renderEntities()
ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
for(let d of dust){
ctx.globalAlpha = d.life * 0.4
ctx.fillRect(d.x, d.y, 1.5, 1.5)
 }
ctx.globalAlpha = 1
requestAnimationFrame(loop)
}
resize()
boot()
loop()
