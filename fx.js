let shake = 0
let parts = []
let trails = []
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