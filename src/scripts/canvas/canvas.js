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

    // set up the Konva Stage and Layer 
    this.stage = new Stage({
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

  // prepObject(stage, layer, queenKonvaImg) {
  //   let group = new Group({
  //       x: 300,
  //       y: 200,
  //       draggable: true,
  //   });

  //   let tr1 = new Konva.Transformer({
  //     nodes: [group],
  //     centeredScaling: false,
  //     rotationSnaps: [0, 90, 180, 270],
  //     resizeEnabled: true,
  //   });
    
  //   stage.add(layer);
  //   layer.add(group);
  //   layer.add(tr1);

  // }

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

    let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });
    
    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(queenKonvaImg);

    let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr1.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr1.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr1.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr1.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr1.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr1.nodes().concat([e.target]);
          tr1.nodes(nodes);
        }
        layer.draw();
      });

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

    let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(sofaKonvaImg);

    let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr1.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr1.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr1.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr1.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr1.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr1.nodes().concat([e.target]);
          tr1.nodes(nodes);
        }
        layer.draw();
      });

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

    let tr = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr);
    group.add(KonvaImg);

    let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr.nodes().concat([e.target]);
          tr.nodes(nodes);
        }
        layer.draw();
      });

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

    let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(rugKonvaImg);

    let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr1.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr1.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr1.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr1.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr1.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr1.nodes().concat([e.target]);
          tr1.nodes(nodes);
        }
        layer.draw();
      });

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

     let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(KonvaImg);

    let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr.nodes().concat([e.target]);
          tr.nodes(nodes);
        }
        layer.draw();
      });

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

    let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(KonvaImg);

    let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr1.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr1.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr1.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr1.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr1.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr1.nodes().concat([e.target]);
          tr1.nodes(nodes);
        }
        layer.draw();
      });

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

    let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(KonvaImg);

    let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr1.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr1.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr1.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr1.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr1.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr1.nodes().concat([e.target]);
          tr1.nodes(nodes);
        }
        layer.draw();
      });

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

    let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(KonvaImg);

  let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr1.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr1.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr1.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr1.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr1.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr1.nodes().concat([e.target]);
          tr1.nodes(nodes);
        }
        layer.draw();
      });

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

    let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(KonvaImg);

    let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr1.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr1.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr1.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr1.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr1.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr1.nodes().concat([e.target]);
          tr1.nodes(nodes);
        }
        layer.draw();
      });

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

    let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(KonvaImg);

    let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr1.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr1.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr1.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr1.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr1.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr1.nodes().concat([e.target]);
          tr1.nodes(nodes);
        }
        layer.draw();
      });

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

    let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(KonvaImg);

   let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr1.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr1.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr1.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr1.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr1.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr1.nodes().concat([e.target]);
          tr1.nodes(nodes);
        }
        layer.draw();
      });

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

    let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(KonvaImg);

   let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr1.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr1.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr1.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr1.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr1.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr1.nodes().concat([e.target]);
          tr1.nodes(nodes);
        }
        layer.draw();
      });

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

    let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(KonvaImg);

   let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr1.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr1.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr1.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr1.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr1.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr1.nodes().concat([e.target]);
          tr1.nodes(nodes);
        }
        layer.draw();
      });

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

    let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(KonvaImg);

    let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr1.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr1.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr1.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr1.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr1.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr1.nodes().concat([e.target]);
          tr1.nodes(nodes);
        }
        layer.draw();
      });

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

    let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(fireKonvaImg);

  let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr1.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr1.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr1.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr1.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr1.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr1.nodes().concat([e.target]);
          tr1.nodes(nodes);
        }
        layer.draw();
      });

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

    let tr1 = new Konva.Transformer({
      nodes: [group],
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: true,
    });

    stage.add(layer);
    layer.add(group);
    layer.add(tr1);
    group.add(stairKonvaImg);

    let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
      });
      group.add(selectionRectangle);

      let x1, y1, x2, y2;
      stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on eny shape
        if (e.target !== stage) {
          return;
        }
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });

      stage.on('mousemove touchmove', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
        layer.batchDraw();
      });

      stage.on('mouseup touchend', () => {
        // no nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        let shapes = stage.find('.rect').toArray();
        let box = selectionRectangle.getClientRect();
        let selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr1.nodes(selected);
        layer.batchDraw();
      });

      // clicks should select/deselect shapes
      stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
          tr1.nodes([]);
          layer.draw();
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr1.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr1.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr1.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr1.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr1.nodes().concat([e.target]);
          tr1.nodes(nodes);
        }
        layer.draw();
      });

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