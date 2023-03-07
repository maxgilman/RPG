let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
const points = [{x:-20,y:-20},{x:0,y:-10},{x:20,y:-20},{x:0,y:20}];
const lines = [0,1,2,3,0];
let zoom = 2;
let keys = {};
let stars = [];
let spaceship = {
    angle : 0,
    x : 100,
    y : 100,
    xSpeed : 0,
    ySpeed : 0,
    mass: 50,
    size: 20
}
let cam = {
    x:0,
    y:0
}
let planets = [
    {
        
        x: 600,
        y: 400,
        size: 250,
        angle: 0,
        mass: 300000
    }
]
function createStar(layer){
    return {
        x:Math.round(Math.random()*1000),
        y:Math.round(Math.random()*1000),
        layer
    }
}
for (let i = 2; i<6; i++){
    for (let j = 0; j<500; j++){
        stars.push(createStar(i));
    }
}
function createPlanet() {
    return {
        y: Math.round(Math.random()*5000),
        x: Math.round(Math.random()*5000),
        size: 250,
        angle: 0,
        mass: 300000
    }
}
for (let i = 0; i<10; i++){
    planets.push(createPlanet());
}
function findDis(x,y){
    return Math.sqrt((Math.pow(x,2))+(Math.pow(y,2)));
}
function findAngle(x,y){
    let dis = findDis(x,y);
    let Angle = Math.asin(x/dis);
    if (y<0){
        Angle = Angle + ((Math.PI/2)-Angle)*2;
    }
    if(isNaN(Angle)){
        return(0);
    }else{
        return(Angle);
    }
}
function rotatePoint(angle,x,y){
    let dis = findDis(x,y);
    Angle = findAngle(x,y);
    Angle = Math.PI/2 - Angle + angle;
    return({
        x:dis*Math.cos(Angle),
        y:dis*Math.sin(Angle)
    });
}
function drawShip() {
    let output = null;
    ctx.beginPath();
    for (let i=0; i<lines.length; i++){
        output = rotatePoint(spaceship.angle,points[lines[i]].x,points[lines[i]].y)
        ctx.lineTo(output.x/zoom+c.width/2,output.y/zoom+c.height/2);
    }
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.stroke();
}
function drawPlanets() {
    for (let i = 0; i<planets.length; i++){
        let planet = planets[i];
        ctx.beginPath();
        ctx.arc((planet.x-cam.x)/zoom,(planet.y-cam.y)/zoom,planet.size/zoom,0,2*Math.PI);
        ctx.fillStyle = 'blue';
        ctx.stroke();
    }
}
function planetGravity(){
    for (let i = 0; i<planets.length; i++){
        let planet = planets[i];
        angle = findAngle(spaceship.x-planet.x,spaceship.y-planet.y);
        dis = findDis(spaceship.x-planet.x,spaceship.y-planet.y);
        if (dis<planet.size*50&&dis>planet.size){
            force = ((planet.mass*spaceship.mass)/(Math.pow(dis,2)));
            velocity = force/spaceship.mass*.5;
            spaceship.xSpeed-=Math.sin(angle)*velocity;
            spaceship.ySpeed-=Math.cos(angle)*velocity;
        }
    }
}
function planetCollision(){
    for (let i = 0; i<planets.length; i++){
        let planet = planets[i];
        angle = findAngle(spaceship.x-planet.x,spaceship.y-planet.y);
        dis = findDis(spaceship.x-planet.x,spaceship.y-planet.y);
        if (dis<planet.size+spaceship.size){
            spaceship.xSpeed = 0;
            spaceship.ySpeed = 0;
            spaceship.x = Math.sin(angle)*(planet.size+spaceship.size)+planet.x;
            spaceship.y = Math.cos(angle)*(planet.size+spaceship.size)+planet.y;
        }
    }
}
function updateCam(){
    cam.x = spaceship.x-c.width/2*zoom;
    cam.y = spaceship.y-c.height/2*zoom;

}
function drawStars(){
    for (let i = 0; i<stars.length; i++){
        ctx.beginPath();
        ctx.arc(stars[i].x-cam.x*Math.pow(1/3,stars[i].layer),stars[i].y-cam.y*Math.pow(1/3,stars[i].layer),5*Math.pow(1/4,stars[i].layer),0,Math.PI*2);
        ctx.stroke();
    }
}
document.addEventListener('keypress', (event) => {keys[event.key]=true});
document.addEventListener('keyup', (event) => {keys[event.key]=false});
function main(){
    if (keys['w']){
        img = new Image();
        img.src = 'https://maxgilman.github.io/RPG/tank.jpeg';
        img.onload = function() {
            ctx.drawImage(img, 0, 0,100,200);
        };
        spaceship.xSpeed+=Math.sin(-spaceship.angle)*2;
        spaceship.ySpeed+=Math.cos(-spaceship.angle)*2;
    }
    if (findDis(spaceship.xSpeed,spaceship.ySpeed)>50){
        spaceship.xSpeed+=Math.sin(-spaceship.angle)*-2;
        spaceship.ySpeed+=Math.cos(-spaceship.angle)*-2;
    }
    if (keys['d']){
        spaceship.angle+=Math.PI/20;
    }
    if (keys['a']){
        spaceship.angle-=Math.PI/20;
    }
    if (keys['q']){
        zoom+=.1;
    }
    if (keys['e']){
        zoom-=.1;
    }
    spaceship.x+=spaceship.xSpeed;
    spaceship.y+=spaceship.ySpeed;
    planetGravity();
    planetCollision();
    updateCam();
    ctx.clearRect(0, 0, c.width, c.height);
    drawStars();
    drawPlanets();
    drawShip();
}
setInterval(main,50);