import "./styles/index.scss";
import Sidebar from "./scripts/sidebar/sidebar";
import sidebarData from "./scripts/util/sidebar_data";
import MyCanvas from "./scripts/canvas/canvas";

window.addEventListener("DOMContentLoaded", (main) => {

  const canvasElement = document.getElementById('myCanvas');
  const myCanvas = new MyCanvas(canvasElement);
  const ctx = canvasElement.getContext("2d");

  const sidebarElement = document.getElementById("section-content-sidebar");
  const sidebar = new Sidebar(
    sidebarData[0],
    sidebarElement,
    myCanvas.drawShapes
  );

  myCanvas.height = window.innerHeight;
  myCanvas.width = window.innerWidth;

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
     let container = document.getElementById("konvaContainer");
    container.style.display = 'block';
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
    
     let container = document.getElementById("konvaContainer");
     container.style.display = 'block';

     ctx.strokeStyle = "black";
     ctx.lineWidth = 5;
     ctx.strokeRect(80, 80, width, height);

     ctx.font = "18px Lato";
     ctx.fillText(feetWidth+"'"+inchesWidth+"''", 60+(width/2), 70);
     ctx.fillText(feetHeight+"'"+inchesHeight+"''", 20, 60+(height/2));
     modal.style.display = "none";
   })



});

