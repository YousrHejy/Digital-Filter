var zerosMain = [];
var polesMain = [];
let allPassPolesIndicies = []; // here we take the index with its next as they are pushed as pole and then the zero of the all pass filter
let plot = new plotting();
let plane = new ZPlane();
let outputSignalPhase;
function updatefrequencyresponse(
  zeros,
  poles,
  context,
  divMagnitude,
  divPhase,
  label
) {
  console.log("poles is sent ");
  
  let modify = 0;
  if (context != 0) {
    modify = 1;
  }
  plane.sendZerosPoles(zeros, 0, modify);
  plane.sendZerosPoles(poles, 1, modify);
  $.ajax({
    url: "/sendfrequencyresposedata",
    type: "get",
    success: function (response) {
      data = response;
      magnitude = data.magnitude;
      w = data.w;
      angle = data.angle;
      if (context==0){
     
      plot.plotAllpass(w, angle, 'All pass graph', 'phasePlotting', "phase");
    }
    else {
        outputSignalPhase=angle
        plot.plot(w, magnitude, divMagnitude, label);
        plot.plot(w, angle, divPhase, label);
        context.clearRect(0, 0, cw, ch);
        plane.drawPlane(context);
        plane.drawElements(context, zeros, poles, "#0000FF", 0, 1);
    }
    plot.plotAllpass(w, outputSignalPhase, 'signal phase', "signalPhasePlotting", "phase");
    },
  });
}
