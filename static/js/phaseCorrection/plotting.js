class plotting {
  constructor() {}

  plotAllpass = (x, y, title, div, yTitle) => {
    let trace = {
      x: x,
      y: y,
      mode: "scatters",
    };
    let data = [trace];
    let layout = {
      height: 300,
      xaxis: { title: "frequency" },
      yaxis: { title: yTitle },
      title: title,
    };
    Plotly.newPlot(div, data, layout, { scrollZoom: true });
  };

  plot = (w, value, div, label) => {
    let trace = {
      x: w,
      y: value,
      type: "scatter",
      name: label,
      marker: {
        color: "#000000c5",
      },
    };
    let data = [trace];
    let layout = {
      // xaxis: {range: [40, 160], title: "Square Meters"},
      yaxis: {range: [0,300]},
      width: 470,
      height: 300,
      margin: {
        t: 20,
      },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
    };
    Plotly.newPlot(div, data, layout);
  };
  import_graph = (x_point, y_point, y_new_point) => {
  
    var arrayLength = 100;
    var YArray = [];
    var Y_newArray = [];
    var XArray = [];
    for (var i = 0; i < arrayLength; i++) {
      var y = y_point[i];
      var y_new = y_new_point[i];
      var x = x_point[i];
      YArray[i] = y;
      Y_newArray[i] = y_new;
      XArray[i] = x;
    }
    // return XArray, YArray, Y_newArray;
    this.plot(XArray, YArray, "signal", "");
    this.plot(XArray, Y_newArray, "output", "");
    var cnt = 0;
    var interval = setInterval(function () {
      var y = y_point[100 + cnt];
      YArray = YArray.concat(y);
      YArray.splice(0, 1);
      var y_new = y_new_point[100 + cnt];
      Y_newArray = Y_newArray.concat(y_new);
      Y_newArray.splice(0, 1);
      var x = x_point[100 + cnt];
      XArray = XArray.concat(x);
      XArray.splice(0, 1);
      var data_update = {
        x: [XArray],
        y: [YArray],
      };
      var new_data_update = {
        x: [XArray],
        y: [Y_newArray],
      };
      Plotly.update("signal", data_update);
      Plotly.update("output", new_data_update);
      if (++cnt === 1000) clearInterval(interval);
    }, 100);
  }
}

  

