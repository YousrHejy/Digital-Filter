class plotting {
  constructor() {}

  plot = (x, y, title, div, yTitle) => {
    let trace = {
      x: x,
      y: y,
      mode: "scatters",
    };
    let data = [trace];
    let layout = {
      xaxis: {title: "frequency" },
      yaxis: {title: yTitle },
      title: title,
    };
    Plotly.newPlot(div, data, layout, { scrollZoom: true });
  };
  sendZerosPoles = (array, flag) => {
    let path;
    let js_zp = JSON.stringify(array);
    if (flag == 0) {
      path = "/getzeros";
    } else {
      path = "/getpoles";
    }
    $.ajax({
      url: path,
      type: "post",
      contentType: "application/json",
      dataType: "json",
      data: js_zp,
      success:function(){
      }
    });
  };
}
