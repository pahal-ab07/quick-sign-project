const colorPicker = document.getElementById("colorPicker");
const canvasColor = document.getElementById("canvasColor");
const fontPicker = document.getElementById("fontPicker");
const canvas = document.getElementById("myCanvas");
const clearButton = document.getElementById("clearButton");
const saveButton = document.getElementById("saveButton");
const retrieveButton = document.getElementById("retrieveButton");
const undoButton = document.getElementById("undoButton");
const redoButton = document.getElementById("redoButton");
const resetIcon = document.getElementById("reset-icon");
let undoStack = [];
let redoStack = [];
function saveState(){
    undoStack.push(canvas.toDataURL());
    redoStack = [];
}
let currentBackgroundColor = "#ffffff";
const ctx = canvas.getContext('2d');
colorPicker.addEventListener('change',(e)=>{
    ctx.strokeStyle = e.target.value;
    ctx.fillStyle = e.target.value;
})
canvas.addEventListener('mousedown',(e)=>{
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
})
canvas.addEventListener('mousemove',(e)=>{
    if(isDrawing){
        ctx.beginPath();
        ctx.moveTo(lastX,lastY);
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
        lastX = e.offsetX;
        lastY = e.offsetY;
    }
})
canvas.addEventListener('mouseup',()=>{
    isDrawing = false;
    saveState();
})
canvasColor.addEventListener('change',(e)=>{
    currentBackgroundColor = e.target.value;
    ctx.fillStyle = currentBackgroundColor
    ctx.fillRect(0,0,800,500);
})
fontPicker.addEventListener('change',(e)=>{
    ctx.lineWidth = e.target.value;
})
clearButton.addEventListener('click',()=>{
    ctx.clearRect(0,0,800,500);
    ctx.fillStyle = currentBackgroundColor;
    ctx.fillRect(0,0,800,500);
    saveState();
    redoStack = [];
})
saveButton.addEventListener('click',()=>{
    localStorage.setItem('canvasContents',canvas.toDataURL());
    let link = document.createElement('a');
    link.download = 'my-canvas.png';
    link.href = canvas.toDataURL();
    link.click();
})
retrieveButton.addEventListener('click',()=>{
    let savedcanvas = localStorage.getItem('canvasContents');
    if(savedcanvas)
    {
        let img = new Image();
        img.src = savedcanvas;
        ctx.drawImage(img,0,0);
    }
})
undoButton.addEventListener('click',()=>{
    if(undoStack.length>0)
    {
        redoStack.push(canvas.toDataURL());
        let lastState = undoStack.pop();
        let img = new Image();
        img.src = lastState;
        img.onload = ()=>{
            ctx.clearRect(0,0,800,500);
            ctx.drawImage(img,0,0);
        };
    }
})
redoButton.addEventListener('click', () => {
    if (redoStack.length > 0) {
        undoStack.push(canvas.toDataURL());
        let redoState = redoStack.pop();
        let img = new Image();
        img.src = redoState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
});
resetIcon.addEventListener('click',()=>{
    currentBackgroundColor = "#ffffff";
    ctx.fillStyle = currentBackgroundColor;
    ctx.fillRect(0,0,800,500);
    saveState();
})