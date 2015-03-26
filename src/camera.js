var _ = require( "./util" );

var math = require("./math"),
  vec3 = math.vec3,
  mat4 = math.mat4;

// options:
//    - fov         //  default 90
//    - aspect      // default 0,
//    - near        // default 0.1
//    - far         //  default 100
//    - eye         // default 0, 0, 1
//    - center      // default 0,0,0
//    - up          // default 0, 1, 0
function Camera (options){
  options = options || {}
  _.extend(options, {
    fov: 90,
    aspect: 1,
    near: 0.1,
    far: 100,
    eye: [0,0,1],
    center: [0, 0, 0],
    up: [0,1,0]
  })
  _.extend(this, options)
  this.view = mat4.ident();
  this.proj = mat4.ident();
  this.update();
}

_.extend(Camera.prototype, {
  // sync the current state
  update: function(){
    mat4.perspective(this.fov, this.aspect, this.near, this.far, this.proj);
    mat4.lookAt(this.eye, this.center, this.up, this.view)
  }
})


module.exports = Camera;