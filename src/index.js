import "./styles/index.scss";
import Sidebar from "./scripts/sidebar/sidebar";
import sidebarData from "./scripts/util/sidebar_data";
import DrawCanvas from "./scripts/canvas/canvas";

window.addEventListener("DOMContentLoaded", (main) => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const canvasElement = document.getElementById("DrawCanvas");
  const DrawCanvas = new DrawCanvas(canvasElement);

  const sidebarElement = document.getElementById("section-content-sidebar");
  const sidebar = new Sidebar(
    sidebarData[0],
    sidebarElement,
    DrawCanvas.drawShapes
  );

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  let painting = false;

  function startPosition() {
    painting = true;
  }

  function finishPosition() {
    painting = false;
    ctx.beginPath();
  }

  function scribble(e) {
    if (!painting) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "blue";

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  }

  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishPosition);
  canvas.addEventListener("mousemove", scribble);
});

