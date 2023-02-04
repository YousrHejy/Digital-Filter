let zplanecanvas = document.getElementById("zplanecanvas");
let ctxzplane = zplanecanvas.getContext("2d");
let $canvas = $("#zplanecanvas");
let canvasOffset = $canvas.offset();
let offsetX = canvasOffset.left;
let offsetY = canvasOffset.top;
let cw = zplanecanvas.width;
let ch = zplanecanvas.height;
let plane = new ZPlane();
let isDown = false;
let lastX=0;
let lastY=0;
let flag=0;
let type = "zeros";
let zeros = [];
let poles = [];
let dataY=[];
let draggingelement = [];
let xAxis=[];
let yAxis=[];
let ySend;
let i=0;
// update plot
let plt = new Plot();
plt.plot([], [], "output-magnitude", "");
plt.plot([], [], "output-phase", "");

// ZPlane circle
plane.drawPlane(ctxzplane);
function getCursorPosition(event) { 
    let yCursor = event.clientY;
    i+=1;
    xAxis.push(i);
    yAxis.push(yCursor);
    ySend={'y_axis':yAxis}
    $.ajax({
      url: '/getSignals',
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(ySend),
      success: function (response) {
          dataY=response.yAxisData;
        
      },
  });
  if(xAxis.length>30){
    xAxis.shift();
    yAxis.shift();
    dataY.shift();
}
  console.log(dataY);
  plt.plot(xAxis,yAxis, "signal", "");
  plt.plot(xAxis,dataY, "output", "");
    }
function changePole(){
  flag=0;
  type="zeros";
}
function changeZero() {
  flag=1;
  type="poles";
}
function deleteFreq() {
  if (flag==0){
    zeros.splice(hit, 1);
    updatefrequencyresponse(zeros,poles,ctxzplane,"output-magnitude","output-phase", "",flag);
  }else{
  poles.splice(hit, 1);
  updatefrequencyresponse(zeros,poles,ctxzplane,"output-magnitude","output-phase", "",flag);
  }
} 
function updatefrequencyresponse(zeros, poles,context, divMagnitude,divPhase, label) {
  plane.sendZerosPoles(zeros,0);
  plane.sendZerosPoles(poles,1);
  $.ajax({
      url: "/sendfrequencyresposedata",
      type: "get",
      success: function (response) {
      data = response;
      magnitude = data.magnitude;
      w = data.w;
      angle = data.angle;
      plt.plot(w, magnitude, divMagnitude, label);
      plt.plot(w, angle, divPhase, label);
      context.clearRect(0, 0, cw, ch);
      plane.drawPlane(context)
  
      plane.drawElements(context, zeros,poles,"#0000FF",0,1);
    
    
      },
  });
}

// mouseHandler Function
function handleMouseDown(e) {
  let array=[];
  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();
  // save the mouse position
  // in case this becomes a drag operation
  lastX = parseInt(e.clientX - offsetX);
  lastY = parseInt(e.clientY - offsetY);
  hit = -1;
  // hit test all existing zeros
  if(type=="zeros"){
    array=zeros;
  }else{
    array=poles;
  }
  for (let i = 0; i < array.length; i++) {
    let element = array[i];
    let dx = lastX - element[0];
    let dy = lastY - element[1];
    if (dx * dx + dy * dy < 6 * 6) {
      hit = i;
      hittype=type;
      $("#coordinates").html("(" + ((element[0] - 150) / 100) + "," + (-(element[1] - 150) / 100) + ")");
    }
  }
  if (hit < 0) {
      hittype = type;
      hit = array.length
      array.push([lastX, lastY]);
    $("#coordinates").html("(" + ((lastX - 150) / 100) + "," + (-(lastY - 150) / 100) + ")");
  } else {
    draggingelement = array[hit];
    isDown = true;
  }
  updatefrequencyresponse(zeros,poles,ctxzplane,"output-magnitude","output-phase", "",flag);
}


function handleMouseMove(e) {
  // if we're not dragging, just exit
  if (!isDown) {
    return;
  }

  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();

  // get the current mouse position
  mouseX = parseInt(e.clientX - offsetX);
  mouseY = parseInt(e.clientY - offsetY);

  // calculate how far the mouse has moved
  // since the last mousemove event was processed
  let dx = mouseX - lastX;
  let dy = mouseY - lastY;

  // reset the lastX/Y to the current mouse position
  lastX = mouseX;
  lastY = mouseY;

  // change the target circles position by the
  // distance the mouse has moved since the last
  // mousemove event
  draggingelement[0] += dx;
  draggingelement[1] += dy;


  $("#coordinates").html("(" + ((lastX - 150) / 100) + "," + (-(lastY - 150) / 100) + ")");
  // redraw all the circles
  updatefrequencyresponse(zeros,poles,ctxzplane,"output-magnitude","output-phase", "",flag);

}
function handleMouseUp(e) {
  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();
  // stop the drag
  isDown = false;
}
document
  .getElementById("zplanecanvas")
  .addEventListener("mousedown", function(e) {
    handleMouseDown(e);
  });
  document
  .getElementById("zplanecanvas")
  .addEventListener("mousemove", function(e) {
    handleMouseMove(e);
  });
document.getElementById("zplanecanvas").addEventListener("mouseup", function(e) {
  handleMouseUp(e);
  updatefrequencyresponse(zeros,poles,ctxzplane,"output-magnitude","output-phase", "",flag);

});
document
  .getElementById("zplanecanvas")
  .addEventListener("mouseout", function(e) {
    handleMouseUp(e);
  })
  