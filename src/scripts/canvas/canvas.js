import { SHAPES } from "../util/constants";
import paper, { Project, tool, Tool, Rectangle, Point } from 'paper';
import Konva from 'konva';
import { Group, Layer, Stage, Circle } from 'konva';

class MyCanvas {
  constructor(canvasElement) {
    this.canvasElement =  canvasElement;
    this.strokeColor = 'black';
    this.fillColor = "white";
    this.defaultSize = [100,100];
    this.currentActiveItem = null;
    this.strokeWidth = 2;
    paper.setup(canvasElement);
    this.project = new Project(canvasElement)
    this.canvasScaleValue = 1;
    this.tool = new Tool();
    tool.minDistance = 2;
    this.stage = new Konva.Stage({
      container: 'konvaContainer',
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.layer = new Layer();


    //shapes method binding
    this.drawShapes = this.drawShapes.bind(this);
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
    this.drawSofa = this.drawSofa.bind(this);

    // anchor binding
    this.addAnchor = this.addAnchor.bind(this);
    this.update = this.update.bind(this);
    this.addText = this.addText.bind(this);

     //add double click listener on canvas because tool have no double click listener
    this.canvasElement.addEventListener("dblclick", this.onToolDoubleClick);

    //set right menu liteners
    this.setMenuClickListener = this.setMenuClickListener.bind(this);

    this.setMenuClickListener();
  }

  setMenuClickListener(){
    const downloadFileElement = document.getElementById('download-file');
    downloadFileElement.addEventListener('click', this.downloadAsSVG.bind(this));
  }

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

  downloadAsSVG() {
    if(this.project.activeLayer.children.length == 0) return;
    const fileName = `ad_design_${Date.now()}.svg`;
    let url = "data:image/svg+xml;utf8," + encodeURIComponent(this.project.exportSVG({asString:true}));
    let downloadLinkElement = document.createElement("a");
    downloadLinkElement.download = fileName;
    downloadLinkElement.href = url;
    downloadLinkElement.click();
 }

  drawShapes(shapeName){

    switch (shapeName) {  
      case SHAPES.QUEEN:
        this.drawQueen(this.stage, this.layer);
        break;
      case SHAPES.TWIN:
        this.drawTwin(this.stage, this.layer);
        break;
      case SHAPES.RUG:
        this.drawRug(this.stage, this.layer);
        break;
      case SHAPES.SOFA:
        this.drawSofa(this.stage, this.layer) ;
        break;
      case SHAPES.ROUNDRUG:
        this.drawRoundRug(this.stage, this.layer);
        break;
      case SHAPES.DINING:
        this.drawDining(this.stage, this.layer);
        break;
      case SHAPES.OFFICE:
        this.drawOffice(this.stage, this.layer);
        break;
      case SHAPES.TVCABINENT:
        this.drawTVCabinent(this.stage, this.layer);
        break;
      case SHAPES.ARMCHAIR:
        this.drawArmChair(this.stage, this.layer);
        break;
      case SHAPES.UPHOLSTERED:
        this.drawUpholstered(this.stage, this.layer);
        break;
      case SHAPES.ENDTABLE:
        this.drawEndTable(this.stage, this.layer);
        break;
      case SHAPES.ROUNDTABLE:
        this.drawRoundTable(this.stage, this.layer);
        break;
      case SHAPES.LOVESEAT:
        this.drawLoveSeat(this.stage, this.layer);
        break;
      case SHAPES.COFFEETABLE:
        this.drawCoffeeTable(this.stage, this.layer);
        break;
      case SHAPES.FIREPLACE:
        this.drawFirePlace(this.stage, this.layer);
        break;
      case SHAPES.STAIRS:
        this.drawStairs(this.stage, this.layer);
      default:
        break;
    }
  }

  drawQueen(stage, layer) {
    let queenImg = new Image();
     let queenKonvaImg = new Konva.Image({
      width: 61.9875776*2,
      height: 80*2,
    });
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });
    
    stage.add(layer);
    layer.add(group);
    group.add(queenKonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (61.9875776*2), 0, 'topRight');
    this.addAnchor(group, (61.9875776*2), (80*2), 'bottomRight');
    this.addAnchor(group, 0, (80*2), 'bottomLeft');

    queenImg.onload = function() {
      queenKonvaImg.image(queenImg)
      layer.draw();
    }
    queenImg.src = "src/images/queen-bed.svg";
  }

  drawSofa(stage, layer) {
    let height = 48.17;
    let width = 100;
    let sofaImg = new Image();

    let sofaKonvaImg = new Konva.Image({
      width: width*2,
      height: height*2,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(sofaKonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    sofaImg.onload = function() {
      sofaKonvaImg.image(sofaImg)
      layer.draw();
    }
    sofaImg.src = "src/images/sofa.svg";
  }


  drawTwin(stage, layer) {
    let height = 80;
    let width = 43.0017452;
    let Img = new Image();

    let KonvaImg = new Konva.Image({
      width: width*2,
      height: height*2,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(KonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    Img.onload = function() {
      KonvaImg.image(Img)
      layer.draw();
    }
    Img.src = "src/images/twin-bed.svg";
  }

  drawRug(stage, layer) {
    let height = 48.17;
    let width = 100;
    let rugImg = new Image();

    let rugKonvaImg = new Konva.Image({
      width: width*2,
      height: height*2,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(rugKonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    rugImg.onload = function() {
      rugKonvaImg.image(rugImg)
      layer.draw();
    }
 
    rugImg.src = "src/images/rug.svg";
  }

  drawRoundRug(stage, layer) {
    let height = 80;
    let width = 80;
    let Img = new Image();

    let KonvaImg = new Konva.Image({
      width: width*2,
      height: height*2,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(KonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    Img.onload = function() {
      KonvaImg.image(Img)
      layer.draw();
    }
    Img.src = "src/images/round-rug.svg";
  }

  drawDining(stage, layer) {
    let height = 80;
    let width = 80;
    let Img = new Image();

    let KonvaImg = new Konva.Image({
      width: width*2,
      height: height*2,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(KonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    Img.onload = function() {
      KonvaImg.image(Img)
      layer.draw();
    }
    Img.src = "src/images/dining-table.svg";
  }

  drawOffice(stage, layer) {
   let height = 47.0951157;
    let width = 80;
    let Img = new Image();

    let KonvaImg = new Konva.Image({
      width: width*2,
      height: height*2,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(KonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    Img.onload = function() {
      KonvaImg.image(Img)
      layer.draw();
    }
    Img.src = "src/images/office-desk.svg";
  }

  drawTVCabinent(stage, layer) {
    let height = 23.759;
    let width = 80;
    let Img = new Image();

    let KonvaImg = new Konva.Image({
      width: width*2,
      height: height*2,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(KonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    Img.onload = function() {
      KonvaImg.image(Img)
      layer.draw();
    }
    Img.src = "src/images/tv-cabinent.svg";
  }

  drawArmChair(stage, layer) {
    let height = 80;
    let width = 70.176;
    let Img = new Image();

    let KonvaImg = new Konva.Image({
      width: width*2,
      height: height*2,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(KonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    Img.onload = function() {
      KonvaImg.image(Img)
      layer.draw();
    }
    Img.src = "src/images/arm-chair.svg";
  }

  drawUpholstered(stage, layer) {
   let height = 80;
    let width = 70.176;
    let Img = new Image();

    let KonvaImg = new Konva.Image({
      width: width*2,
      height: height*2,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(KonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    Img.onload = function() {
      KonvaImg.image(Img)
      layer.draw();
    }
    Img.src = "src/images/upholstered-chair.svg";
  }

  drawEndTable(stage, layer) {
    let height = 40;
    let width = 38.3507;
    let Img = new Image();

    let KonvaImg = new Konva.Image({
      width: width*2,
      height: height*2,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(KonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    Img.onload = function() {
      KonvaImg.image(Img)
      layer.draw();
    }
    Img.src = "src/images/end-table.svg";
  }

  drawRoundTable(stage, layer) {
    let height = 80;
    let width = 80;
    let Img = new Image();

    let KonvaImg = new Konva.Image({
      width: width*2,
      height: height*2,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(KonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    Img.onload = function() {
      KonvaImg.image(Img)
      layer.draw();
    }
    Img.src = "src/images/round-table.svg";
  }

  drawLoveSeat(stage, layer) {
    let height = 47.7246654;
    let width = 80;
    let Img = new Image();

    let KonvaImg = new Konva.Image({
      width: width*2,
      height: height*2,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(KonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    Img.onload = function() {
      KonvaImg.image(Img)
      layer.draw();
    }
    Img.src = "src/images/love-seat.svg";
  }

  drawCoffeeTable(stage, layer) {
    let height = 43.0769231;
    let width = 80;
    let Img = new Image();

    let KonvaImg = new Konva.Image({
      width: width*2,
      height: height*2,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(KonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    Img.onload = function() {
      KonvaImg.image(Img)
      layer.draw();
    }
    Img.src = "src/images/coffee-table.svg";
  }

  drawFirePlace(stage, layer) {
    let height = 42.8456376;
    let width = 80;
    let fireImg = new Image();

    let fireKonvaImg = new Konva.Image({
      width: 80*2,
      height: 80,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(fireKonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    fireImg.onload = function() {
      fireKonvaImg.image(fireImg)
      layer.draw();
    }
    fireImg.src = "src/images/fire-place.svg";    
  }

  drawStairs(stage, layer) {
    let height = 80;
    let width = 42.8456376;
    let stairImg = new Image();
    let stairKonvaImg = new Konva.Image({
      width: (42.8456376*2),
      height: 80*2,
    });
    
    let group = new Group({
        x: 300,
        y: 200,
        draggable: true,
    });

    stage.add(layer);
    layer.add(group);
    // this.addText(height, width, group)
    group.add(stairKonvaImg);

    this.addAnchor(group, 0, 0, 'topLeft');
    this.addAnchor(group, (width*2), 0, 'topRight');
    this.addAnchor(group, (width*2), (height*2), 'bottomRight');
    this.addAnchor(group, 0, (height*2), 'bottomLeft');

    stairImg.onload = function() {
      stairKonvaImg.image(stairImg)
      layer.draw();
    }

    stairImg.src = "src/images/stairs.svg";
  }

  addText(height, width, group) {
    let heightFeet = Math.floor(height / 24);
    let heightInches = Math.floor(((height/24) - Math.floor(height / 24)) * 12) 
    let widthFeet = Math.floor(width / 24);
    let widthInches = Math.floor(((width/24) - Math.floor(width / 24)) * 12)

    let heightText = new Konva.Text({
        x: group.x() - 330,
        y: group.y() - 140,
        text: `${heightFeet}'${heightInches}"`,
        fontSize: 12,
        fontFamily: 'Lato',
        fill: 'black',
    });

    let widthText = new Konva.Text({
        x: group.x() - 265,
        y: group.y() -220,
        text: `${widthFeet}'${widthInches}"`,
        fontSize: 12,
        fontFamily: 'Lato',
        fill: 'black',
    });

    group.add(heightText);
    group.add(widthText);
  }

      update(activeAnchor) {
        debugger
        let group = activeAnchor.getParent();

        let topLeft = group.get('.topLeft')[0];
        let topRight = group.get('.topRight')[0];
        let bottomRight = group.get('.bottomRight')[0];
        let bottomLeft = group.get('.bottomLeft')[0];
        let image = group.get('Image')[0];

        let anchorX = activeAnchor.getX();
        let anchorY = activeAnchor.getY();

        switch (activeAnchor.getName()) {
          case 'topLeft':
            topRight.y(anchorY);
            bottomLeft.x(anchorX);
            break;
          case 'topRight':
            topLeft.y(anchorY);
            bottomRight.x(anchorX);
            break;
          case 'bottomRight':
            bottomLeft.y(anchorY);
            topRight.x(anchorX);
            break;
          case 'bottomLeft':
            bottomRight.y(anchorY);
            topLeft.x(anchorX);
            break;
        }
        image.position(topLeft.position());

        let width = topRight.getX() - topLeft.getX();
        let height = bottomLeft.getY() - topLeft.getY();
        if (width && height) {
          image.width(width);
          image.height(height);
        }
      }
      
    addAnchor(group, x, y, name) {
      let stage = group.getStage();
      let layer = group.getLayer();
      let anchor = new Circle({
        x: x,
        y: y,
        stroke: '#000',
        fill: 'blue',
        strokeWidth: .5,
        radius: 3,
        name: name,
        draggable: true,
      });

      anchor.on('dragmove', function () {
        // console.log(this);
        // debugger
        let activeAnchor = this;

        let group = activeAnchor.getParent();

        let topLeft = group.get('.topLeft')[0];
        let topRight = group.get('.topRight')[0];
        let bottomRight = group.get('.bottomRight')[0];
        let bottomLeft = group.get('.bottomLeft')[0];
        let image = group.get('Image')[0];

        let anchorX = activeAnchor.getX();
        let anchorY = activeAnchor.getY();

        switch (activeAnchor.getName()) {
          case 'topLeft':
            topRight.y(anchorY);
            bottomLeft.x(anchorX);
            break;
          case 'topRight':
            topLeft.y(anchorY);
            bottomRight.x(anchorX);
            break;
          case 'bottomRight':
            bottomLeft.y(anchorY);
            topRight.x(anchorX);
            break;
          case 'bottomLeft':
            bottomRight.y(anchorY);
            topLeft.x(anchorX);
            break;
        }
        image.position(topLeft.position());

        let width = topRight.getX() - topLeft.getX();
        let height = bottomLeft.getY() - topLeft.getY();
        if (width && height) {
          image.width(width);
          image.height(height);
        }

        layer.draw();

      });

      anchor.on('mousedown touchstart', function () {
        group.draggable(false);
        this.moveToTop();
      });

      anchor.on('dragend', function () {
        group.draggable(true);
        layer.draw();
      });

      // add hover styling
      anchor.on('mouseover', function () {
        let layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.strokeWidth(6);
        layer.draw();
      });

      anchor.on('mouseout', function () {
        let layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.strokeWidth(2);
        layer.draw();
      });
      group.add(anchor);
    }
  
  setStrokeAndFill(item){
    item.strokeWidth = this.strokeWidth;
    item.strokeColor = this.strokeColor;
    item.fillColor = this.fillColor;
  }

}

export default MyCanvas;