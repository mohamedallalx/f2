const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20;
const cols = canvas.width / grid;
const rows = canvas.height / grid;

let snake;
let dir;
let food;
let scoreEl = document.getElementById('score');
let running = false;
let speed = 100;
let timer = null;

function reset(){
  snake = [ {x: Math.floor(cols/2), y: Math.floor(rows/2)} ];
  dir = {x: 0, y: -1};
  placeFood();
  setScore(0);
  running = true;
  speed = 100;
  startLoop();
}

function setScore(s){
  scoreEl.textContent = 'النتيجة: ' + s;
  scoreEl.dataset.value = s;
}

function placeFood(){
  while(true){
    const f = {
      x: Math.floor(Math.random()*cols),
      y: Math.floor(Math.random()*rows)
    };
    if(!snake.some(p => p.x===f.x && p.y===f.y)){
      food = f;
      break;
    }
  }
}

function drawCell(x,y,color,stroke=false){
  ctx.fillStyle = color;
  ctx.fillRect(x*grid+1, y*grid+1, grid-2, grid-2);
  if(stroke){
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.strokeRect(x*grid+1, y*grid+1, grid-2, grid-2);
  }
}

function update(){
  if(!running) return;

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if(head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows){
    return gameOver();
  }
  if(snake.some(p => p.x===head.x && p.y===head.y)){
    return gameOver();
  }

  snake.unshift(head);

  if(head.x===food.x && head.y===food.y){
    setScore(parseInt(scoreEl.dataset.value||0) + 10);
    placeFood();
    if(speed>40) speed -= 3;
  } else {
    snake.pop();
  }

  render();
  startLoop();
}

function render(){
  ctx.fillStyle = '#021024';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.beginPath();
  for(let x=0;x<cols;x++){
    ctx.moveTo(x*grid,0);
    ctx.lineTo(x*grid,canvas.height);
  }
  for(let y=0;y<rows;y++){
    ctx.moveTo(0,y*grid);
    ctx.lineTo(canvas.width,y*grid);
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.02)';
  ctx.stroke();

  drawCell(food.x, food.y, '#ef4444');

  for(let i=0;i<snake.length;i++){
    const p = snake[i];
    const color = i===0 ? '#10b981' : '#0ea5a4';
    drawCell(p.x,p.y,color,true);
  }
}

function gameOver(){
  running = false;
  clearTimeout(timer);

  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, canvas.height/2 - 40, canvas.width, 90);

  ctx.fillStyle = '#fff';
  ctx.font = '22px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('انتهت اللعبة — اضغط ابدأ لإعادة اللعب', canvas.width/2, canvas.height/2 + 6);
}

function startLoop(){
  clearTimeout(timer);
  timer = setTimeout(update, speed);
}

window.addEventListener('keydown', e => {
  const k = e.key;
  if(k === 'ArrowUp' && dir.y!==1){ dir = {x:0,y:-1}; }
  else if(k === 'ArrowDown' && dir.y!==-1){ dir = {x:0,y:1}; }
  else if(k === 'ArrowLeft' && dir.x!==1){ dir = {x:-1,y:0}; }
  else if(k === 'ArrowRight' && dir.x!==-1){ dir = {x:1,y:0}; }
  else if(k === ' '){ reset(); }
});

document.getElementById('btnRestart').addEventListener('click', ()=> reset());

reset();
