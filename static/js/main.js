let zplanecanvas = document.getElementById("zplanecanvas");
let ctxzplane = zplanecanvas.getContext("2d");
let plane = new ZPlane();
let plt = new Plot();
// update plot 
plt.plot([], [], "output-magnitude", '');
plt.plot([], [], "output-phase", '');
plane.drawPlane(ctxzplane);