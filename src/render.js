
var _ = require( "./util" ),
  math = require("./math"),
  color = require("./color"),
  Camera = require("./camera"),
  Light = require("./light"),
  Entity = require("./entity"),
  vec3 = math.vec3,
  mat4 = math.mat4;



function Render(options){
  options = options || {};
  this.camera = options.camera || new Camera();
  this.light = options.light;
  this.entities = [];
  if(options.entities){
    options.entities.forEach(this.addEntity.bind(this))
  }
  this.parent = options.parent;
  if(!this.parent) throw "you need pase a parent for rendering"
  this.width = this.parent.offsetWidth;
  this.height = this.parent.offsetHeight;
}

_.extend(Render.prototype, {

  render: function(){
    var matrix = mat4.ident();
    mat4.pmult(this.camera.view, this.camera.proj,  matrix);

    var lposition = vec3.transform(this.light.position, mat4.removeOffset(this.camera.view,[]), [])
    // console.log(this.light.position, lposition, "ha------", mat4.removeOffset(this.camera.view,[]), this.camera.view)

    this.entities.forEach(this.renderEntity.bind(this, matrix, lposition) );
  },
  renderEntity: function( matrix, lpos , entity  ){
    var vertices = entity.vertices, len = vertices.length;
    var indices = entity.indices, ilen = indices.length;
    var itemSize = entity.itemSize;
    var transform = mat4.pmult(entity.matrix, this.camera.view, [] )
    var ntransform = mat4.removeOffset(transform, []);
    var nview = mat4.removeOffset(this.camera.view, []);
    var nodes = entity.nodes;
    for(var i =0; i < ilen/itemSize ; i++){
      var node = nodes[i] || ( nodes[i] = this.createNode() ), 
        ecolor = entity.colors[i] || [255, 255, 255, 1],
        index=0, face = [], style=node.style;
      if(node.parentNode !== this.parent ) this.parent.appendChild(node);

      for(var j =0; j<itemSize; j++){
        var start = indices[i * itemSize +j] * 3 ;

        var v = vertices.slice(
          start, 
          start + 3
          );
        // transformed vertex
        vec3.transform(v, transform); // to camera view
        face.push(v);
        index += v[2] * 100;
      }
      // var clipStyle = [0, 3, 6].map(function(index){
      //   var tmpv = vec3.transform(
      //       vertices.slice(start + index, start + index + 3),
      //       mat4.pmult(entity.matrix, this.camera.view, []) 
      //       )
      //   id += tmpv[2];
      //   var style= this.percentify(tmpv)
      //   return style;
      // }.bind(this)).join(",")
      var vertical = vec3.vertical(face[0], face[1], face[2]);
      // if is backface remove it.
      if(vec3.dot(vertical, vec3.average.apply(null, face) ) > 0){
        style.display = "none";
        continue;
      } 
      // vec3.transform(vertical, ntransform);
      // console.log(lpos, vertical, ntransform , JSON.stringify(face))
      // console.log(vertical, lpos)
      var indensity = entity.light? Math.max(
        vec3.dot(vec3.normalize(vertical), lpos),0
        ): 1;
      // console.log(indensity, vertical, lpos, ntransform)
      var clip = "polygon(" + face.map(this.percentify).join(",") + ")";
      // console.log(clip, JSON.stringify(face))

      style.display = "";

      style.webkitClipPath = clip;
      style.clipPath = clip;
      // console.log(indensity, ecolor, this.light.diffuse)
      var diffuse = color.mix(this.light.color, ecolor, indensity);
      var ambient = color.mix([50,50,50, 1], ecolor, 1-indensity);
      var endcolor = color.mix(diffuse, ambient)
      style.backgroundColor = 
        color.rgb2css(endcolor);
      style.zIndex = 10000-parseInt(index, 10); 
    }
  },
  percentify: function(v){
    return ((0.5-v[0]/v[2]) * 100).toFixed(10) + "%  " + ((0.5 - v[1]/v[2]) * 100).toFixed(10) + "%";
  },
  createNode: function(){
    var node = document.createElement("div");
    node.style.position = "absolute";
    node.style.width = node.style.height = "100%";
    node.style.left = node.style.top= "0px";
    return node;
  },
  addEntity: function(entity){
    if( !(entity instanceof Entity) ){
      entity = new Entity(entity);
    }
    this.entities.push(entity)
  }
})


module.exports = Render;