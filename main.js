import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort, getGenerator} from './sortFunctions.js';
// ---------- 유틸 ----------
const $ = (id) => document.getElementById(id);
const canvas = $('canvas');
const sizeInput = $('size');
const speedInput = $('speed');
const algoSelect = $('algorithm');
const playBtn = $('playBtn');
const pauseBtn = $('pauseBtn');
const stepBtn = $('stepBtn');
const shuffleBtn = $('shuffleBtn');
const sortedBtn = $('sortedBtn');
const stepCountLabel = $('stepCount');

let array = [];
let gen = null;
let running = false;
let timer = null;
let stepCount = 0;

function randArray(n){
	return Array.from({length:n},()=>Math.floor(Math.random()*400)+10);
}

function render(){
	canvas.innerHTML = '';
	if(array.length===0) return;
	const max = Math.max(...array);
	const barWidth = Math.max(3, Math.floor((canvas.clientWidth - array.length*2) / array.length));
	for(let i=0;i<array.length;i++){
		const h = Math.max(4, Math.round((array[i]/max) * 100));
		const bar = document.createElement('div');
		bar.className = 'bar';
		bar.style.width = barWidth+'px';
		bar.style.height = h + '%';
		bar.dataset.idx = i;
		bar.title = String(array[i]);
		bar.style.background = 'linear-gradient(180deg,#e2e8f0,#94a3b8)';
		canvas.appendChild(bar);
	}
}

function colorBars(indices, color){
	indices = Array.isArray(indices)?indices:[indices];
	indices.forEach(i=>{
		const b = canvas.querySelector(`.bar[data-idx='${i}']`);
		if(b) b.style.background = color;
	});
}

// ---------- 오퍼레이션 적용 ----------
function applyOp(op){
	stepCount++;
	stepCountLabel.textContent = stepCount;
	if(!op) return;
	clearBarColors();
	switch(op.type){
		case 'compare':
			colorBars([op.i,op.j], getComputedStyle(document.documentElement).getPropertyValue('--step') || 'orange');
			break;
		case 'swap':
			if(op.arr) array = op.arr.slice();
			render();
			colorBars([op.i,op.j], getComputedStyle(document.documentElement).getPropertyValue('--swap') || 'red');
			break;
		case 'overwrite':
			if(op.arr) array = op.arr.slice();
			render();
			colorBars(op.i, getComputedStyle(document.documentElement).getPropertyValue('--overwrite') || 'skyblue');
			break;
		case 'mark':
			colorBars(op.i, getComputedStyle(document.documentElement).getPropertyValue('--done') || 'green');
			break;
		case 'done':
			array = op.arr ? op.arr.slice() : array.slice();
			render();
			// color all bars as done
			Array.from(canvas.children).forEach(b => b.style.background = getComputedStyle(document.documentElement).getPropertyValue('--done') || '#34d399');
			running = false; stopLoop();
			break;
	}
}

function clearBarColors(){
	Array.from(canvas.children).forEach(b=> b.style.background = 'linear-gradient(180deg,#e2e8f0,#94a3b8)');
}

// ---------- 실행 루프 관리 ----------
function startLoop(){
	if(running) return;
	running = true;
	const delay = Math.max(10, 2000 - Number(speedInput.value)*10);
	function loop(){
		if(!gen) gen = getGenerator(algoSelect.value, array);
		const next = gen.next();
		if(next.done){ running=false; stopLoop(); return; }
		applyOp(next.value);
		timer = setTimeout(loop, delay);
	}
	loop();
}

function stopLoop(){ clearTimeout(timer); timer=null; running=false; }

function stepOnce(){
	if(!gen) gen = getGenerator(algoSelect.value, array);
	const next = gen.next();
	if(next.done) { running=false; return; }
	applyOp(next.value);
}

// ---------- 이벤트 바인딩 ----------
playBtn.addEventListener('click', ()=>{ startLoop(); });
pauseBtn.addEventListener('click', ()=>{ stopLoop(); });
stepBtn.addEventListener('click', ()=>{ stopLoop(); stepOnce(); });
shuffleBtn.addEventListener('click', ()=>{ stopLoop(); initArray(); });
sortedBtn.addEventListener('click', ()=>{
	stopLoop();
	array = Array.from({length:Number(sizeInput.value)},(_,i)=>i+1);
	render();
	gen=null;
	stepCount=0;
	stepCountLabel.textContent=0;
});

algoSelect.addEventListener('change', ()=>{
	stopLoop();
	gen=null;
	stepCount=0;
	stepCountLabel.textContent=0;
	render();
});
sizeInput.addEventListener('input', ()=>{ stopLoop(); initArray(); });

// initialize
function initArray(){
	array = randArray(Number(sizeInput.value));
	gen = null;
	stepCount=0;
	stepCountLabel.textContent=0;
	render();
}

// resize handling
window.addEventListener('resize', ()=> render());

// kick off
initArray();
