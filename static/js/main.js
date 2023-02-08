let zplanecanvas = document.getElementById("zplanecanvas");
let uploadSignal=document.querySelector("#uploadfile");
let uploadFilter=document.querySelector("#uploadfilter");
let ctxzplane = zplanecanvas.getContext("2d");
let $canvas = $("#zplanecanvas");
let canvasOffset = $canvas.offset();
let offsetX = canvasOffset.left;
let offsetY = canvasOffset.top;
let cw = zplanecanvas.width;
let ch = zplanecanvas.height;
let isDown = false;
let lastX = 0;
let lastY = 0;
let flag = 0;
let type = "zeros";
let hit;
let dataY = [];
let draggingelement = [];
let xAxis = [];
let xdata=[];
let ydata=[];
let yAxis = [];
let zeroimport=[];
let poleimport=[];
let ySend;
let i = 0;
let yValue = [];
// update plot
let plt = new plotting();
plt.plot([], [], "output-magnitude", "");
plt.plot([], [], "output-phase", "");

// ZPlane circle
plane.drawPlane(ctxzplane);

document.getElementById("btn_3").addEventListener("click", function () {
  document.getElementById("cat").style.display = "block";
  document.getElementById("first-page").style.display = "none";
  console.log("suceesss");
});
function sendFlag(url_path) {
  datasent = { 'sendflag': 1 };
  console.log(flag);
  $.ajax({
    url: url_path,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(datasent),
    success: function (response) {
      console.log(response.sucess);
    },
  });
}

function exportFilter() {
  sendFlag("/exportFilter");
}
function sendSignal(x, y, flag) {
  let dataY = [];
  ySend = { y_axis: y };
  $.ajax({
    url: "/getSignals",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(ySend),
    success: function (response) {
      dataY = response.yAxisData;
      if (flag == 0) {
        plt.plot(x, dataY, "output", "");
      } else {
        plt.import_graph(x, y, dataY);
      }
    },
  })
}
function importFilter() {
  Papa.parse(uploadfilter.files[0], {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      console.log(results.data.length);
      console.log(results.data.zeros);
      for (i = 0; i < results.data.length; i++) { 
        var valueZero;
        var valuePole;
        if(results.data[i].zeros.length>0 || results.data[i].poles.length>0){
            valueZero=results.data[i].zeros.split('+');
            valueZero[1]=valueZero[1].split('j')[0]; 
            valuePole=results.data[i].poles.split('+');
            valuePole[1]=valuePole[1].split('j')[0]; 
        }else{
          valueZero=results.data[i].zeros;
          valuePole=results.data[i].poles;
        }
        
        zeroimport.push(valueZero);
        poleimport.push(valuePole);
        console.log(zeroimport);
      }
      zeroimport=zeroimport.map((x) => (x.map((y) => (parseFloat(y)))));
      zeroimport=zeroimport.map((x) => ([((x[0]*100)+150), ((-x[1]*100)+150)]));
      poleimport=poleimport.map((x) => (x.map((y) => (parseFloat(y)))));
      poleimport=poleimport.map((x) => ([((x[0]*100)+150), ((x[1]*100)+150)]));
      zeros=zeros.concat(zeroimport);
      poles=poles.concat(poleimport);
      updatefrequencyresponse(
        zeros,
        poles,
        ctxzplane,
        "output-magnitude",
        "output-phase",
        ""
      );
    
    }, 
    });
}
uploadFilter.addEventListener("change", () => {
  importFilter();
});

function getCursorPosition(event) {
  let yCursor = event.clientY;
  i += 1;
  xAxis.push(i);
  yAxis.push(yCursor);
  if (xAxis.length > 30) {
    xAxis.shift();
    yAxis.shift();
    yValue.shift();
  }
  sendSignal(xAxis, yAxis, 0);
  plt.plot(xAxis, yAxis, "signal", "");
}
function import_signal() {
  Papa.parse(uploadfile.files[0], {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      for (i = 0; i < results.data.length; i++) {
        xdata.push(parseFloat(results.data[i].x));
        ydata.push(parseFloat(results.data[i].y));
      }
      sendSignal(xdata, ydata, 1);
    },
  });
}
uploadSignal.addEventListener("change", () => {
  import_signal();
});

function changePole() {
  flag = 0;
  type = "zeros";
}
function changeZero() {
  flag = 1;
  type = "poles";
}
function deleteFreq() {
  if (flag == 0) {
    zerosMain.splice(hit, 1);
    updatefrequencyresponse(
      zerosMain,
      polesMain,
      ctxzplane,
      "output-magnitude",
      "output-phase",
      ""
    );
  } else {
    polesMain.splice(hit, 1);
    updatefrequencyresponse(
      zerosMain,
      polesMain,
      ctxzplane,
      "output-magnitude",
      "output-phase",
      ""
    );
  }
}

// mouseHandler Function
function handleMouseDown(e) {
  let array = [];
  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();
  // save the mouse position
  // in case this becomes a drag operation
  lastX = parseInt(e.clientX - offsetX);
  lastY = parseInt(e.clientY - offsetY);
  hit = -1;
  // hit test all existing zerosMain
  if (type == "zeros") {
    array = zerosMain;
  } else {
    array = polesMain;
  }
  for (let i = 0; i < array.length; i++) {
    let element = array[i];
    let dx = lastX - element[0];
    let dy = lastY - element[1];
    if (dx * dx + dy * dy < 6 * 6) {
      hit = i;
      hittype = type;
      $("#coordinates").html(
        "(" + (element[0] - 150) / 100 + "," + -(element[1] - 150) / 100 + ")"
      );
    }
  }
  if (hit < 0) {
    hittype = type;
    hit = array.length;
    array.push([lastX, lastY]);
    $("#coordinates").html(
      "(" + (lastX - 150) / 100 + "," + -(lastY - 150) / 100 + ")"
    );
  } else {
    draggingelement = array[hit];
    isDown = true;
  }
  updatefrequencyresponse(
    zerosMain,
    polesMain,
    ctxzplane,
    "output-magnitude",
    "output-phase",
    ""
  );
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

  $("#coordinates").html(
    "(" + (lastX - 150) / 100 + "," + -(lastY - 150) / 100 + ")"
  );
  // redraw all the circles
  updatefrequencyresponse(
    zerosMain,
    polesMain,
    ctxzplane,
    "output-magnitude",
    "output-phase",
    ""
  );
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
  .addEventListener("mousedown", function (e) {
    handleMouseDown(e);
  });
document
  .getElementById("zplanecanvas")
  .addEventListener("mousemove", function (e) {
    handleMouseMove(e);
  });
document
  .getElementById("zplanecanvas")
  .addEventListener("mouseup", function (e) {
    handleMouseUp(e);
    updatefrequencyresponse(
      zerosMain,
      polesMain,
      ctxzplane,
      "output-magnitude",
      "output-phase",
      ""
    );
  });
document
  .getElementById("zplanecanvas")
  .addEventListener("mouseout", function (e) {
    handleMouseUp(e);
  });
// ############################################### Phase######################################################
document.getElementById("btn_4").addEventListener("click", function () {

  document.getElementById("cat").style.display = "none";
  document.getElementById("first-page").style.display = "flex";
  console.log("suceesss");
});
let realInput = document.getElementById("realInput");
let imaginaryInput = document.getElementById("imaginaryInput");
let realValue, imaginaryValue;
let zeroZplane = [];
let poleZplane = [];
plot.plotAllpass([], [], "phase Correction graph", "signalPhasePlotting", "phase");
plot.plotAllpass([], [], "All pass phase", "phasePlotting", "phase");
let examplesBox = document.getElementById("examplesCheckBox");
let samples = document.getElementById("samples");
examplesFunction();

function examplesFunction() {
  if (examplesBox.checked) {
    let value = samples.value;
    value = value.split("+");
    realInput.value = value[0];
    imaginaryInput.value = value[1].split("j")[0];
    plottingMagnitudePhase();
  } else {
    realInput.addEventListener("change", () => {
      setTimeout(plottingMagnitudePhase, 0.1);
    });
    imaginaryInput.addEventListener("change", () => {
      setTimeout(plottingMagnitudePhase, 0.1);
    });
  }
}

function plottingMagnitudePhase() {
  realValue = parseFloat(realInput.value);
  imaginaryValue = parseFloat(imaginaryInput.value);
  if (isNaN(realValue)) realValue = 0;
  if (isNaN(imaginaryValue)) imaginaryValue = 0;
  zeroZplane = [realValue, imaginaryValue];
  poleZplane = zeroZplane.map((x) => (x * 1) / (zeroZplane[0] ** 2 + zeroZplane[1] ** 2));
  zeroZplane =[zeroZplane];
  poleZplane = [poleZplane];

  var a = new Complex(realInput.value, imaginaryInput.value);
  table(a);
  updatefrequencyresponse(
    poleZplane,
    zeroZplane,
    0,
    "signalPhasePlotting",
    "phasePlotting",
    "All pass graph"
  );
}

function table(element) {
  var table = document.getElementById("table");
  var row = table.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  cell1.innerHTML = element;
  cell2.innerHTML = "delete";
  for (var i = 0; i < table.rows.length; i++) {
    console.log(table.rows[i]);
    table.rows[i].cells[1].onclick = function () {
      index = this.parentElement.rowIndex;
      table.deleteRow(index);
      zeroZplane.splice(zeroZplane.indexOf([element.re, element.img]), 1);
      poleZplane.splice(poleZplane.indexOf([element.re, element.img]), 1);
      zerosMain.splice(zerosMain.indexOf([element.re, element.img]), 1);
      polesMain.splice(polesMain.indexOf([element.re, element.img]), 1);
    };
  }
}
function applyFilter() {
  console.log('zerosMain');
  console.log(zerosMain);
    zeroZplane = zeroZplane.map((x) => [
      x[0] * 100 + 150,
      -x[1] * 100 + 150,
    ]);
    poleZplane = poleZplane.map((x) => [
      x[0] * 100 + 150,
      -x[1] * 100 + 150,
    ]);
        zerosMain=zerosMain.concat(zeroZplane);
        polesMain=polesMain.concat(poleZplane);
  updatefrequencyresponse(
    zerosMain,
    polesMain,
    ctxzplane,
    "output-magnitude",
    "output-phase",
    ""
  );
}
