import { SHAPES } from "../util/constants";
import paper, { Project, Path, Group, PointText, tool, Tool, Rectangle, Point, Size } from 'paper';
import Modal from "../modal/modal";
import {getAngleDeg} from '../util/get_angle';

const boundsIdentifierObj = {
  1: 'topLeft', 2: 'topRight', 3: 'bottomRight', 0: 'bottomLeft'
}

const boundsCenterIdentifierObj = {
  1: 'topCenter', 2: 'rightCenter', 3: 'bottomCenter', 0: 'leftCenter'
}
const LINE = 'line'; 

class MyCanvas {
  constructor(canvasElement) {
    this.canvasElement =  canvasElement;
    this.centerPosition = this.getCenterPosition();
    this.strokeColor = 'black';
    this.fillColor = "white";
    this.defaultSize = [100,100];
    this.currentActiveItem = null;
    this.strokeWidth = 2;

    // sets up paper js on canvas
    paper.setup(canvasElement);

    //creates new project in paper
    this.project = new Project(canvasElement)

    //canvas scale value
    this.canvasScaleValue = 1;

    //creating tool
    this.tool = new Tool();
    // has moved at least 10 points:
    tool.minDistance = 2;

    //binds methods
    //shapes method binding
    this.drawShapes = this.drawShapes.bind(this);
    this.drawTextShape = this.drawTextShape.bind(this);
    this.drawActorShape = this.drawActorShape.bind(this);

    // furniture elements binding
    this.drawQueen = this.drawQueen.bind(this);
    this.drawTwin = this.drawTwin.bind(this);
    this.drawRug = this.drawRug.bind(this);
    this.drawRoundRug = this.drawRoundRug.bind(this);
    this.drawDining = this.drawDining.bind(this);
    this.drawOffice = this.drawOffice.bind(this);
    this.drawTVCabinent = this.drawTVCabinent.bind(this);
    this.drawArmChair = this.drawArmChair.bind(this);
    this.drawUpholstered = this.drawUpholstered.bind(this);
    this.drawEndTable = this.drawEndTable.bind(this);
    this.drawRoundTable = this.drawRoundTable.bind(this);
    this.drawLoveSeat = this.drawLoveSeat.bind(this);
    this.drawCoffeeTable = this.drawCoffeeTable.bind(this);
    this.drawFirePlace = this.drawFirePlace.bind(this);
    this.drawStairs = this.drawStairs.bind(this);

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


  //set right menu click listener
  setMenuClickListener(){
    const downloadFileElement = document.getElementById('download-file');
    const bringToFrontElement = document.getElementById('bring-to-front');
    const moveToBackElement = document.getElementById('move-to-back');
    downloadFileElement.addEventListener('click', this.downloadAsSVG.bind(this));
    bringToFrontElement.addEventListener('click', this.bringToFront.bind(this));
    moveToBackElement.addEventListener('click', this.moveToBack.bind(this));
  }

  //set input to open file picker dialog
  openFile(){
    let input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.accept = 'image/svg+xml';
    input.onchange = () => {
            this.project.importSVG(URL.createObjectURL(input.files[0]),(group, svg)=>{
              this.project.clear();
              const that = this;
              while(group.children[1].children.length > 0){
                that.project.activeLayer.addChild(group.children[1].children[0]);
              }
            })
    };
    input.click();
  }

  // set download project as svg
  downloadAsSVG() {
   
    if(this.project.activeLayer.children.length == 0) return;

    const fileName = `ad_design_${Date.now()}.svg`;
 
    var url = "data:image/svg+xml;utf8," + encodeURIComponent(this.project.exportSVG({asString:true}));
    
    var downloadLinkElement = document.createElement("a");
    downloadLinkElement.download = fileName;
    downloadLinkElement.href = url;
    downloadLinkElement.click();
 }


 //set bring to front listener for items
 bringToFront(){
  this.currentActiveItem.bringToFront();
 }

 //set move to back listener for items
 moveToBack(){
  this.currentActiveItem.sendToBack();
 }

  //shape draw distributor
  drawShapes(shapeName){

    switch (shapeName) {
      case SHAPES.TITLE:
        startPoint = new Point(this.centerPosition.x-25, this.centerPosition.y-25);
        this.drawTextShape(startPoint, "Add Text");
        break;
      case SHAPES.ACTOR:
        this.drawActorShape();
        break;
      case SHAPES.QUEEN:
        this.drawQueen();
        break;
      case SHAPES.TWIN:
        this.drawTwin();
        break;
      case SHAPES.RUG:
        this.drawRug();
        break;
      case SHAPES.ROUNDRUG:
        this.drawRoundRug();
        break;
      case SHAPES.DINING:
        this.drawDining();
        break;
      case SHAPES.OFFICE:
        this.drawOffice();
        break;
      case SHAPES.TVCABINENT:
        this.drawTVCabinent();
        break;
      case SHAPES.ARMCHAIR:
        this.drawArmChair();
        break;
         case SHAPES.UPHOLSTERED:
        this.drawUpholstered();
        break;
      case SHAPES.ENDTABLE:
        this.drawEndTable();
        break;
      case SHAPES.ROUNDTABLE:
        this.drawRoundTable();
        break;
      case SHAPES.LOVESEAT:
        this.drawLoveSeat();
        break;
      case SHAPES.COFFEETABLE:
        this.drawCoffeeTable();
        break;
      case SHAPES.FIREPLACE:
        this.drawFirePlace();
        break;
      case SHAPES.STAIRS:
        this.drawStairs();
      default:
        break;
    }
  }

  drawQueen() {
    let queenImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    queenImg.onload = function() {
      ctx.drawImage(queenImg, 300, 300);
    }
    queenImg.src = "src/images/queen-bed.svg";
  }

  drawTwin() {
    let twinImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    twinImg.onload = function() {
      ctx.drawImage(twinImg, 300, 200);
    }
    twinImg.src = "src/images/twin-bed.svg";
  }

  drawRug() {
    let rugImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    rugImg.onload = function() {
      ctx.drawImage(rugImg, 300, 200);
    }
    rugImg.src = "src/images/rug.svg";
  }

   drawRoundRug() {
    let roundRugImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    roundRugImg.onload = function() {
      ctx.drawImage(roundRugImg, 300, 200);
    }
    roundRugImg.src = "src/images/round-rug.svg";
  }

   drawDining() {
    let diningImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    diningImg.onload = function() {
      ctx.drawImage(diningImg, 300, 300);
    }
    diningImg.src = "src/images/dining-table.svg";
  }

  drawOffice() {
    let officeImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    officeImg.onload = function() {
      ctx.drawImage(officeImg, 300, 200);
    }
    officeImg.src = "src/images/office-desk.svg";
  }

  drawTVCabinent() {
    let tvImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    tvImg.onload = function() {
      ctx.drawImage(tvImg, 300, 200);
    }
    tvImg.src = "src/images/tv-cabinent.svg";
  }

   drawArmChair() {
    let armChairImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    armChairImg.onload = function() {
      ctx.drawImage(armChairImg, 300, 200);
    }
    armChairImg.src = "src/images/arm-chair.svg";
  }
  drawUpholstered() {
    let upImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    upImg.onload = function() {
      ctx.drawImage(upImg, 300, 200);
    }
    upImg.src = "src/images/upholstered-chair.svg";
  }

    drawEndTable() {
    let endImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    endImg.onload = function() {
      ctx.drawImage(endImg, 300, 200);
    }
    endImg.src = "src/images/end-table.svg";
  }

   drawRoundTable() {
    let roundImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    roundImg.onload = function() {
      ctx.drawImage(roundImg, 300, 200);
    }
    roundImg.src = "src/images/round-table.svg";
  }

   drawLoveSeat() {
    let loveImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    loveImg.onload = function() {
      ctx.drawImage(loveImg, 300, 300);
    }
    loveImg.src = "src/images/love-seat.svg";
  }

  drawCoffeeTable() {
    let coffeeImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    coffeeImg.onload = function() {
      ctx.drawImage(coffeeImg, 300, 200);
    }
    coffeeImg.src = "src/images/coffee-table.svg";
  }

  drawFirePlace() {
    let fireImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    fireImg.onload = function() {
      ctx.drawImage(fireImg, 300, 200);
    }
    fireImg.src = "src/images/fire-place.svg";
  }

   drawStairs() {
    let stairImg = new Image();
    const canvasElement = document.getElementById('myCanvas');
    const ctx = canvasElement.getContext("2d");
    stairImg.onload = function() {
      ctx.drawImage(stairImg, 300, 200);
    }
    stairImg.src = "src/images/stairs.svg";
  }

  
  // adds text to the clicked area
  drawTextShape(position, text){
    //create text shape
    let textShape = new PointText(position);
    textShape.fillColor = this.strokeColor;
    textShape.content = text;

    //adds doubleclick listner to text
    textShape.onDoubleClick = (e)=>{
      //show modal to update text
      if(textShape.bounds.selected){
        new Modal((updatedText)=>{
          textShape.content = updatedText;
        }).show();
      }
    }

    return textShape
  }


  //on tool click
  onToolMouseDown(e){
    //toggle item selected
    this.setOneItemSelected(e);

    //return if no currentActiveItem
    if(!this.currentActiveItem) return;

    //clearing currentActiveItem data to fix the issue of unintended moves
    this.currentActiveItem.data.state = null;

    if(this.currentActiveItem.contains(e.point)){
      this.currentActiveItem.data.state = 'move'
    }
    //set items data based on item mouseDown point
    if(this.currentActiveItem.data.type !== LINE){
      if(this.currentActiveItem.hitTest(e.point, {bounds: true, tolerance: 5})){
        //get bounds of the shape
        const bounds = this.currentActiveItem.bounds;


        //itrating to find the exact bound point
        for(let[key, value] of Object.entries(boundsIdentifierObj)){
          if(bounds[value].isClose(e.point, 5)){
            const oppositeBound = bounds[boundsIdentifierObj[(parseInt(key) + 2) % 4]];
            //get opposite bound point
            const oppositePoint = new Point(oppositeBound.x,oppositeBound.y);
            //get current bound point
            const centerPoint = new Point(bounds[value].x, bounds[value].y);

            //set shape data to be used for resizing later
            this.currentActiveItem.data.state = 'resize'
            this.currentActiveItem.data.from = oppositePoint;
            this.currentActiveItem.data.to = centerPoint;
            break;
          }
        }
      }
    } else {
      //only for shapes with type LINE
      const headCircleItem = this.currentActiveItem.firstChild.children[3];
      if(headCircleItem.contains(e.point)){
        this.currentActiveItem.data.state = 'resize'
      }
    }
  }

  //draw actor shape
  drawActorShape(){
    //draw actor head
    const head = new Path.Circle(new Point(this.centerPosition.x, this.centerPosition.y-50), 7);
    this.setStrokeAndFill(head)

    //draw actor body
    const body = new Path.Line(new Point(this.centerPosition.x, this.centerPosition.y-43), new Point(this.centerPosition.x, this.centerPosition.y-10));
    this.setStrokeAndFill(body)

    //draw actor arms
    const arms = new Path.Line(new Point(this.centerPosition.x-20, this.centerPosition.y-38), new Point(this.centerPosition.x+20, this.centerPosition.y-38));
    this.setStrokeAndFill(arms) 

    //draw feet
    const leftFeet = new Path.Line(new Point(this.centerPosition.x-20, this.centerPosition.y+5), new Point(this.centerPosition.x, this.centerPosition.y-10));
    this.setStrokeAndFill(leftFeet) 

    const rightFeet = new Path.Line(new Point(this.centerPosition.x, this.centerPosition.y-10), new Point(this.centerPosition.x+20, this.centerPosition.y+5));
    this.setStrokeAndFill(rightFeet) 

    //add shapes to group to make full actor
    let group =  new Group();
    group.addChild(head);
    group.addChild(body);
    group.addChild(arms);
    group.addChild(leftFeet);
    group.addChild(rightFeet);
  }


  //item drag listener
  onToolDrag(e){
    // debugger
    if(this.currentActiveItem == null) return;

    if(this.currentActiveItem.data.state === 'move'){
      this.currentActiveItem.position = e.point;  
      
      //check if the shape has any attached lines
      if(this.currentActiveItem.data.lineShape){
        const lineShapeObject = this.currentActiveItem.data.lineShape;
        for (let [key, value] of Object.entries(lineShapeObject)) {
          const element = value[1];
          const lineStartPoint = element.firstChild.firstChild.segments[0].point;
          const lineType = element.data.lineType;
          const lineId = element.data.lineId;
          element.remove();
         element = this.drawLineShape(lineStartPoint, this.currentActiveItem.bounds[value[0]], lineType);
         element.data.lineId = lineId; 
         lineShapeObject[key] = [value[0], element]
        }
      }
    } else
    if(this.currentActiveItem.data.state === 'resize'){
      if(this.currentActiveItem.data.type === LINE){
        //shapes with type line, re-rendering line on each user move
        this.reRenderLine(e.point);
        
        this.checkLineAttachment(e);
      }else{
        //shapes other than line, updating the bounds
        this.currentActiveItem.bounds = new Rectangle(
          this.currentActiveItem.data.from,e.point);
      }
      this.currentActiveItem.bounds.selected = true
    } 
  }

  reRenderLine(headPosition){
    const lineStartPoint = this.currentActiveItem.firstChild.firstChild.segments[0].point;
    const lineType = this.currentActiveItem.data.lineType;
    const lineId = this.currentActiveItem.data.lineId;
    this.currentActiveItem.remove();
    this.currentActiveItem =  this.drawLineShape(lineStartPoint, headPosition, lineType);
    this.currentActiveItem.data.state = 'resize'
    this.currentActiveItem.data.lineId = lineId;
  }

  // attach line to shapes
  checkLineAttachment(event) {
    //iteratethough each element to find the intresecting shape
    this.project.activeLayer.children.forEach(child=>{
      // find the shapes that line intersected with
      if(child != this.currentActiveItem && child.hitTest(event.point, {bounds: true, tolerance: 5})){
        //add line to attached shapes

        const bounds = child.bounds;
        //itrating to find the exact bound point
        for(let[key, value] of Object.entries(boundsCenterIdentifierObj)){
          if(bounds[value].isClose(event.point, 5)){
            //get center bound point of the side line touches
            const centerPoint = new Point(bounds[value].x, bounds[value].y);
            this.reRenderLine(centerPoint);

            //set data to shape to allow shape to move line head with it as it is dragged

            // check if the lineShape already exists
            if(!child.data.lineShape) {
              child.data.lineShape = {}
            }

            // add line currentActive Line Shape and also the side it is attached with
            child.data.lineShape[this.currentActiveItem.data.lineId] = [value, this.currentActiveItem];
            break;
          }
        }
      } else {
        //remove line attachement with shapes
        if(child.data.lineShape){
          delete child.data.lineShape[this.currentActiveItem.data.lineId];
        }
      }
    })
  }

  //on tool double click
  onToolDoubleClick(e){
    if(e.ctrlKey) {
      this.drawTextShape({x: e.layerX, y: e.layerY}, "Add Text");
    }
  }

  

  //toggle item selecteion and saving currentActiveItem
  setOneItemSelected(e){
    const position = e.point;
    let clickedItems = []
    this.project.activeLayer.children.forEach(child=>{
      if(child.contains(position)){
        clickedItems.push(child);
      } else {
        child.bounds.selected =  false;
      }
    })
    //return if no item is selected
    if(clickedItems.length === 0) return;

    //select the clicked item
    let latestItem = clickedItems[0];
    for (let i = 0; i < clickedItems.length; i++) {
      if(latestItem.id < clickedItems[i].id){
        latestItem = clickedItems[i];
      }else
      {
        clickedItems[i].bounds.selected = false;
      }
    }
    this.currentActiveItem = latestItem;
    latestItem.bounds.selected = true;
  }


  // keyboard intraction to move shapes
  onToolKeyDown(e){
    if(!this.currentActiveItem) return;

    const position = this.currentActiveItem.position;
    const step = 5;
    switch(e.key){
      case 'left':
        position.x -= step;
        break;
      case 'right':
        position.x += step;
        break;
      case 'up':
        position.y -= step;
        break;
      case 'down':
        position.y += step;
        break; 
      case 'delete':
        this.currentActiveItem.remove();
        break;
    }
    this.currentActiveItem.position = position;
  }


  //----------------------- general methods --------------------------------------
  // return center position of canvas
  getCenterPosition(){
    return new Point({x: this.canvasElement.clientWidth/2, y:this.canvasElement.clientHeight/2});
  }

  // helper to set stroke and fill
  setStrokeAndFill(item){
    item.strokeWidth = this.strokeWidth;
    item.strokeColor = this.strokeColor;
    item.fillColor = this.fillColor;
  }
}

export default MyCanvas;
