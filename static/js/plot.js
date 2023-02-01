class Plot {
    constructor() {
    }  
plot = (w, value, div, label) => {
    let trace = {
        x: w,
        y: value,
        type: 'lines',
        name: label,
        marker: {
            color: 'rgb(3, 102, 60)'
        }
    };
    let data = [trace]; 
    let layout = {
        margin: {
            t: 20,
        },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
    }
    Plotly.newPlot(div, data, layout);
}
}