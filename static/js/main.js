let zplanecanvas = document.getElementById("zplanecanvas");
let ctxzplane = zplanecanvas.getContext("2d");
let $canvas = $("#zplanecanvas");
let canvasOffset = $canvas.offset();
let offsetX = canvasOffset.left;
let offsetY = canvasOffset.top;
let cw = zplanecanvas.width;
let ch = zplanecanvas.height;
let plane = new ZPlane();
let plt = new Plot();
let isDown = false;
let lastX;
let lastY;
let flag=0;
let type = "zeros";
let zeros = [];
let poles = [];
let data=[];
let draggingelement = -1;
let i;
let a=[];
let b=[];
// update plot
plt.plot([], [], "output-magnitude", "");
plt.plot([], [], "output-phase", "");
// ZPlane circle
plane.drawPlane(ctxzplane);

// flag to indicate a drag is in process
// and the last XY position that has already been processed
function changePole(){
  flag=0;
  type="zeros";
}
function changeZero() {
  flag=1;
  type="poles";
}
function updatefrequencyresponse(zeros, poles,context, div, label) {
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
      plt.plot(w, magnitude, div, label);
      //plt.plot(w, angle, div, label);
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
  updatefrequencyresponse(zeros,poles,ctxzplane,"output-magnitude", "",flag);
 // updatefrequencyresponse(zeros,poles,ctxzplane,"output-phase", "");
}

function handleMouseUp(e) {
  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();
  // stop the drag
  isDown = false;
}

// function handleMouseMove(e) {
//   e.preventDefault();
//   e.stopPropagation();

//   // get the current mouse position
//   mouseX = parseInt(e.clientX - offsetX);
//   mouseY = parseInt(e.clientY - offsetY);

//   // calculate how far the mouse has moved
//   // since the last mousemove event was processed
//   let dx = mouseX - lastX;
//   let dy = mouseY - lastY;

//   // reset the lastX/Y to the current mouse position
//   lastX = mouseX;
//   lastY = mouseY;

//   // change the target circles position by the
//   // distance the mouse has moved since the last
//   // mousemove event
//   draggingelement[0] += dx;
//   draggingelement[1] += dy;


//   $("#coordinates").html("(" + ((lastX - 150) / 100) + "," + (-(lastY - 150) / 100) + ")");
  
//   updatefrequencyresponse(zeros,poles,ctxzplane,"output-magnitude", "");
//   //updatefrequencyresponse(zeros,poles,ctxzplane,"output-phase", "");
// }
document
  .getElementById("zplanecanvas")
  .addEventListener("mousedown", function(e) {
    handleMouseDown(e);
  });
// document
//   .getElementById("zplanecanvas")
//   .addEventListener("mousemove", function(e) {
//     handleMouseMove(e);

//   });
document.getElementById("zplanecanvas").addEventListener("mouseup", function(e) {
  handleMouseUp(e);
  updatefrequencyresponse(zeros,poles,ctxzplane,"output-magnitude", "",flag);
 // updatefrequencyresponse(zeros,poles,ctxzplane,"output-phase", "");

});
document
  .getElementById("zplanecanvas")
  .addEventListener("mouseout", function(e) {
    handleMouseUp(e);
  })
  