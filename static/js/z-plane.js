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
elements=(context, array, color,flag)=>{
    let PI2 = Math.PI * 2;
    this.drawPlane(context);
    for (let i = 0; i < array.length; i++) {
        let element = array[i];
        context.strokeStyle = color;
        if(flag==0){
            context.beginPath();
            context.arc(element[0], element[1], 6, 0, PI2);
        }else{
            let x = element[0];
            let y = element[1];
            context.beginPath();
            context.moveTo(x + 6 / Math.sqrt(2), y + 6 / Math.sqrt(2));
            context.lineTo(x - 6 / Math.sqrt(2), y - 6 / Math.sqrt(2));
            context.moveTo(x + 6 / Math.sqrt(2), y - 6 / Math.sqrt(2));
            context.lineTo(x - 6 / Math.sqrt(2), y + 6 / Math.sqrt(2));
            
        }
        if (i ==hit) {
            context.strokeStyle = '#ff0000';
        }
        context.stroke();
        context.closePath();
    } 
    }
drawElements=(context, zeros,poles, color,zero,pole)=>{
    this.elements(context, zeros, color,zero);
    this.elements(context, poles, color,pole);
}
getvalues=(element)=>{
    return ([((element[0] - 150) / 100), (-(element[1] - 150) / 100)])
}
sendZerosPoles=(array,flag)=> {
    let path;
    let values;
    values = array.map(this.getvalues);
    let js_zp = JSON.stringify(values);
    if(flag==0){
        path="/getzeros";
    }else{
        path="/getpoles";
    }
        $.ajax({
            url: path,
            type: "post",
            contentType: "application/json",
            dataType: "json",
            data: js_zp,
        });
}
}