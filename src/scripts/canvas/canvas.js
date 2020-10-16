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

    // sets up paper js on canvas
    paper.setup(canvasElement);
    this.project = new Project(canvasElement);
    this.canvasScaleValue = 1;

    //creating tool
    this.tool = new Tool();
    // has moved at least 10 points:
    tool.minDistance = 2;

    //binds methods
    this.drawObjectShape = this.drawObjectShape.bind(this);
    this.drawTextShape = this.drawTextShape.bind(this);

    //general method binding
    this.getCenterPosition = this.getCenterPosition.bind(this);

    //user interaction method binding
    this.onToolDoubleClick = this.onToolDoubleClick.bind(this);
    this.onToolMouseDown = this.onToolMouseDown.bind(this);
    this.setOneItemSelected = this.setOneItemSelected.bind(this);
    this.onToolDrag = this.onToolDrag.bind(this);
    this.onToolKeyDown = this.onToolKeyDown.bind(this);

    //tool level clicklistener
    this.tool.onMouseDown = this.onToolMouseDown;
    this.tool.onMouseUp = this.onToolMouseUp;
    this.tool.onMouseDrag = this.onToolDrag;
    this.tool.onKeyDown = this.onToolKeyDown;

    //add double click listener on canvas because tool have no double click listener
    this.canvasElement.addEventListener("dblclick", this.onToolDoubleClick);

    //line attachement function binding
    this.checkLineAttachment = this.checkLineAttachment.bind(this);

    //line render function
    this.reRenderLine = this.reRenderLine.bind(this);
  }

  //set bring to front listener for items
  bringToFront() {
    this.currentActiveItem.bringToFront();
  }

  //set move to back listener for items
  moveToBack() {
    this.currentActiveItem.sendToBack();
  }

  //shape draw distributor
  drawShapes(shapeName) {
    switch (shapeName) {
      case SHAPES.CLASS:
      case SHAPES.OFFICE:
      case SHAPES.ENDTABLE:
      case SHAPES.RUG:
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

  // adds text to the clicked area
  drawTextShape(position, text) {
    //create text shape
    let textShape = new PointText(position);
    textShape.fillColor = this.strokeColor;
    textShape.content = text;

    //adds doubleclick listner to text
    textShape.onDoubleClick = (e) => {
      //show modal to update text
      if (textShape.bounds.selected) {
        new Modal((updatedText) => {
          textShape.content = updatedText;
        }).show();
      }
    };

    return textShape;
  }

  drawObjectShape(type) {
    //creates object rectangle
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

    //create textshape
    if (type !== SHAPES.SQUARE) {
      const textShapeStartPoint = new Point(
        startPoint.x + 30,
        startPoint.y + 30
      );
      const textShape = this.drawTextShape(textShapeStartPoint, type);
    }
  }

  //on tool click
  onToolMouseDown(e) {
    //toggle item selected
    this.setOneItemSelected(e);

    //return if no currentActiveItem
    if (!this.currentActiveItem) return;

    //clearing currentActiveItem data to fix the issue of unintended moves
    this.currentActiveItem.data.state = null;

    if (this.currentActiveItem.contains(e.point)) {
      this.currentActiveItem.data.state = "move";
    }
    //set items data based on item mouseDown point
    if (this.currentActiveItem.data.type !== LINE) {
      if (
        this.currentActiveItem.hitTest(e.point, { bounds: true, tolerance: 5 })
      ) {
        //get bounds of the shape
        const bounds = this.currentActiveItem.bounds;

        //itrating to find the exact bound point
        for (let [key, value] of Object.entries(boundsIdentifierObj)) {
          if (bounds[value].isClose(e.point, 5)) {
            const oppositeBound =
              bounds[boundsIdentifierObj[(parseInt(key) + 2) % 4]];
            //get opposite bound point
            const oppositePoint = new Point(oppositeBound.x, oppositeBound.y);
            //get current bound point
            const centerPoint = new Point(bounds[value].x, bounds[value].y);

            //set shape data to be used for resizing later
            this.currentActiveItem.data.state = "resize";
            this.currentActiveItem.data.from = oppositePoint;
            this.currentActiveItem.data.to = centerPoint;
            break;
          }
        }
      }
    } else {
      //only for shapes with type LINE
      const headCircleItem = this.currentActiveItem.firstChild.children[3];
      if (headCircleItem.contains(e.point)) {
        this.currentActiveItem.data.state = "resize";
      }
    }
  }

  //item drag listener
  onToolDrag(e) {
    // debugger
    if (this.currentActiveItem == null) return;

    if (this.currentActiveItem.data.state === "move") {
      this.currentActiveItem.position = e.point;

      //check if the shape has any attached lines
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
        //shapes with type line, re-rendering line on each user move
        this.reRenderLine(e.point);

        this.checkLineAttachment(e);
      } else {
        //shapes other than line, updating the bounds
        this.currentActiveItem.bounds = new Rectangle(
          this.currentActiveItem.data.from,
          e.point
        );
      }
      this.currentActiveItem.bounds.selected = true;
    }
  }

  drawLineShape(startPoint, endPoint, lineType) {
    let mainGroup = new Group();
    let group = new Group();

    //draw line
    const line = new Path.Line(startPoint, endPoint);
    this.setStrokeAndFill(line);

    // draw head circle
    const headCircle = new Path.Circle(endPoint, 5);
    headCircle.fillColor = "black";
    headCircle.strokeWidth = 1;

    //draw middle circle
    const midPoint = new Point(
      (startPoint.x + endPoint.x) / 2,
      (startPoint.y + endPoint.y) / 2
    );
    const midCircle = new Path.Circle(midPoint, 4);
    midCircle.fillColor = "black";
    midCircle.strokeWidth = 1;

    //draw tail circle
    const tailCircle = new Path.Circle(startPoint, 5);
    tailCircle.fillColor = "black";
    tailCircle.strokeWidth = 1;

    //add circles and line to group
    group.addChild(line);
    group.addChild(tailCircle);
    group.addChild(midCircle);
    group.addChild(headCircle);

    //draw arrow shape
    const headShape = new Path();
    headShape.strokeColor = this.strokeColor;
    headShape.strokeWidth = this.strokeWidth;

    let arrowCenter = endPoint;

    //based on line type draw shape
    if (lineType !== SHAPES.DIVIDER) {
      const leftEdge = new Point(arrowCenter.x - 10, arrowCenter.y - 10);
      const rightEdge = new Point(arrowCenter.x - 10, arrowCenter.y + 10);
      headShape.add(leftEdge);
      headShape.add(arrowCenter);
      headShape.add(rightEdge);

      if (lineType === SHAPES.AGGREGATION || lineType === SHAPES.COMPOSITION) {
        const bottomRightEdge = new Point(arrowCenter.x - 20, arrowCenter.y);
        const bottomLeftEdge = leftEdge;
        headShape.add(bottomRightEdge);
        headShape.add(bottomLeftEdge);

        if (lineType === SHAPES.AGGREGATION) {
          headShape.strokeColor = "white";
          headShape.fillColor = "white";
          headShape.shadowColor = "gray";
          headShape.shadowOffset = 1;
        }

        if (lineType === SHAPES.COMPOSITION) {
          headShape.fillColor = "black";
        }
      }
    }

    //rotate the head shape
    if (lineType !== SHAPES.DIVIDER)
      headShape.rotate(
        getAngle(endPoint.x, endPoint.y, startPoint.x, startPoint.y),
        arrowCenter
      );

    //add group to main group
    mainGroup.addChild(group);
    if (lineType !== SHAPES.DIVIDER) mainGroup.addChild(headShape);
    mainGroup.data.type = LINE;
    mainGroup.data.lineType = lineType;
    mainGroup.data.lineId = Date.now();
    return mainGroup;
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

  // attach line to shapes
  checkLineAttachment(event) {
    //iteratethough each element to find the intresecting shape
    this.project.activeLayer.children.forEach((child) => {
      // find the shapes that line intersected with
      if (
        child != this.currentActiveItem &&
        child.hitTest(event.point, { bounds: true, tolerance: 5 })
      ) {
        //add line to attached shapes

        const bounds = child.bounds;
        //itrating to find the exact bound point
        for (let [key, value] of Object.entries(boundsCenterIdentifierObj)) {
          if (bounds[value].isClose(event.point, 5)) {
            //get center bound point of the side line touches
            const centerPoint = new Point(bounds[value].x, bounds[value].y);
            this.reRenderLine(centerPoint);

            //set data to shape to allow shape to move line head with it as it is dragged

            // check if the lineShape already exists
            if (!child.data.lineShape) {
              child.data.lineShape = {};
            }

            // add line currentActive Line Shape and also the side it is attached with
            child.data.lineShape[this.currentActiveItem.data.lineId] = [
              value,
              this.currentActiveItem,
            ];
            break;
          }
        }
      } else {
        //remove line attachement with shapes
        if (child.data.lineShape) {
          delete child.data.lineShape[this.currentActiveItem.data.lineId];
        }
      }
    });
  }

  //on tool double click
  onToolDoubleClick(e) {
    if (e.ctrlKey) {
      this.drawTextShape({ x: e.layerX, y: e.layerY }, "Add Text");
    }
  }

  //toggle item selecteion and saving currentActiveItem
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
    //return if no item is selected
    if (clickedItems.length === 0) return;

    //select the clicked item
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

  // keyboard intraction to move shapes
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

  // return center position of canvas
  getCenterPosition() {
    return new Point({
      x: this.canvasElement.clientWidth / 2,
      y: this.canvasElement.clientHeight / 2,
    });
  }

  // helper to set stroke and fill
  setStrokeAndFill(item) {
    item.strokeWidth = this.strokeWidth;
    item.strokeColor = this.strokeColor;
    item.fillColor = this.fillColor;
  }
}

export default DrawCanvas;