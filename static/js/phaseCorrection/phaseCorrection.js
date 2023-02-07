// var xArray = [50,60,70,80,90,100,110,120,130,140,150];
// var yArray = [7,8,8,9,9,9,10,11,14,14,15];

// // Define Data
// var data = [{
//   x: xArray,
//   y: yArray,
//   mode:"lines"
// }];

// // // Define Layout
// var layout = {
//   xaxis: {range: [40, 160], title: "Square Meters"},
//   yaxis: {range: [5, 16], title: "Price in Millions"},
//   title: "House Prices vs. Size"
// };

// // // Display using Plotly
// Plotly.newPlot("myPlot", data, layout);

// let allPass = document.querySelectorAll("button");
// allPass[5].addEventListener("click", () => {
//   window.open("/phaseCorrection");
//   plane.drawPlane(phasePlotting);
// });
// let phasePlotting = document.getElementById("phasePlot");
// phasePlotting = phasePlotting.getContext("2d");
// let plane = new ZPlane();

let realInput = document.getElementById("realInput");
let plot = new plotting();
let imaginaryInput = document.getElementById("imaginaryInput");
let realValue, imaginaryValue;
let zeroZplane=[];
let poleZplane=[];
// plane.drawPlane(phasePlotting);
plot.plot([], [], "phase Correction graph", "signalPhasePlotting", "phase");
plot.plot([], [], "All pass phase", "phasePlotting", "phase");
// plot.plot(
//   [1, 2, 3, 4, 5, 6],
//   [2, 4, 5, 6, 7, 9],
//   "signal phase Correction ",
//   "signalPhasePlotting",
//   "phase"
// );

let examplesBox = document.getElementById("examplesCheckBox");
let samples=document.getElementById("samples")

function examplesFunction() {
  if (examplesBox.checked) {
    let value=samples.value
    value=value.split('+')
    realInput.value=value[0]
    imaginaryInput.value=value[1].split('j')[0]
    plottingMagnitudePhase()

  }
  else{
    realInput.addEventListener("keydown", () => {
      setTimeout(plottingMagnitudePhase, 0.1);
    });
    imaginaryInput.addEventListener("keydown", () => {
      setTimeout(plottingMagnitudePhase, 0.1);
    });
  }
  var a=new Complex(realInput.value, imaginaryInput.value);
  myFunction(a);
}
function getvalues(element){
  return ([((element[0] +150) * 100), ((element[1] + 150) * 100)])
}
function myFunction(element) {
  var table = document.getElementById("table");
  var row = table.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  cell1.innerHTML = element;
  cell2.innerHTML = "delete";
  zeroZplane.push(zeros);
  poleZplane.push(poles);
  console.log( zeroZplane);
  for(var i = 0; i < table.rows.length; i++)
  {
      console.log(table.rows[i]);
      table.rows[i].cells[1].onclick = function()
      
      {
          
              index = this.parentElement.rowIndex;
              table.deleteRow(index);
              zeroZplane.splice(zeroZplane.indexOf([element.re,element.img]), 1);
              poleZplane.splice(poleZplane.indexOf([element.re,element.img]), 1);
              console.log( "s");
              console.log( zeroZplane);
          
          //console.log(index);
      };
      
  }
}




function plottingMagnitudePhase() {
  realValue = parseFloat(realInput.value);
  imaginaryValue = parseFloat(imaginaryInput.value);
  if (isNaN(realValue)) realValue = 0;
  if (isNaN(imaginaryValue)) imaginaryValue = 0;
  zeros = [realValue, imaginaryValue];
  poles = zeros.map((x) => (x * 1) / (zeros[0] ** 2 + zeros[1] ** 2));
  zeros = [zeros, [0, 0]];
  poles = [poles, [0, 0]];
  // console.log(poles);
  updatefrequencyresponse(
    poles,
    zeros,
    "signalPhasePlotting",
    "phasePlotting",
    "All pass filter graph"
  );
}

function updatefrequencyresponse(zeros, poles, divMagnitude, divPhase, label) {
  plot.sendZerosPoles(zeros, 0);
  plot.sendZerosPoles(poles, 1);
  console.log("poles is sent ");
  // console.log(zeros);
  // console.log(poles);
  $.ajax({
    url: "/sendfrequencyresposedata",
    type: "get",
    success: function (response) {
      data = response;
      magnitude = data.magnitude;
      w = data.w;
      angle = data.angle;
      plot.plot(w, magnitude, label, divMagnitude, "magnitude");
      plot.plot(w, angle, label, divPhase, "phase");
    },
  });
}
