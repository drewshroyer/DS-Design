export default class Sidebar {
  constructor(categoryObj, sidebarElement, onShapeClickCallback) {
    this.categoryTitle = categoryObj.categoryName;
    this.shapes = categoryObj.shapes;
    this.sidebarElement = sidebarElement;
    this.onShapeClickCallback = onShapeClickCallback;
    this.draw();
    this.shapeClickListener = this.shapeClickListener.bind(this);
  }

  shapeClickListener(shapeName) {
    return (e) => {
      this.onShapeClickCallback(shapeName);
    };
  }

  draw() {
    //adds category title in sidebar
      const categoryTitleElement = document.createElement("h1");
      categoryTitleElement.innerHTML = this.categoryTitle;
      categoryTitleElement.setAttribute("class", "sidebar-category-title");
      this.sidebarElement.appendChild(categoryTitleElement);

    //adds category shapes in sidebar
    const shapesUlElement = document.createElement("ul");
    shapesUlElement.setAttribute("class", "sidebar-category-shapes-ul");
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      const shapeLiElement = document.createElement("li");
      const newContent = document.createTextNode(shape.name);
      shapeLiElement.appendChild(newContent);  
      shapeLiElement.setAttribute("class", "sidebar-category-shapes-li");
      shapeLiElement.addEventListener(
        "click",
        this.shapeClickListener(shape.name)
      );
      const shapeImageElement = document.createElement("img");
      shapeImageElement.setAttribute("class", "sidebar-category-images");
      shapeImageElement.src = shape.uri;
      shapeLiElement.appendChild(shapeImageElement);
      shapesUlElement.appendChild(shapeLiElement);
    }
    this.sidebarElement.appendChild(shapesUlElement);
  }
}
