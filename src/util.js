var _ = module.exports = {};

var slice = [].slice;

_.extend = function( o1, o2, override ){
  for(var i in o2){
    if( typeof o1[i] === "undefined" || override === true ){
      o1[i] = o2[i]
    }
  }
  return o1;
}

_.instancify = function( klass , api ){
  var proto = klass.prototype;
  for( var i in api ) if( api.hasOwnProperty(i) ){
    proto[i] = convertOne( api[i] );
  }
}


_.getOffset = function getOffset(node){
  var l = node.offsetLeft;
  var t = node.offsetTop;
  while( node.offsetParent ){
      node = node.offsetParent;
      l += node.offsetLeft;
      t += node.offsetTop;
  }
  return { left: l, top: t };
}

_.requestFrame = function(){
  var request = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame|| 
    function(callback){
      setTimeout(callback, 16)
    }

  var cancel = window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    function(tid){
      clearTimeout(tid)
    }
  
  return function(callback){
    var id = request(callback);
    return function(){ cancel(id); }
  }
}();


// private method


var convertOne = function( method ){
  return function(){
    var args = slice.call(arguments);
    args.unshift(this)
    return method.apply(this, args);
  }
}


