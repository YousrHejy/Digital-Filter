class ZPlane{
    constructor() {
    } 
drawPlane =(context)=> {
    context.beginPath();
    context.arc(150, 150, 100, 0, 2 * Math.PI);
    context.stroke();
    context.moveTo(10, 150);
    context.lineTo(290, 150);
    context.stroke();
    context.moveTo(150, 10);
    context.lineTo(150, 290);
    context.strokeStyle = '#000000';
    context.stroke();
    context.closePath();
    }
drawElements=(context, array, color,flag)=>{
    drawPlane(context);
    for (let i = 0; i < array.length; i++) {
        let element = array[i];
        context.beginPath();
        context.strokeStyle = color;
        if(flag===0){
        context.arc(element[0], element[1], 6, 0, PI2);
        }else{
            context.moveTo(x + 6 / Math.sqrt(2), y + 6 / Math.sqrt(2));
            context.lineTo(x - 6 / Math.sqrt(2), y - 6 / Math.sqrt(2));
            context.moveTo(x + 6 / Math.sqrt(2), y - 6 / Math.sqrt(2));
            context.lineTo(x - 6 / Math.sqrt(2), y + 6 / Math.sqrt(2));
        }
        context.strokeStyle = color;
        if (i == hit) {
            context.strokeStyle = '#ff0000';
        }
        context.stroke();
        context.closePath();
    }
}
}