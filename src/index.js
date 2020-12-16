import "./styles/index.scss";
import Sidebar from "./scripts/sidebar/sidebar";
import sidebarData from "./scripts/util/sidebar_data";
import DrawCanvas from "./scripts/canvas/canvas";

window.addEventListener("DOMContentLoaded", (main) => {

  const canvas = document.getElementById("drawCanvas");
  const drawCanvas = new DrawCanvas(canvas);
  const ctx = canvas.getContext("2d");

  const sidebarElement = document.getElementById("section-content-sidebar");
  const sidebar = new Sidebar(
    sidebarData[0],
    sidebarElement,
    drawCanvas.drawShapes
  );

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  // let painting = false;
  // function startPosition() {
  //   painting = true;
  // }
  // function finishPosition() {
  //   painting = false;
  //   ctx.beginPath();
  // }
  // function scribble(e) {
  //   if (!painting) return;
  //   ctx.lineWidth = 2;
  //   ctx.lineCap = "round";
  //   ctx.strokeStyle = "blue";
  //   ctx.lineTo(e.clientX, e.clientY);
  //   ctx.stroke();
  //   ctx.beginPath();
  //   ctx.moveTo(e.clientX, e.clientY);
  // }
  // canvas.addEventListener("mousedown", startPosition);
  // canvas.addEventListener("mouseup", finishPosition);
  // canvas.addEventListener("mousemove", scribble);


   let modal = document.getElementById("myModal");
   let btn = document.getElementById("myBtn");
   let close = document.getElementsByClassName("close")[0];
   let startPlanningButton = document.getElementById("submit-dimension-button");
   let print = document.getElementById("print-file");

   print.onclick = function () {
     window.print();
   };

   btn.onclick = function () {
     modal.style.display = "block";
   };

   close.onclick = function () {
     modal.style.display = "none";
   };

   startPlanningButton.onclick = function () {
     if (event.target === modal) {
       modal.style.display = "none";
     }
   };

   startPlanningButton.addEventListener("click", function defineRoom(event) {
     event.preventDefault();
     let startPlanning = document.getElementById("submit-dimension-button");
     let feetHeight = document.getElementById("height-input-feet").value;
     let inchesHeight = document.getElementById("height-input-inches").value;
     let height = ((feetHeight * 12) + inchesHeight) * .5;
     let feetWidth = document.getElementById("width-input-feet").value;
     let inchesWidth = document.getElementById("width-input-inches").value;
     let width = ((feetWidth * 12) + inchesWidth) * .6;
    
     ctx.strokeStyle = "black";
     ctx.lineWidth = 5;
     ctx.strokeRect(80, 80, width, height);
     modal.style.display = "none";
   })
});

