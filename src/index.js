import "./styles/index.scss";
import paper, { Rectangle, Path, Point, Tool, PointText } from "paper";
import Sidebar from "./scripts/sidebar/sidebar";
import sidebarData from "./scripts/util/sidebar_data";

window.addEventListener("DOMContentLoaded", (main) => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  //sidebar

  const sidebarElement = document.getElementById("section-content-sidebar");
  const sidebar = new Sidebar(
    sidebarData[0],
    sidebarElement,
    canvas.drawShapes
  );

  //info side bar

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

  function draw(e) {
    if (!painting) return;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "red";

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  }

  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishPosition);
  canvas.addEventListener("mousemove", draw);
});

