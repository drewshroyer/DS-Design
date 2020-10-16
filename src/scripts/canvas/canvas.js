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
import Modal from "../modal/modal";
import { getAngleDeg } from "../util/util";

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

    //creates new project in paper
    this.project = new Project(canvasElement);

    //canvas scale value
    this.canvasScaleValue = 1;

    //creating tool
    this.tool = new Tool();
    // has moved at least 10 points:
    tool.minDistance = 2;

    //binds methods
    //shapes method binding
    this.drawShapes = this.drawShapes.bind(this);
    this.drawClassShape = this.drawClassShape.bind(this);
    this.drawLineShape = this.drawLineShape.bind(this);
    this.drawObjectShape = this.drawObjectShape.bind(this);
    this.drawTextShape = this.drawTextShape.bind(this);
    this.drawUserCaseShape = this.drawUseCaseShape.bind(this);
    this.drawComponentShape = this.drawComponentShape.bind(this);
    this.drawModuleShape = this.drawModuleShape.bind(this);
    this.drawActivityShape = this.drawActivityShape.bind(this);
    this.drawDecisionShape = this.drawDecisionShape.bind(this);
    this.drawActorShape = this.drawActorShape.bind(this);

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

    //set right menu liteners
    this.setMenuClickListener = this.setMenuClickListener.bind(this);

    //line attachement function binding
    this.checkLineAttachment = this.checkLineAttachment.bind(this);

    //line render function
    this.reRenderLine = this.reRenderLine.bind(this);

    this.setMenuClickListener();
  }

  //set input to open file picker dialog
  openFile() {
    let input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.accept = "image/svg+xml";
    input.onchange = () => {
      this.project.importSVG(
        URL.createObjectURL(input.files[0]),
        (group, svg) => {
          this.project.clear();
          const that = this;
          while (group.children[1].children.length > 0) {
            that.project.activeLayer.addChild(group.children[1].children[0]);
          }
        }
      );
    };
    input.click();
  }

  // set download project as svg
  downloadAsSVG() {
    if (this.project.activeLayer.children.length == 0) return;

    const fileName = `umlchart_${Date.now()}.svg`;

    var url =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(this.project.exportSVG({ asString: true }));

    var downloadLinkElement = document.createElement("a");
    downloadLinkElement.download = fileName;
    downloadLinkElement.href = url;
    downloadLinkElement.click();
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
        this.drawClassShape();
        break;
      case SHAPES.QUEEN:
      case SHAPES.TWIN:
      case SHAPES.ARMCHAIR:
      case SHAPES.SOFA:
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
        let startPoint = new Point(
          this.centerPosition.x - 50,
          this.centerPosition.y
        );
        let endPoint = new Point(
          this.centerPosition.x + 50,
          this.centerPosition.y
        );
        this.drawLineShape(startPoint, endPoint, shapeName);
        break;
      case SHAPES.DINING:
      case SHAPES.ROUNDTABLE:
      case SHAPES.TVCABINENT:
        this.drawObjectShape(shapeName);
        break;
      case SHAPES.TITLE:
        startPoint = new Point(
          this.centerPosition.x - 25,
          this.centerPosition.y - 25
        );
        this.drawTextShape(startPoint, "Add Text");
        break;
      case SHAPES.CIRCLE:
      case SHAPES.USECASE:
        this.drawUseCaseShape(shapeName);
        break;
      case SHAPES.COMPONENT:
        this.drawComponentShape();
        break;
      case SHAPES.MODULE:
        this.drawModuleShape();
        break;
      case SHAPES.ACTIVITY:
        this.drawActivityShape();
        break;
      case SHAPES.DECISION:
        this.drawDecisionShape();
        break;
      case SHAPES.ACTOR:
        this.drawActorShape();
      default:
        break;
    }
  }

  // Creates three rectangle to make a class UML
  drawClassShape() {
    //creates group and add shapes

    //create class rectangle
    const groupClass = new Group();
    const firstRectX = this.centerPosition.x - 50;
    const firstRectY = this.centerPosition.y - 50;
    const firstRectHeight = 20;
    const fristRectWidth = this.defaultSize[1];
    const classNameRectangle = new Path.Rectangle(
      firstRectX,
      firstRectY,
      fristRectWidth,
      firstRectHeight
    );
    this.setStrokeAndFill(classNameRectangle);
    groupClass.addChild(classNameRectangle);

    //create varaible rectangle
    const secRectX = firstRectX;
    const secRectY = firstRectY + firstRectHeight;
    const secRectHeight = 50;
    const secRectWidth = this.defaultSize[1];
    const variableNameRectangle = new Path.Rectangle(
      secRectX,
      secRectY,
      secRectWidth,
      secRectHeight
    );
    this.setStrokeAndFill(variableNameRectangle);
    groupClass.addChild(variableNameRectangle);

    //create method rectangle
    const thirdRectX = firstRectX;
    const thirdRectY = secRectY + secRectHeight;
    const thirdRectHeight = 30;
    const thirdRectWidth = this.defaultSize[1];
    const methodNameRectangle = new Path.Rectangle(
      thirdRectX,
      thirdRectY,
      thirdRectWidth,
      thirdRectHeight
    );
    this.setStrokeAndFill(methodNameRectangle);
    groupClass.addChild(methodNameRectangle);
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

  //add Object/Interface shape
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

  //add Usecase/Activity shape
  drawUseCaseShape(type) {
    //draw circle
    let circlePath = new Path.Circle(this.centerPosition, 25);
    circlePath.scale(2, 1.2);

    //scale to make it an oval
    this.setStrokeAndFill(circlePath);

    if (type === SHAPES.USECASE) {
      //add Text
      const textShape = this.drawTextShape(
        new Point(this.centerPosition.x - 25, this.centerPosition.y + 5),
        type
      );
    }
  }

  //add Component shape
  drawComponentShape() {
    //draw main rectangle
    const startPoint = new Point(
      this.centerPosition.x - 50,
      this.centerPosition.y - 25
    );
    const rectangle = new Path.Rectangle(
      startPoint.x,
      startPoint.y,
      this.defaultSize[0] + 20,
      this.defaultSize[0] - 45
    );
    this.setStrokeAndFill(rectangle);

    // draw sub part of the shape
    const subRect = new Path.Rectangle(
      rectangle.bounds.topRight.x - 25,
      startPoint.y + 6,
      20,
      25
    );
    this.setStrokeAndFill(subRect);
    subRect.strokeWidth = 2 / this.strokeWidth;

    //draw two sub rec
    const subRect1 = new Path.Rectangle(
      rectangle.bounds.topRight.x - 28,
      startPoint.y + 9,
      7,
      7
    );
    this.setStrokeAndFill(subRect1);
    subRect1.strokeWidth = 2 / this.strokeWidth;

    const subRect2 = new Path.Rectangle(
      rectangle.bounds.topRight.x - 28,
      startPoint.y + 20,
      7,
      7
    );
    this.setStrokeAndFill(subRect2);
    subRect2.strokeWidth = 2 / this.strokeWidth;

    //create group and add shapes
    let group = new Group();

    group.addChild(rectangle);
    group.addChild(subRect);
    group.addChild(subRect1);
    group.addChild(subRect2);

    //add text to shape
    const textShape = this.drawTextShape(
      new Point(this.centerPosition.x - 25, this.centerPosition.y + 8),
      SHAPES.COMPONENT
    );
  }

  //add module shape
  drawModuleShape() {
    // draw main rect
    const rectangle = new Path.Rectangle(
      this.centerPosition.x - 50,
      this.centerPosition.y - 50,
      this.defaultSize[0] + 20,
      this.defaultSize[0] - 40
    );
    this.setStrokeAndFill(rectangle);

    //draw two sub rec
    const subRect1 = new Path.Rectangle(
      rectangle.bounds.topLeft.x - 7,
      rectangle.bounds.topLeft.y + 12,
      15,
      12
    );
    this.setStrokeAndFill(subRect1);

    const subRect2 = new Path.Rectangle(
      rectangle.bounds.topLeft.x - 7,
      rectangle.bounds.topLeft.y + 35,
      15,
      12
    );
    this.setStrokeAndFill(subRect2);

    //create group and add shapes
    let group = new Group();

    group.addChild(rectangle);
    group.addChild(subRect1);
    group.addChild(subRect2);

    //add text to shape
    const textShape = this.drawTextShape(
      new Point(this.centerPosition.x - 10, this.centerPosition.y - 15),
      SHAPES.MODULE
    );
  }

  //add activity shape
  drawActivityShape() {
    //create rounded shape rectangle
    const rectangle = new Rectangle(
      this.centerPosition.subtract(50),
      new Point(this.centerPosition.x + 70, this.centerPosition.y)
    );
    const radius = new Size(30, 30);
    const path = new Path.Rectangle(rectangle, radius);
    this.setStrokeAndFill(path);

    //add text to shape
    const textShape = this.drawTextShape(
      new Point(this.centerPosition.x - 10, this.centerPosition.y - 20),
      SHAPES.ACTIVITY
    );
  }

  //add decision shape
  drawDecisionShape() {
    //create rectangle
    const rectangle = new Path.Rectangle(
      this.centerPosition.x - 20,
      this.centerPosition.y - 20,
      this.defaultSize[0] / 2.5,
      this.defaultSize[0] / 2.5
    );
    this.setStrokeAndFill(rectangle);

    //rotate
    rectangle.rotate(45);
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

  //draw actor shape
  drawActorShape() {
    //draw actor head
    const head = new Path.Circle(
      new Point(this.centerPosition.x, this.centerPosition.y - 50),
      7
    );
    this.setStrokeAndFill(head);

    //draw actor body
    const body = new Path.Line(
      new Point(this.centerPosition.x, this.centerPosition.y - 43),
      new Point(this.centerPosition.x, this.centerPosition.y - 10)
    );
    this.setStrokeAndFill(body);

    //draw actor arms
    const arms = new Path.Line(
      new Point(this.centerPosition.x - 20, this.centerPosition.y - 38),
      new Point(this.centerPosition.x + 20, this.centerPosition.y - 38)
    );
    this.setStrokeAndFill(arms);

    //draw feet
    const leftFeet = new Path.Line(
      new Point(this.centerPosition.x - 20, this.centerPosition.y + 5),
      new Point(this.centerPosition.x, this.centerPosition.y - 10)
    );
    this.setStrokeAndFill(leftFeet);

    const rightFeet = new Path.Line(
      new Point(this.centerPosition.x, this.centerPosition.y - 10),
      new Point(this.centerPosition.x + 20, this.centerPosition.y + 5)
    );
    this.setStrokeAndFill(rightFeet);

    //add shapes to group to make full actor
    let group = new Group();
    group.addChild(head);
    group.addChild(body);
    group.addChild(arms);
    group.addChild(leftFeet);
    group.addChild(rightFeet);
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

  //----------------------- general methods --------------------------------------
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
