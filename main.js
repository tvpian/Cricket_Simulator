console.log('Cricket BALL');

//Including Libraries
Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';


//Color Variables
var white = "rgb(255,255,255)";
var black = "rgb(0,0,0)";
var red = "rgb(255,0,0)";
var green = "rgb(10,200,10)";
var brown = "rgb(210,105,30)";

//variablkes for groung pitch ball and scene
var camera, renderer, controls, scene;
var viewport, cameraComboBox, speedSlider, swingSlider;
var ball;

var ViewPortWidth = 960;
var ViewPortHeight = 540;

var ballPosition = new THREE.Vector3(-1, 4, 10);
var ballVelocity = new THREE.Vector3(1, 0, -15);

var GRAVITY = -10;
var groundFriction = 0.0, groundBounciness = 0.99;
var pitchFriction = 0.0, pitchBounciness = 0.99;


//camera variables
var PRESENT_CAMERA = {
  MAIN_UMPIRE: new THREE.Vector3(0, 5, 12.5),
  LEG_UMPIRE: new THREE.Vector3(16, 4, -9.5),
  KEEPER: new THREE.Vector3(0, 5,-18),
  SLIP1: new THREE.Vector3(-3.5, 5,-19),
  SLIP2: new THREE.Vector3(-5.5, 5,-18.5),
  SLIP3: new THREE.Vector3(-7.5, 5,-18),
  POINT: new THREE.Vector3(-19, 4,-11),
  CLOSE_FEILDER_OFF: new THREE.Vector3(-16, 3, 0),
  CLOSE_FEILDER_LEG: new THREE.Vector3(16, 3, 0),
  GENERAL_CAMERA: new THREE.Vector3(0, 50, 50),
};


function init() {

viewport = document.getElementById('CricketBowling');
cameraComboBox = document.getElementById('CameraComboBox');
swingSlider = document.getElementById('SwingSlider');
speedSlider = document.getElementById('SpeedSlider');

ViewPortWidth = window.innerWidth - 40;
ViewPortHeight = window.innerHeight - 100;

renderer = new THREE.WebGLRenderer({antialias : true});
renderer.setSize(ViewPortWidth, ViewPortHeight);


viewport.style.width = ViewPortWidth + 'px';
viewport.style.heigh = ViewPortHeight + 'px';
viewport.appendChild(renderer.domElement);

console.log(viewport);


scene = new Physijs.Scene();
scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
scene.setGravity(0, GRAVITY, 0);

camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(PRESENT_CAMERA.MAIN_UMPIRE);
camera.lookAt(scene.position);
scene.add(camera);

controls = new THREE.OrbitControls(camera, renderer.domElement);

var axes = new THREE.AxesHelper(30);
scene.add(axes);


//Ground Function
var outFeildGeometry = new THREE.CylinderGeometry(64, 64, .5, 64, 64, false);
var outFeildMaterial = Physijs.createMaterial(new THREE.MeshLambertMaterial({color : green}), 0 , 0.99);
var outFeild = new Physijs.CylinderMesh(outFeildGeometry,outFeildMaterial, 0);
outFeild.name = 'outfield';
outFeild.position.set(0, 0, 0);
scene.add(outFeild);



//infeid variables

//Top
var inFeildWidth = 28;
var inFeildTopGeometry = new THREE.CylinderGeometry(inFeildWidth, inFeildWidth, .5, 32, 32, false, Math.PI / 2.0, Math.PI);
var inFeildMaterial = Physijs.createMaterial(new THREE.MeshLambertMaterial({color : brown}), 0, 0.99);
var inFeildTop = new Physijs.CylinderMesh(inFeildTopGeometry, inFeildMaterial, 0);
inFeildTop.name = 'InFeildTop';
inFeildTop.position.set(0, 0.05, -15);
scene.add(inFeildTop);

//Bottom

var inFeildBottomGeometry = new THREE.CylinderGeometry(inFeildWidth, inFeildWidth, .5, 32, 32, false, -Math.PI / 2.0, Math.PI);
//var inFeildMaterial = Physijs.createMaterial(new THREE.MeshLambertMaterial({color : red}), 0, 0.99);
var inFeildBottom = new Physijs.CylinderMesh(inFeildBottomGeometry, inFeildMaterial, 0);
inFeildBottom.name = 'InFeildBottom';
inFeildBottom.position.set(0, 0.05, 15);
scene.add(inFeildBottom);


//Center
var inFeildCenterGeometry = new THREE.BoxGeometry(inFeildWidth * 1.998, .5, inFeildWidth * 1.2);
//var inFeildCenterMaterial = Physijs.createMaterial(new THREE.MeshLambertMaterial({color : white}), 0, 0.99);
var inFeildCenter = new Physijs.BoxMesh(inFeildCenterGeometry, inFeildMaterial, 0);
inFeildCenter.name = 'InFeildCenter';
inFeildCenter.position.set(0, 0.05, 0);
scene.add(inFeildCenter);


//Pitch with material
var landGeometry = new THREE.BoxGeometry(6, .5, 20.12 + 2);
var landMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({color : white}), 0, 0.99);
land = new Physijs.BoxMesh(landGeometry, landMaterial, 0);
land.name = 'land';
land.position.set(0, 0.1, 0);
scene.add(land);

// END of Ground

//Adding Bat

var batGeometry = new THREE.BoxGeometry(0.5, 3.5, .2, 64, 64, false);
var batMaterial = Physijs.createMaterial(new THREE.MeshLambertMaterial({color : brown}), 0 , 0.99);
var bat = new Physijs.CylinderMesh(batGeometry,batMaterial, 0);
bat.name = 'Batsman';
bat.rotation.x = 0;
//bat.rotation.y = -1;
bat.rotation.z = 0;
bat.position.set(-0.5, 1.2, -9.1);
scene.add(bat);

// adding STUMPS Batting Side
addStupms(-0.3, 1.2, -10.5);
addStupms(0, 1.2, -10.5);
addStupms(0.3, 1.2, -10.5);


// adding STUMPS Bowling Side
addStupms(-0.3, 1.2, 10.5);
addStupms(0, 1.2, 10.5);
addStupms(0.3, 1.2, 10.5);


//adding Crease batsman end
addCrease(-2.2, -10.5, 2.2, -10.5);
addCrease(-2.8, -9.2, 2.8, -9.2);
addCrease(-2.2, -9.2, -2.2, -11);
addCrease(2.2, -9.2, 2.2, -11);


//adding Crease bolwer end
addCrease(-2.8, 9.2, 2.8, 9.2);
addCrease(-2.2, 10.5, 2.2, 10.5);
addCrease(-2.2, 9.2, -2.2, 11);
addCrease(2.2, 9.2, 2.2, 11);

//Light centerpitch
var spotLight = new THREE.AmbientLight(0x0c0c0c);
spotLight.position.set(0,0,0);
scene.add(spotLight);

//Lights for ground
var pointLightTop = new THREE.PointLight(0xfffff);
pointLightTop.position.set(10,50,280);
scene.add(pointLightTop);

var pointLightBottom = new THREE.PointLight(0xfffff);
pointLightBottom.position.set(10,50,-280);
scene.add(pointLightBottom);

var pointLightLeft = new THREE.PointLight(0xfffff);
pointLightLeft.position.set(-280,50,0);
scene.add(pointLightLeft);

var pointLightRight = new THREE.PointLight(0xfffff);
pointLightRight.position.set(280,50,0);
scene.add(pointLightRight);

window.addEventListener('resize', onWindiwResize, false);
cameraComboBox.addEventListener('change', cameraSelected);
speedSlider.addEventListener('input', speedChanged);
swingSlider.addEventListener('input', swingChanged);

//viewPortClick
viewport.addEventListener('click', viewPortClicked, false);

}

function renderScene(){

  requestAnimationFrame(renderScene);
  scene.simulate();
  renderer.render(scene,camera);
}

function onWindiwResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectMatrix();
  renderer.setSize(window.innerWidth, window.inner);
  renderScene();

}

function cameraSelected() {

  var cameraKey = cameraComboBox.value;
  camera.position.copy(PRESENT_CAMERA[cameraKey]);
  camera.lookAt(scene.position);

}


function speedChanged() {

  document.getElementById('SpeedLabel').textContent = speedSlider.value + 'kmph';

}

function swingChanged() {

  document.getElementById('SwingLabel').textContent = swingSlider.value + ' from batsman';

}

function ballAdded() {

}
var collided = false;
var collidedList = [];

function ballCollided(other, linerVelocity, angularVelocity, contactNormal) {

  if (collided) return;

  collidedList.push(other.name);

  var v = ball.getLinearVelocity();
  if(swingSlider.value != 0) v.x = swingSlider.value;
  ball.setLinearVelocity(v);
  ball.__dirtyRotation = true;
  ball.__dirtyPosition  = true;

  collided = true;

}

function addBall(bounciness){
  if(ball) scene.remove(ball);

//BAll
var ballGeometry = new THREE.SphereGeometry(0.1,32,32);
var ballMaterial = Physijs.createMaterial(new THREE.MeshLambertMaterial({color : red, opacity : 0.0, transparent : false}), 0.0, bounciness);
ball = new Physijs.SphereMesh(ballGeometry,ballMaterial, undefined, {restitution : bounciness});
ball.position.copy(ballPosition);
ball.addEventListener('ready', ballAdded);
ball.addEventListener('collision', ballCollided);
ball.setCcdMotionThreshold(0.1);
ball.setCcdSweptSphereRadius(0.02);

scene.add(ball);
console.log(ballPosition);
ball.__dirtyRotation = true;
ball.__dirtyPosition = true;

}

function viewPortClicked(ev) {

  var pos = getMouseWorldPosition(ev);
  console.log('viewPortClicked');

  if(pos != undefined){

    console.log('Loop Entered');

    var minSpeed = speedSlider.min;
    var maxSpeed = speedSlider.max;
    var speed = speedSlider.value;

    console.log(minSpeed, maxSpeed, speed);

    var maxT = 1.6, minT = 0.4;
    var tUnit = (maxT- minT) / (maxSpeed - minSpeed);
    var t = maxT - (speed - minSpeed) * tUnit;


    var maxR = 0.99, minR = 0.5;
    var rUnit = (maxR- minR) / (maxSpeed - minSpeed);
    var r = maxR - (speed - minSpeed) * rUnit;

    console.log(r);

    addBall(r);

    ball.material._physijs.restitution = r;
    ballVelocity = findInitialVelocity(ballPosition, pos, t);

    bowl();

  }

}


function getMouseWorldPosition(ev) {

  var mouseX = ev.pageX - viewport.offsetLeft, mouseY = ev.pageY - viewport.offsetTop;

    var mouse3D = new THREE.Vector3();
    mouse3D.x = (mouseX / viewport.clientWidth) * 2 - 1;
    mouse3D.y = -(mouseY / viewport.clientHeight) * 2 + 1;
    mouse3D.z = 0.5;

    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse3D, camera);

    var intersects = raycaster.intersectObjects(scene.children);
    for (var i = 0; i < intersects.length; i++)
    {
        if (intersects[i].object.name == 'land')
        {
            //intersects[i].object.material.color.set(0xff0000);
            return intersects[i].point;
        }
    }
    return undefined;
}

function addInFeildAsCapsule(material) {

  var capsuleRadius = 8;
  var capsuleHeight = 82;
  var cyl = new THREE.CylinderGeometry(capsuleRadius, capsuleRadius, capsuleHeight, 32, 32, false);
  var top = new THREE. Sphe

}

function bowl() {

  console.log('bowl function entered');
  ball.position.copy(ballPosition);
  ball.setLinearVelocity(ballVelocity);
  ball.__dirtyRotation = true;
  ball.__dirtyPosition = true ;
  ball.material.opacity = 0.8 ;

  collided = false;
}


function addStupms(x, y, z) {

  var geometry = new THREE.CylinderGeometry(0.1, 0.06, 1.8, 32, 32, false);
  var material = new THREE.MeshLambertMaterial({color : red});
  var stump = new Physijs.CylinderMesh(geometry, material,0.01);
  stump.position.set(x, y, z);
  console.log(x, y, z);
  scene.add(stump);
  console.log('Stumps Added');

}

function addCrease(x1, z1, x2, z2) {
  var geometry = new THREE.Geometry();
  var material = new THREE. LineBasicMaterial({color : red});
  geometry.vertices.push(new THREE.Vector3(x1, 0.36, z1), new THREE.Vector3(x2, 0.36, z2));
  var line = new THREE.Line(geometry, material);
  scene.add(line);
  console.log('Crease added');

}

document.body.onload = function () {
  init();
  renderScene();
  alert("Bowling Speed")
}
