    
    
    // export default updateAnchor(activeAnchor) {
    //     debugger
    //     let group = activeAnchor.getParent();

    //     let topLeft = group.get('.topLeft')[0];
    //     let topRight = group.get('.topRight')[0];
    //     let bottomRight = group.get('.bottomRight')[0];
    //     let bottomLeft = group.get('.bottomLeft')[0];
    //     let image = group.get('Image')[0];

    //     let anchorX = activeAnchor.getX();
    //     let anchorY = activeAnchor.getY();

    //     switch (activeAnchor.g()) {
    //       case 'topLeft':
    //         topRight.y(anchorY);
    //         bottomLeft.x(anchorX);
    //         break;
    //       case 'topRight':
    //         topLeft.y(anchorY);
    //         bottomRight.x(anchorX);
    //         break;
    //       case 'bottomRight':
    //         bottomLeft.y(anchorY);
    //         topRight.x(anchorX);
    //         break;
    //       case 'bottomLeft':
    //         bottomRight.y(anchorY);
    //         topLeft.x(anchorX);
    //         break;
    //     }
    //     image.position(topLeft.position());

    //     let width = topRight.getX() - topLeft.getX();
    //     let height = bottomLeft.getY() - topLeft.getY();
    //     if (width && height) {
    //       image.width(width);
    //       image.height(height);
    //     }
    //   }
      
    // export default addAnchor(group, x, y, name) {
    //   let stage = group.getStage();
    //   let layer = group.getLayer();
    //   let anchor = new Circle({
    //     x: x,
    //     y: y,
    //     stroke: '#000',
    //     fill: 'blue',
    //     strokeWidth: 1.5,
    //     radius: 4,
    //     name: name,
    //     draggable: true,
    //   });

    //   anchor.on('dragmove', function () {
    //     console.log(this);
    //     debugger
    //     this.updateAnchor(this);
    //     layer.draw();

    //   });

    //   anchor.on('mousedown touchstart', function () {
    //     group.draggable(false);
    //     this.moveToTop();
    //   });

    //   anchor.on('dragend', function () {
    //     group.draggable(true);
    //     layer.draw();
    //   });

    //   // add hover styling
    //   anchor.on('mouseover', function () {
    //     let layer = this.getLayer();
    //     document.body.style.cursor = 'pointer';
    //     this.strokeWidth(3);
    //     layer.draw();
    //   });

    //   anchor.on('mouseout', function () {
    //     let layer = this.getLayer();
    //     document.body.style.cursor = 'default';
    //     this.strokeWidth(2);
    //     layer.draw();
    //   });
    //   group.add(anchor);
    // }