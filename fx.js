let shake = 0
let parts = []
let trails = []
let gridOff = 0
let actx = null
function initAudio(){
if(!actx){
actx = new (window.AudioContext || window.webkitAudioContext)()
}
if(actx.state==='suspended'){
actx.resume()
 }
}

function playTone(freq, type, dur, vol){
if(!actx)
return
let osc = actx.createOscillator()
let gain = actx.createGain()
osc.type = type
osc.frequency.setValueAtTime(freq, actx.currentTime)
gain.gain.setValueAtTime(vol, actx.currentTime)
gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur)
osc.connect(gain)
gain.connect(actx.destination)
osc.start()
osc.stop(actx.currentTime + dur)
}

function playNoise(dur, vol){
if(!actx)
return
let bufferSize = actx.sampleRate * dur
let buffer = actx.createBuffer(1, bufferSize, actx.sampleRate)
let data = buffer.getChannelData(0)
for(let i = 0; i < bufferSize; i++){
data[i] = Math.random() * 2 - 1
}
let noise = actx.createBufferSource()
noise.buffer = buffer
let gain = actx.createGain()
gain.gain.setValueAtTime(vol, actx.currentTime)
gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur)
noise.connect(gain)
gain.connect(actx.destination)
noise.start()
}

function sfxCollect(){
let pitch = 300 + (mult * 40)
playTone(pitch, 'sine', 0.12, 0.15)
playTone(pitch * 1.5, 'triangle', 0.08, 0.08)
}

function sfxDash(){
playNoise(0.15, 0.12)
playTone(120, 'sawtooth', 0.2, 0.1)
}

function sfxKill(){
playTone(80, 'square', 0.25, 0.15)
playNoise(0.15, 0.2)
}

function sfxDie(){
playTone(60, 'sawtooth', 0.6, 0.25)
playNoise(0.5, 0.3)
}

function resize(){
canvas.width = window.innerWidth
canvas.height = window.innerHeight
}

function burst(x, y, col, n, spd){
for(let i = 0; i < n; i++){
let angle = Math.random() * Math.PI * 2
let vel = Math.random() * spd
parts.push({
x: x,
y: y,
vx: Math.cos(angle) * vel,
vy: Math.sin(angle) * vel,
life: 1.0,
decay: 0.015 + Math.random() * 0.03,
col: col,
size: 1 + Math.random() * 2.5
  })
 }
}

function drawHexGrid(){
ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)'
ctx.lineWidth = 1
let size = 35
let w = Math.sqrt(3) * size
let h = 2 * size
let rows = Math.ceil(canvas.height / (h * 0.75)) + 2
let cols = Math.ceil(canvas.width / w) + 2
let offX = (gridOff * w * 0.5) % w
let offY = (gridOff * h * 0.375) % (h * 0.75)

for(let r = -1; r < rows; r++){
for(let c = -1; c < cols; c++){
let x = c * w + offX + (r % 2 !== 0 ? w / 2 : 0)
let y = r * h * 0.75 + offY
ctx.beginPath()
for(let i = 0; i < 6; i++){
let angle = (Math.PI / 3) * i - Math.PI / 6
let hx = x + size * Math.cos(angle)
let hy = y + size * Math.sin(angle)
if(i === 0)
ctx.moveTo(hx, hy)
else
ctx.lineTo(hx, hy)
}
ctx.closePath()
ctx.stroke()
 }
  }
}

function updateFx(){
if(shake > 0){
shake *= 0.88
if(shake < 0.4)
shake = 0
}
gridOff += 0.15

for(let i = parts.length - 1; i >= 0; i--){
let pt = parts[i]
pt.x += pt.vx
pt.y += pt.vy
pt.vx *= 0.96
pt.vy *= 0.96
pt.life -= pt.decay
if(pt.life <= 0){
parts.splice(i, 1)
 }
}

for(let i = trails.length - 1; i >= 0; i--){
trails[i].life -= 0.04
if(trails[i].life <= 0){
trails.splice(i, 1)
 }
  } 
}

function renderFx(){
ctx.save()
if(shake > 0){
ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake)
}

drawHexGrid()

for(let t of trails){
ctx.globalAlpha = t.life * 0.6
ctx.fillStyle = t.col
ctx.beginPath()
ctx.arc(t.x, t.y, t.r * t.life, 0, Math.PI * 2)
ctx.fill()
}
for(let pt of parts){
ctx.globalAlpha = pt.life
ctx.fillStyle = pt.col
ctx.beginPath()
ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2)
ctx.fill()
}
ctx.globalAlpha = 1
ctx.restore()
}
