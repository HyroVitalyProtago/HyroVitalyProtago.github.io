/**
 * Created by Hyro on 23/10/15.
 */

var camera, scene, renderer;
var effect, controls;
var element, container;
var video;

var clock = new THREE.Clock();
var loader = new THREE.TextureLoader();
var raycaster = new THREE.Raycaster();
var center = new THREE.Vector2();

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xffffff);
    element = renderer.domElement;
    container = document.getElementById('renderer');
    container.appendChild(element);

    effect = new THREE.StereoEffect(renderer);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
    camera.position.set(0, 10, -10);
    scene.add(camera);

    controls = new THREE.OrbitControls(camera, element);
    controls.rotateUp(Math.PI / 4);
    controls.target.set(
        camera.position.x + 0.1,
        camera.position.y,
        camera.position.z
    );
    controls.noZoom = true;
    controls.noPan = true;

    function setOrientationControls(e) {
        if (!e.alpha) {
            return;
        }

        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();

        element.addEventListener('click', fullscreen, false);

        window.removeEventListener('deviceorientation', setOrientationControls, true);
    }

    window.addEventListener('deviceorientation', setOrientationControls, true);

    var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
    scene.add(light);

    // var texture = THREE.ImageUtils.loadTexture('textures/AH.jpg'); //patterns/checker.png');
    //texture.wrapS = THREE.RepeatWrapping;
    //texture.wrapT = THREE.RepeatWrapping;
    //texture.repeat = new THREE.Vector2(50, 50);
    //texture.anisotropy = renderer.getMaxAnisotropy();

    /*
    loader.load('textures/AH.jpg',
        function (texture) {
            var plane = new THREE.Mesh(new THREE.PlaneGeometry(16, 10, 32), new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            }));
            plane.position.y = 10;
            scene.add(plane);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (xhr) {
            console.log('An error happened');
        }
    );
    
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(16, 10, 32), new THREE.MeshBasicMaterial({color: 0xff00ff, side: THREE.DoubleSide}));
    plane.position.y = 10;
    plane.position.x = 17;
    plane.rotateY(45);
    scene.add(plane);

    plane = new THREE.Mesh(new THREE.PlaneGeometry(16, 10, 32), new THREE.MeshBasicMaterial({color: 0x00ffff, side: THREE.DoubleSide}));
    plane.position.y = 10;
    plane.position.x = -17;
    plane.rotateY(-45);
    scene.add(plane);
    */

    var title = createLabel("Welcome in the Hyro's World", 64, 2048, 75);
    title.position.set(0, 10, 10);
    scene.add(title);

    var subtitle = createLabel("A WebVR Experiment", 32, 2048, 75);
    subtitle.position.set(0, 6, 20);
    scene.add(subtitle);

/*
    var canvas1 = document.createElement('canvas');
    var context1 = canvas1.getContext('2d');
    // context1.font = "10px Arial";
    // context1.fillStyle = "white";//rgba(255,0,0,0.95)";
    // context1.fillText('Hello, world!', 120, 80);
    context1.font = "64px Arial";
    context1.fillStyle = "rgba(255,0,0,0.95)";
    context1.textAlign = "center";
    context1.fillText("Hello World", canvas1.width/2, canvas1.height/2); 

    var texture1 = new THREE.Texture(canvas1) 
    texture1.needsUpdate = true;
    texture1.anisotropy = renderer.getMaxAnisotropy();

    plane = new THREE.Mesh(new THREE.PlaneGeometry(canvas1.width/8, canvas1.height/8), new THREE.MeshBasicMaterial({map: texture1, side: THREE.DoubleSide}));
    plane.position.set(0, 11, -30);
    // plane.rotateY(Math.PI);
    scene.add(plane);
*/

/*
    // create the video element
    video = document.createElement( 'video' );
    // video.id = 'video';
    // video.type = ' video/ogg; codecs="theora, vorbis" ';
    video.src = "textures/sintel.ogv";
    video.load(); // must call after setting/changing source
    video.play();
    
    // alternative method -- 
    // create DIV in HTML:
    // <video id="myVideo" autoplay style="display:none">
    //      <source src="videos/sintel.ogv" type='video/ogg; codecs="theora, vorbis"'>
    // </video>
    // and set JS variable:
    // video = document.getElementById( 'myVideo' );
    
    videoImage = document.createElement( 'canvas' );
    videoImage.width = 480;
    videoImage.height = 204;

    videoImageContext = videoImage.getContext( '2d' );
    // background color if no video present
    videoImageContext.fillStyle = '#000000';
    videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

    videoTexture = new THREE.Texture( videoImage );
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    
    var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
    // the geometry on which the movie will be displayed;
    //      movie image will be scaled to fit these dimensions.
    var movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
    var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
    movieScreen.position.set(0,50,-150);
    scene.add(movieScreen);
*/
/*
    // wall
    plane = new THREE.Mesh(new THREE.PlaneGeometry(32, 10, 32), new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide}));
    plane.position.set(0, 10, 0);
    scene.add(plane);

    // door 1
    plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 8, 32), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide}));
    plane.position.set(0, 9, -.1);
    scene.add(plane);

    // door 2
    plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 8, 32), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide}));
    plane.position.set(-6, 9, -.1);
    scene.add(plane);

    // door 3
    plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 8, 32), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide}));
    plane.position.set(6, 9, -.01);
    scene.add(plane);
*/
/*
    // ground
    loader.load('textures/patterns/wood.png',
        function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat = new THREE.Vector2(10, 10);
            texture.anisotropy = renderer.getMaxAnisotropy();
            var plane = new THREE.Mesh(new THREE.PlaneGeometry(256, 256, 32), new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            }));
            plane.rotateX(Math.PI/2);
            scene.add(plane);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (xhr) {
            console.log('An error happened');
        }
    );
*/
    window.addEventListener('resize', resize, false);
    setTimeout(resize, 1);
}

function resize() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
}

function buttonPressed(b) {
    return typeof(b) == "object" ? b.pressed : b == 1.0;
}

function gamepadUpdate(dt) {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!gamepads)
        return;

    var gp = gamepads[0];
    if (!gp)
        return;

    if (buttonPressed(gp.buttons[0])) {
        alert('btn 0 pressed !');
    } else if (buttonPressed(gp.buttons[2])) {
        alert('btn 2 pressed !');
    }
    if (buttonPressed(gp.buttons[1])) {
        alert('btn 1 pressed !');
    } else if (buttonPressed(gp.buttons[3])) {
        alert('btn 3 pressed !');
    }

    //var up = new THREE.Vector3(0, 1, 0);
    //var forward = THREE.Vector3.projectOnPlane(camera.forward, up).normalize();
    //var right = THREE.Vector3.projectOnPlane(Camera.right, up).normalize();

    camera.translateX(gp.axes[0] * dt);
    camera.translateY(-gp.axes[1] * dt);
}

function update(dt) {
    resize();

    camera.updateProjectionMatrix();

    controls.update(dt);

    gamepadUpdate(dt);

    raycaster.setFromCamera(center, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    for (var i = 0; i < intersects.length; i++) {
        // intersects[i].object.material.color.set(0xff0000);
    }
}

function render(dt) {
    if ( video && video.readyState === video.HAVE_ENOUGH_DATA ) 
    {
        videoImageContext.drawImage( video, 0, 0 );
        if ( videoTexture ) 
            videoTexture.needsUpdate = true;
    }

    effect.render(scene, camera);
}

function animate(t) {
    requestAnimationFrame(animate);

    update(clock.getDelta());
    render(clock.getDelta());
}

function fullscreen() {
    if (container.requestFullscreen) {
        container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
    }
}

function createLabel(text, textHeight, ppi, scale) {
    var cvs = document.createElement('canvas');
    var context = cvs.getContext('2d');

    /*
    var metrics = context.measureText(text);
    var textWidth = metrics.width;
    */

    cvs.width = ppi;
    cvs.height = ppi;

    // background
    // context.fillStyle = "#ff0000";
    // context.fillRect(0,0,cvs.width,cvs.height);

    // text
    context.font = "normal " + textHeight + "px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "black";
    context.fillText(text, cvs.width/2, cvs.height/2);

    var texture = new THREE.Texture(cvs);
    texture.needsUpdate = true;
    
    /*
    var material = new THREE.SpriteMaterial({ map: texture });
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(scale, scale, scale);
    return sprite;
    */

    var geometry = new THREE.PlaneGeometry(scale, scale, ppi);
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });
    var plane = new THREE.Mesh(geometry, material);
    plane.rotateY(Math.PI);
    return plane;
}

window.addEventListener("gamepadconnected", function (e) {
    alert("Contrôleur n°" + e.gamepad.index + " connecté : " + e.gamepad.id + ". "
        + e.gamepad.buttons.length + " boutons, " + e.gamepad.axes.length + " axes.");
});

window.addEventListener("gamepaddisconnected", function (e) {
    alert("Contrôleur n°" + e.gamepad.index + " déconnecté : " + e.gamepad.id);
});