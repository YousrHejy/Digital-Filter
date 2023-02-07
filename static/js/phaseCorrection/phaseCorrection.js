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
// plane.drawPlane(phasePlotting);
plot.plot([], [], "phase Correction graph", "magnitudePlotting", "magnitude");
plot.plot(
  [1, 2, 3, 4, 5, 6],
  [2, 4, 5, 6, 7, 9],
  "phase Correction graph",
  "magnitudePlotting",
  "Magnitude"
);

plot.plot([], [], "phase Correction graph", "phasePlotting", "phase");

realInput.addEventListener("keydown", () => {
  setTimeout(plottingMagnitudePhase, 0.1);
});
imaginaryInput.addEventListener("keydown", () => {
  setTimeout(plottingMagnitudePhase, 0.1);
});

function plottingMagnitudePhase() {
  realValue = parseFloat(realInput.value);
  imaginaryValue = parseFloat(imaginaryInput.value);
  if (isNaN(realValue)) realValue = 0;
  if (isNaN(imaginaryValue)) imaginaryValue = 0;
  zeros = [realValue, imaginaryValue];
  poles = zeros.map( x=> x*1/(zeros[0] ** 2 + zeros[1] ** 2));
  zeros=[zeros,[0,0]]
  poles=[poles,[0,0]]
  console.log(poles);
  updatefrequencyresponse(
    poles,
    zeros,
    "magnitudePlotting",
    "phasePlotting",
    "All pass filter graph"
  );
}

function updatefrequencyresponse(zeros, poles, divMagnitude, divPhase, label) {
  plot.sendZerosPoles(zeros, 0);
  plot.sendZerosPoles(poles, 1);
  console.log("poles is sent ");
  console.log(zeros);
  console.log(poles);
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
