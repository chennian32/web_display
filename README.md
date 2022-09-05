# web_display
html5 canvas display ROI draw ROI and node edit
## display ROI
``` javascript
      let image = new Image();
      image.src = "1.jpg";
      image.onload = function () {
          let canvas = document.getElementById("mycanvas");
          let display = new Display(canvas, true);
          display.disableDisplay();
          display.addRect2Display(200, 200, -10, 100, 100, "#ff000080");
          display.addEllipseDisplay(300, 300, -85, 200, 100, "#00ff0080");
          display.addRect1Display(500, 500, 400, 400, "#00ff0080");
          display.addLineDisplay(0, 500, 800, 200, "#0000ff80");
          display.addHLineDisplay(300, "#00ff0080");
          display.addVLineDisplay(300, "#00ffff80");
          display.addCircleDisplay(50, 500, 50, "#ffff0080");
          display.addEllipseRingDisplay(100, 130, -20, 100, 100, 0, 250, 20, "#00ffff80");
          display.addCircleRingDisplay(540, 330, 150, 0, 360, 20, "#ff00ff80");
          display.addStringDisplay(150, 150, "#ffff00ff", "用于显示", 40, "微软雅黑");
          display.addRegionDisplay([new Point(20, 20), new Point(400, 0), new Point(200, 500)], [
              [new Point(150, 300), new Point(300, 150), new Point(200, 400)]
          ], "#0000ff80");
          display.setDisplayImage(image);
          display.enableDisplay();
          display.render();
      }
```
![display_roi_image](https://github.com/chennian32/web_display/blob/main/displayroi.png)
## draw ROI
``` javascript
      let image = new Image();
      image.src = "1.jpg";
      image.onload = function () {
          let canvas = document.getElementById("mycanvas");
          let display = new ROIDrawDisplay(canvas, true);
          display.setDrawParam(Shape.Rect1Shape, "#00ff0080", 10, 5, 100);
          display.setDisplayImage(image);
          display.addRect2ROI(100, 100, 0, 100, 100, "#00ff0080");
          display.addRect2ROI(200, 200, 0, 100, 100, "#00ff0080");
          // display.getInformation=function(info){
          //     console.log(info.x.toString()+":"+info.y.toString());
          // }
          display.selectOneROI(1);
          display.enableDisplay();
          display.render();
          //display.copyROI();
          //display.draw(Shape.PolygonShape);
          //display.measure();
          display.draw(Shape.PolygonShape);
          display.endDraw=function(roi){
              console.log(JSON.stringify(roi));
          }
          display.endModify=function(roi){
              console.log(JSON.stringify(roi));
          }
      }
```
![drawroi_roi_image](https://github.com/chennian32/web_display/blob/main/drawroi.png)
## node edit
``` javascript
      window.onload=function(){
        let canvas = document.getElementById("mycanvas");
        let scene = new NodeScene();
        let display = new NodeDisplay(canvas,scene);
        let node1 = scene.createNode("测试1111",300,200,"1.svg");
        let i1 = node1.addInput("输入1");
        let i2 = node1.addInput("输入2");
        let o1 = node1.addOutput("输出1");
        let o2 = node1.addOutput("输出2");
        let node2= scene.createNode("测试2222222",500,300,"2.svg");
        let i3 = node2.addInput("输入3");
        let i4 = node2.addInput("输入4");
        let o3 = node2.addOutput("输出3");
        let o4 = node2.addOutput("输出4");
        let node3 = scene.createNode("测试333333",800,300,"3.svg");
        let i5 = node3.addInput("输入5");
        let o6 = node3.addOutput("输出5");
        scene.createConnection(o1,i3);
        scene.createConnection(o2,i4);
        scene.createConnection(o4,i5);
        display.enableDisplay();
        display.render();
        let nr = new NodeRunner(scene);
        nr.apply(function(e){
            console.log(e.name);
        });
      }
```
![node_edit_image](https://github.com/chennian32/web_display/blob/main/nodeedit.png)
