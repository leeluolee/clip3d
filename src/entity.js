var _ = require( "./util" );

var math = require("./math"),
  vec3 = math.vec3,
  mat4 = math.mat4;


// 3d entity for render
function Entity(options){
  this.vertices = options.vertices;
  this.indices = options.indices;
  this.colors = options.colors || [];
  this.light = options.light === false? false: true;

  this.fillColors = options.fillColors;
  this.matrix = options.matrix || mat4.ident();
  this.itemSize = options.itemSize || 3;
  // dom owner
  this.nodes = [];
  this.setup();
}

var eo = Entity.prototype;

eo.setup = function(){ 
  var len = this.vertices.length;
  var vlen = len / 3;
  // default indices;
  if( !this.indices ){
    this.indices = [];
    for(var i = 0 ; i < vlen; i++ ){
      this.indices.push(i);
    }
  }
}

module.exports = Entity;
