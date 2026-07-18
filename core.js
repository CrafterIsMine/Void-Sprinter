const canvas = document.getElementById('g')
const ctx = canvas.getContext('2d')
let pts = 0
let hi = localStorage.getItem('dv_hi') || 0
let dead = false
let running = false
let keys = {}
let mult = 1
window.addEventListener('keydown', e=>{
keys[e.key] = true
if(e.key === ' ')
e.preventDefault()
})
window.addEventListener('keyup', e => keys[e.key] = false)
window.addEventListener('resize', ()=>{
resize()
if(!running){
p.x = canvas.width / 2
p.y = canvas.height / 2
 }
}) 
function boot(){
initAudio()
resize()
pts = 0
dead = false
running = true
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
shake = 0
document.getElementById('s').innerText = 0
document.getElementById('m').innerText = 'x1'
document.getElementById('dashbar').style.width = '100%'
document.getElementById('menu').classList.add('hidden')
document.getElementById('gameover').classList.add('hidden')

for(let i = 0; i < 3; i++)
spawnOrb()
}
function loop(){
ctx.fillStyle = 'rgba(8, 8, 12, 0.35)'
ctx.fillRect(0, 0, canvas.width, canvas.height)
if(running){
updateFx()
updateEntities()
}
renderFx()
if(running)
renderEntities()
requestAnimationFrame(loop)
}
resize()
boot()
loop()