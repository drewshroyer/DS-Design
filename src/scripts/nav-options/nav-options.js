class MenuOptions {
  constructor() {
    this.setMenuClickListener = this.setMenuClickListener.bind(this);
    this.setMenuClickListener();
  }

  setMenuClickListener() {
    const openFileElement = document.getElementById("open-file");
    const downloadFileElement = document.getElementById("download-file");
    const bringToFrontElement = document.getElementById("bring-to-front");
    const moveToBackElement = document.getElementById("move-to-back");

    openFileElement.addEventListener("click", this.openFile.bind(this));
    downloadFileElement.addEventListener(
      "click",
      this.downloadAsSVG.bind(this)
    );
    bringToFrontElement.addEventListener("click", this.bringToFront.bind(this));
    moveToBackElement.addEventListener("click", this.moveToBack.bind(this));
  }

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

  downloadAsSVG() {
    if (this.project.activeLayer.children.length == 0) return;
    const fileName = `RoomPlan_${Date.now()}.svg`;

    var url =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(this.project.exportSVG({ asString: true }));
    var downloadLinkElement = document.createElement("a");
    downloadLinkElement.download = fileName;
    downloadLinkElement.href = url;
    downloadLinkElement.click();
  }
}

export default MenuOptions;