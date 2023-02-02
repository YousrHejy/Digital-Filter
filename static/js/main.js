let zplanecanvas = document.getElementById("zplanecanvas");
let ctxzplane = zplanecanvas.getContext("2d");
let plane = new ZPlane();
let plt = new Plot();
let allPass=document.querySelectorAll("button")
// update plot
plt.plot([], [], "output-magnitude", '');
plt.plot([], [], "output-phase", '');
plane.drawPlane(ctxzplane);
allPass[4].addEventListener("click",()=>{
    window.open("/phaseCorrection")
})






