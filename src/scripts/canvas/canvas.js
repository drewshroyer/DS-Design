import { SHAPES } from "../util/constants";
import paper, {
  Project,
  Path,
  Group,
  PointText,
  tool,
  Tool,
  Rectangle,
  Point,
  Size,
} from "paper";
import { getAngle } from "../util/get_angle";

import Modal from "../modal/modal";

const boundsIdentifierObj = {
  1: "topLeft",
  2: "topRight",
  3: "bottomRight",
  0: "bottomLeft",
};

const boundsCenterIdentifierObj = {
  1: "topCenter",
  2: "rightCenter",
  3: "bottomCenter",
  0: "leftCenter",
};
const LINE = "line";

class DrawCanvas {
  constructor(canvasElement) {
    this.canvasElement = canvasElement;
    this.centerPosition = this.getCenterPosition();
    this.strokeColor = "black";
    this.fillColor = "white";
    this.defaultSize = [200, 200];
    this.currentActiveItem = null;
    this.strokeWidth = 2;
    paper.setup(canvasElement);
    this.project = new Project(canvasElement);
    this.canvasScaleValue = 1;
    this.tool = new Tool();
    tool.minDistance = 2;
    this.drawObjectShape = this.drawObjectShape.bind(this);
    this.drawTextShape = this.drawTextShape.bind(this);
    this.getCenterPosition = this.getCenterPosition.bind(this);
    this.onToolDoubleClick = this.onToolDoubleClick.bind(this);
    this.onToolMouseDown = this.onToolMouseDown.bind(this);
    this.setOneItemSelected = this.setOneItemSelected.bind(this);
    this.onToolDrag = this.onToolDrag.bind(this);
    this.onToolKeyDown = this.onToolKeyDown.bind(this);
    this.tool.onMouseDown = this.onToolMouseDown;
    this.tool.onMouseUp = this.onToolMouseUp;
    this.tool.onMouseDrag = this.onToolDrag;
    this.tool.onKeyDown = this.onToolKeyDown;
    this.canvasElement.addEventListener("dblclick", this.onToolDoubleClick);
    this.checkLineAttachment = this.checkLineAttachment.bind(this);
    this.reRenderLine = this.reRenderLine.bind(this);
  }
  bringToFront() {
    this.currentActiveItem.bringToFront();
  }
  moveToBack() {
    this.currentActiveItem.sendToBack();
  }

  drawShapes(shapeName) {
    switch (shapeName) {
      case SHAPES.CLASS:
      case SHAPES.OFFICE:
      case SHAPES.ENDTABLE:
      case SHAPES.RUG:
          this.drawRug();
          break;
      case SHAPES.ROUNDTABLE:
      case SHAPES.TVCABINENT:
      case SHAPES.ROUNDRUG:
      case SHAPES.LOVESEAT:
      case SHAPES.COFFEETABLE:
      case SHAPES.FIREPLACE:
      case SHAPES.STAIRS:
      case SHAPES.UPHOLSTERED:
      case SHAPES.DINING:
      case SHAPES.ROUNDTABLE:
      case SHAPES.TVCABINENT:
      case SHAPES.QUEEN:
      case SHAPES.TWIN:
      case SHAPES.ARMCHAIR:
      case SHAPES.SOFA:
      case SHAPES.MODULE:
        this.drawObjectShape(shapeName);
        break;
      case SHAPES.TITLE:
        startPoint = new Point(
          this.centerPosition.x - 25,
          this.centerPosition.y - 25
        );
        this.drawTextShape(startPoint, "Add Text");
        break;
      default:
        break;
    }
  }


  drawRug() {
    rug = new Image();
    rug.src = "../../images/rug.svg";
    rug.onload = function () {
      context.drawImage(rug, 0, 0);
  };

}

  drawTextShape(position, text) {
    let textShape = new PointText(position);
    textShape.fillColor = this.strokeColor;
    textShape.content = text;

    textShape.onDoubleClick = (e) => {
      if (textShape.bounds.selected) {
        new Modal((updatedText) => {
          textShape.content = updatedText;
        }).show();
      }
    };

    return textShape;
  }

  drawObjectShape(type) {
    const startPoint = new Point(
      this.centerPosition.x - 50,
      this.centerPosition.y - 25
    );
    const rectangle = new Path.Rectangle(
      startPoint.x,
      startPoint.y,
      this.defaultSize[0],
      this.defaultSize[0] / 2
    );
    this.setStrokeAndFill(rectangle);

    if (type !== SHAPES.SQUARE) {
      const textShapeStartPoint = new Point(
        startPoint.x + 30,
        startPoint.y + 30
      );
      const textShape = this.drawTextShape(textShapeStartPoint, type);
    }
  }

  onToolMouseDown(e) {
    this.setOneItemSelected(e);
    if (!this.currentActiveItem) return;

    this.currentActiveItem.data.state = null;

    if (this.currentActiveItem.contains(e.point)) {
      this.currentActiveItem.data.state = "move";
    }
  
    if (this.currentActiveItem.data.type !== LINE) {
      if (
        this.currentActiveItem.hitTest(e.point, { bounds: true, tolerance: 5 })
      ) {
        const bounds = this.currentActiveItem.bounds;

        for (let [key, value] of Object.entries(boundsIdentifierObj)) {
          if (bounds[value].isClose(e.point, 5)) {
            const oppositeBound =
              bounds[boundsIdentifierObj[(parseInt(key) + 2) % 4]];

            const oppositePoint = new Point(oppositeBound.x, oppositeBound.y);

            const centerPoint = new Point(bounds[value].x, bounds[value].y);
            this.currentActiveItem.data.state = "resize";
            this.currentActiveItem.data.from = oppositePoint;
            this.currentActiveItem.data.to = centerPoint;
            break;
          }
        }
      }
    } else {
      const headCircleItem = this.currentActiveItem.firstChild.children[3];
      if (headCircleItem.contains(e.point)) {
        this.currentActiveItem.data.state = "resize";
      }
    }
  }

  onToolDrag(e) {
    if (this.currentActiveItem == null) return;

    if (this.currentActiveItem.data.state === "move") {
      this.currentActiveItem.position = e.point;
      if (this.currentActiveItem.data.lineShape) {
        const lineShapeObject = this.currentActiveItem.data.lineShape;
        for (let [key, value] of Object.entries(lineShapeObject)) {
          const element = value[1];
          const lineStartPoint =
            element.firstChild.firstChild.segments[0].point;
          const lineType = element.data.lineType;
          const lineId = element.data.lineId;
          element.remove();
          element = this.drawLineShape(
            lineStartPoint,
            this.currentActiveItem.bounds[value[0]],
            lineType
          );
          element.data.lineId = lineId;
          lineShapeObject[key] = [value[0], element];
        }
      }
    } else if (this.currentActiveItem.data.state === "resize") {
      if (this.currentActiveItem.data.type === LINE) {
        this.reRenderLine(e.point);

        this.checkLineAttachment(e);
      } else {
        this.currentActiveItem.bounds = new Rectangle(
          this.currentActiveItem.data.from,
          e.point
        );
      }
      this.currentActiveItem.bounds.selected = true;
    }
  }


  reRenderLine(headPosition) {
    const lineStartPoint = this.currentActiveItem.firstChild.firstChild
      .segments[0].point;
    const lineType = this.currentActiveItem.data.lineType;
    const lineId = this.currentActiveItem.data.lineId;
    this.currentActiveItem.remove();
    this.currentActiveItem = this.drawLineShape(
      lineStartPoint,
      headPosition,
      lineType
    );
    this.currentActiveItem.data.state = "resize";
    this.currentActiveItem.data.lineId = lineId;
  }

  checkLineAttachment(event) {
    this.project.activeLayer.children.forEach((child) => {
      if (
        child != this.currentActiveItem &&
        child.hitTest(event.point, { bounds: true, tolerance: 5 })
      ) {
        const bounds = child.bounds;
        for (let [key, value] of Object.entries(boundsCenterIdentifierObj)) {
          if (bounds[value].isClose(event.point, 5)) {
            const centerPoint = new Point(bounds[value].x, bounds[value].y);
            this.reRenderLine(centerPoint);
            if (!child.data.lineShape) {
              child.data.lineShape = {};
            }
            child.data.lineShape[this.currentActiveItem.data.lineId] = [
              value,
              this.currentActiveItem,
            ];
            break;
          }
        }
      } else {
        if (child.data.lineShape) {
          delete child.data.lineShape[this.currentActiveItem.data.lineId];
        }
      }
    });
  }
  onToolDoubleClick(e) {
    if (e.ctrlKey) {
      this.drawTextShape({ x: e.layerX, y: e.layerY }, "Add Text");
    }
  }

  setOneItemSelected(e) {
    const position = e.point;
    let clickedItems = [];
    this.project.activeLayer.children.forEach((child) => {
      if (child.contains(position)) {
        clickedItems.push(child);
      } else {
        child.bounds.selected = false;
      }
    });
    if (clickedItems.length === 0) return;

    let latestItem = clickedItems[0];
    for (let i = 0; i < clickedItems.length; i++) {
      if (latestItem.id < clickedItems[i].id) {
        latestItem = clickedItems[i];
      } else {
        clickedItems[i].bounds.selected = false;
      }
    }
    this.currentActiveItem = latestItem;
    latestItem.bounds.selected = true;
  }

  onToolKeyDown(e) {
    if (!this.currentActiveItem) return;

    const position = this.currentActiveItem.position;
    const step = 5;
    switch (e.key) {
      case "left":
        position.x -= step;
        break;
      case "right":
        position.x += step;
        break;
      case "up":
        position.y -= step;
        break;
      case "down":
        position.y += step;
        break;
      case "delete":
        this.currentActiveItem.remove();
        break;
    }
    this.currentActiveItem.position = position;
  }

  getCenterPosition() {
    return new Point({
      x: this.canvasElement.clientWidth / 2,
      y: this.canvasElement.clientHeight / 2,
    });
  }

  setStrokeAndFill(item) {
    item.strokeWidth = this.strokeWidth;
    item.strokeColor = this.strokeColor;
    item.fillColor = this.fillColor;
  }
}

export default DrawCanvas;