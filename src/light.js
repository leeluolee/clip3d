var math = require("./math"),
  vec3 = math.vec3;

function Light( options){
  this.position = vec3.normalize(options.position || [0, 0, 1]); 
  this.color = options.color || [
    255,255,255,0.8
  ]
}

var lo = Light.prototype;


module.exports = Light;

