/*
 three.envmap.js
*/

var camera, scene, renderer;

var fov = 70,
texture_placeholder,
isUserInteracting = false,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 0, onMouseDownLon = 0,
lat = 0, onMouseDownLat = 0,
phi = 0, theta = 0;
  
/*
function onDocumentMouseDown( event ) {
	event.preventDefault();
	isUserInteracting = true;
	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;
	onPointerDownLon = lon;
	onPointerDownLat = lat;
}

function onDocumentMouseMove( event ) {
	if ( isUserInteracting ) {
		lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
		lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
	}
}

function onDocumentMouseUp( event ) {
	isUserInteracting = false;
}

function onDocumentMouseWheel( event ) {
	// WebKit
	if ( event.wheelDeltaY ) {
		fov -= event.wheelDeltaY * 0.05;
	// Opera / Explorer 9
	} else if ( event.wheelDelta ) {
		fov -= event.wheelDelta * 0.05;
	// Firefox
	} else if ( event.detail ) {
		fov += event.detail * 1.0;
	}
	camera.projectionMatrix = THREE.Matrix4.makePerspective( fov, window.innerWidth / window.innerHeight, 1, 1100 );
	render();
}
*/

(function($) {
    $.fn.EnviromentMap = function() {
    	if(!Detector.webgl){
      		Detector.addGetWebGLMessage();
    	} else {
            this.each(function() { 
                var $self = $(this),
                $id = $self.attr('id'),
                $src = $self.attr('src'),
                $width = $self.attr('width'),
                $height = $self.attr('height'),
                mesh;
                console.log('EnviromentMap:'+$id);
                
            	camera = new THREE.Camera( fov, window.innerWidth / window.innerHeight, 1, 1100 );
            	scene = new THREE.Scene();
            	mesh = new THREE.Mesh( new THREE.Sphere( 500, 60, 40 ), new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( $src ) } ) );
            	mesh.scale.x = -1;
            	scene.addObject( mesh );
            	renderer = new THREE.WebGLRenderer();
            	renderer.setSize( $width, $height );
            	$duped = $('<div>');
            	$duped.attr('id',$id);
            	$duped.prepend(renderer.domElement);
            	$self.replaceWith($duped);
                $(document).on("mousedown", '#'+$id, function(e) {
                	e.preventDefault();
                	isUserInteracting = true;
                	onPointerDownPointerX = e.clientX;
                	onPointerDownPointerY = e.clientY;
                	onPointerDownLon = lon;
                	onPointerDownLat = lat;
                });
                $(document).on("mouseup", '#'+$id, function(e) {
                    isUserInteracting = false;
                });
                $(document).on("mousemove", '#'+$id, function(e) {
                	if ( isUserInteracting ) {
                		lon = ( onPointerDownPointerX - e.clientX ) * 0.1 + onPointerDownLon;
                		lat = ( e.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
                	}
                });
            });
            $.animate();
    	}
    }
})(jQuery);

/* Utility Methods */
(function($) {
    
    $.inview = function($element, settings) {
        return ($.abovethetop($element,settings)!=true && $.belowthefold($element,settings)!=true)
    };
    
    $.render = function () {
    	lat = Math.max( - 85, Math.min( 85, lat ) );
    	phi = ( 90 - lat ) * Math.PI / 180;
    	theta = lon * Math.PI / 180;
    	camera.target.position.x = 500 * Math.sin( phi ) * Math.cos( theta );
    	camera.target.position.y = 500 * Math.cos( phi );
    	camera.target.position.z = 500 * Math.sin( phi ) * Math.sin( theta );
    	renderer.render( scene, camera );
    };
    
    $.animate = function ($element) {
    	$.render();
    	requestAnimationFrame( $.animate , $element );
    };
    
})(jQuery);  