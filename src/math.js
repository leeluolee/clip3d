var _ = require("./util");

var MatrixArray = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var percision=1e-5;


// Array
function vec3( v1 ){
  if(this instanceof vec3 === false){
    return new vec3(v1)
  }else{
    this[0] = v1[0];
    this[1] = v1[1];
    this[2] = v1[2];
    this.length = 3;
  }
}


var v_api = {
  set: function(src, v1){

    src[0] = v1[0]
    src[1] = v1[1]
    src[2] = v1[2]
    return src;

  },

  // +
  add: function(src, v1, dest){
    dest = dest || src;
    dest[0] = src[0] + v1[0];
    dest[1] = src[1] + v1[1];
    dest[2] = src[2] + v1[2];
    return dest;
  },
  // -
  sub: function(src, v1, dest){
    dest = dest || src;
    dest[0] = src[0] - v1[0];
    dest[1] = src[1] - v1[1];
    dest[2] = src[2] - v1[2];
    return dest;
  },
  // -
  mult: function(src, mult, dest){
    dest = dest || src;
    dest[0] = src[0] * mult;
    dest[1] = src[1] * mult;
    dest[2] = src[2] * mult;
    return dest;
  },
  // *
  reverse: function(src, dest){
    dest = dest || src;
    return vec3.mult(src, -1 ,dest);
  },
  // x
  cross: function(src, v1, dest){
    dest = dest || src;
    var tx = src[0];
    var ty = src[1];
    var tz = src[2];

    dest[0] = ty * v1[2] - tz * v1[1];
    dest[1] = tz * v1[0] - tx * v1[2];
    dest[2] = tx * v1[1] - ty * v1[0];
    return dest;
  },
  dot:function(src, v1){
      return src[0] * v1[0] + src[1] * v1[1] + src[2] * v1[2];
  },
  dis2: function(src, v){
    var dx = src[0] - v[0];
    var dy = src[1] - v[1];
    var dz = src[2] - v[2];

    return dx * dx + dy * dy + dz * dz;
  },
  dis: function(src, v1){
    return Math.sqrt(vec3.dis2(src, v1));
  },
  // norm of verctor
  mold: function(src){
    return vec3.dis(src, vec3.zero);
  },

  // angle from src to v
  // acos( src - v/ mold_src * mold_v )
  angle: function(src, v){
    var m = vec3.mold(src) * vec3.mold(v);
    if(m < percision) return "modulo can't be zero " ;
    var dot = vec3.dot(src, v);
    return Math.acos(dot / m);
  },

  // normalize src
  normalize: function(src, limit, dest ){
    limit = limit || 1;
    var mo = vec3.mold(src);
    if(mo === 0) return src;
    return vec3.mult( src , limit / mo, dest);
  },
  transform:function(src, m ,dest){
    return mat4.transform(m, src, dest);
  },
  rotateX:function(src, angle, dest){
    return mat4.transform(mat4.createRotateX(angle), src, dest);
  },
  rotateY:function(src, angle, dest){
    return mat4.transform(mat4.createRotateY(angle), src, dest);
  },
  rotateZ:function(src, angle, dest){
    return mat4.transform(mat4.createRotateZ(angle), src, dest);
  },
  rotate:function(src, w, angle, dest){
    return mat4.transform(mat4.createRotate(w, angle), src, dest);
  },
  traslate:function(src, angle, dest){
    return mat4.transform(mat4.createTraslate(angle), src, dest);
  },
  scale:function(src, x,y,z,dest){
      return this.transform(mat4.createScale(x, y, z), src, dest);
  }
}

_.extend(vec3, v_api);
_.extend(vec3, {
  zero: [0,0,0],
  create: function(x, y ,z){
    var arr = new MatrixArray(3);
    arr[0] = x || 0;
    arr[1] = y || 0;
    arr[2] = z || 0;
    return arr;
  },
  // v1 + v2 ... + vn / n
  average: function(v1, v2){
    var dest = vec3.create();
    for(var i =0, len = arguments.length; i < len; i++ ){
      vec3.add(dest, arguments[i], dest)
    }
    return vec3.mult(dest, 1/len ,dest)
  },
  vertical: function(v1, v2, v3){
    var v21 = vec3.sub(v2, v1, [])
    var v31 = vec3.sub(v3, v1, [])
    return vec3.cross(v21, v31);
  }
})


var m_api = {
  // m[0]   m[1]  m[2]  m[3]
  // m[4]   m[5]  m[6]  m[7]
  // m[8]   m[9]  m[10] m[11]
  // m[12]  m[13] m[14] m[15]
  set:function(src, 
    m0,  m1,  m2,   m3,
    m4,  m5,  m6,   m7,
    m8,  m9,  m10,  m11,
    m12, m13, m14,  m15
    ){
    src[0] = m0||0; src[1] = m1||0; src[2] = m2||0; src[3] = m3||0;
    src[4] = m4||0; src[5] = m5||0; src[6] = m6||0; src[7] = m7||0;
    src[8] = m8||0; src[9] = m9||0; src[10] = m10||0; src[11] = m11||0;
    src[12] = m12||0; src[13] = m13||0; src[14] = m14||0; src[15] = m15||1;
    return src;
  },
  // default:
  // 1 0 0 0
  // 0 1 0 0
  // 0 0 1 0
  // 0 0 0 1
  ident: function(src){
    if(!src) src = mat4.create();
    src[0] = 1; src[1] = 0; src[2] = 0; src[3] = 0; 
    src[4] = 0; src[5] = 1; src[6] = 0; src[7] = 0;
    src[8] = 0; src[9] = 0; src[10] = 1; src[11] = 0;
    src[12] = 0; src[13] = 0; src[14] = 0; src[15] = 1;
    return src;
  },
  // http://zh.wikipedia.org/zh/%E8%A1%8C%E5%88%97%E5%BC%8F
  // 3元斜角相减 乘以 a33
  det: function(src){

    var m00 = src[0], m01 = src[1], m02 = src[2],
        m10 = src[4], m11 = src[5], m12 = src[6],
        m20 = src[8], m21 = src[9], m22 = src[10];


    return m00 * m11 * m22 + m01 * m12 * m20 + m02 * m10 * m21 -
      m00 * m12 * m21 - m01 * m10 * m22 - m02 * m11 * m20;
  },
  mult: function(src, scale, dest){
    src[0] *= scale; src[1] *= scale; src[2] *= scale; src[3] *= scale;       
    src[4] *= scale; src[5] *= scale; src[6] *= scale; src[7] *= scale;       
    src[8] *= scale; src[9] *= scale; src[10] *= scale;  src[11] *=scale;  
    src[12] *= scale;  src[13] *= scale;  src[14] *= scale;  src[15] *=scale;  
    return src;
  },
  // pre multiply >> m x src
  pmult: function(src, m, dest){
    dest = dest || src;
    var 
      n00 = src[0], n01 = src[1], n02 = src[2], n03 = src[3],
      n10 = src[4], n11 = src[5], n12 = src[6], n13 = src[7],
      n20 = src[8], n21 = src[9], n22 = src[10], n23 = src[11];

    dest[0]=m[0]*n00+m[1]*n10+m[2]*n20;
    dest[1]=m[0]*n01+m[1]*n11+m[2]*n21;
    dest[2]=m[0]*n02+m[1]*n12+m[2]*n22;
    dest[3]=m[0]*n03+m[1]*n13+m[2]*n23+m[3];

    dest[4]=m[4]*n00+m[5]*n10+m[6]*n20;
    dest[5]=m[4]*n01+m[5]*n11+m[6]*n21;
    dest[6]=m[4]*n02+m[5]*n12+m[6]*n22;
    dest[7]=m[4]*n03+m[5]*n13+m[6]*n23+m[7];

    dest[8]=m[8]*n00+m[9]*n10+m[10]*n20;
    dest[9]=m[8]*n01+m[9]*n11+m[10]*n21;
    dest[10]=m[8]*n02+m[9]*n12+m[10]*n22;
    dest[11]=m[8]*n03+m[9]*n13+m[10]*n23+m[11];

    dest[12] = 0;
    dest[13] = 0;
    dest[14] = 0;
    dest[15] = 1;

    return dest
  },
  //求逆,由于第四行的特殊性,以及旋转矩阵的正交性,公式相比一般四维矩阵求逆简单的多
  inverse: function(src, dest){
    dest = dest || src;
    var m00 = src[0], m01 = src[1], m02 = src[2], m03 = src[3],
        m10 = src[4], m11 = src[5], m12 = src[6], m13 = src[7],
        m20 = src[8], m21 = src[9], m22 = src[10], m23 = src[11]

    mat4.ident(dest);
    dest[0] = -m12*m21+ m11*m22; dest[1] = m02*m21- m01*m22; dest[2] =  -m02*m11 + m01*m12; dest[3] = m03*m12*m21 - m02*m13*m21 - m03*m11*m22 + m01*m13*m22 + m02*m11*m23 - m01*m12*m23;
    dest[4] =  m12*m20 - m10*m22; dest[5] = -m02*m20 + m00*m22; dest[6] = m02*m10 - m00*m12; dest[7] = m02*m13*m20 - m03*m12*m20 + m03*m10*m22 - m00*m13*m22 - m02*m10*m23 + m00*m12*m23;
    dest[8] =-m11*m20+ m10*m21; dest[9] =  m01*m20 - m00*m21; dest[10] = +m01*m10+ m00*m11; dest[11] = m03*m11*m20 - m01*m13*m20 - m03*m10*m21 + m00*m13*m21 + m01*m10*m23 - m00*m11*m23;

    return mat4.mult(dest, 1 / mat4.det(src))
  },
  copy: function(src, dest){
    dest = dest || mat4.create();
    mat4.set(dest,
      src[0], src[1], src[2], src[3],
      src[4], src[5], src[6], src[7],
      src[8], src[9], src[10], src[11],
      src[12], src[13], src[14], src[15]
    )
    return dest
  },
  removeOffset: function(src, dest){
    dest = mat4.copy(src, dest)
    dest[3] = 0;
    dest[7] = 0;
    dest[11] = 0;
    return dest;
  },
  transform: function(src, v ,dest){
    dest = dest || v;
    var vx = v[0], vy = v[1], vz = v[2];
    dest[0] = (src[0] * vx + src[1] * vy + src[2] * vz + src[3] ) ;
    dest[1] = (src[4] * vx + src[5] * vy + src[6] * vz + src[7]);
    dest[2] = (src[8] * vx + src[9] * vy + src[10] * vz + src[11]) ;
    return dest;
  },
  transforms: function(src, vs, offsetLess){
    var res=[];
    for(var i=0,l=vs.length;i<l;i++){
        res.push(mat4.transform(src, vs[i], null , offsetLess));
    }
    return res;
  },
  translate: function(src, x, y, z, dest){
    return mat4.pmult(src, mat4.createTranslate(x, y, z), dest);
  },
  scale: function(src, x, y, z, dest){
    return mat4.pmult(src, mat4.createScale(x, y, z), dest);
  },
  rotateX: function(src, angle, dest){
    return mat4.pmult(src, mat4.createRotateX(angle), dest);
  },
  rotateY: function(src, angle, dest){
    return mat4.pmult(src, mat4.createRotateY(angle), dest);
  },
  rotateZ: function(src, angle, dest){
    return mat4.pmult(src, mat4.createRotateZ(angle), dest);
  },
  rotateN: function(src, rx, ry, rz, dest){
    return mat4.pmult(src, mat4.createRotateN(rx, ry, rz), dest);
  },
  rotate: function(src, w, angle, dest){
    return mat4.pmult(src, mat4.createRotate(w, angle), dest);
  },
  toString: function(src){
    return  
      src[0] + "\t" + src[1] + "\t" + src[2] + "\t" + src[3] + "\n" +
      src[4] + "\t" + src[5] + "\t" + src[6] + "\t" + src[7] + "\n" +  
      src[8] + "\t" + src[9] + "\t" + src[10] + "\t" + src[11] + "\n" +
      src[12] + "\t" + src[13] + "\t" + src[14] + "\t" + src[15]; 
  }

}

function mat4(){}

_.extend(mat4, m_api);

_.extend(mat4, {
  create: function(n00, n01, n02, n03, n10, n11, n12, n13, n20, n21, n22, n23){
    var m  = new MatrixArray(16);

      return m;
  },
  createTranslate:function(x,y,z){
    var m = mat4.ident();
    m[3] = x || 0;
    m[7] = y || 0;
    m[11] = z || 0;
    return m;
  },
  createScale:function(x,y,z){
    if(y == null){ y = x,z = x }
    var m = mat4.ident();
    m[0] = x;
    m[5] = y;
    m[10] = z;
    return m;
  },
  createRotateX:function(angle){
    var m = mat4.ident();
    angle = angle * Math.PI / 180
    var c = Math.cos(angle);
    var s = Math.sin(angle)
    m[5] = c;
    m[6] = -s;
    m[9] = s;
    m[10] = c;
    return m;
  },
  createRotateY:function(angle){
    angle = angle * Math.PI / 180
    var m = mat4.ident();
    var c=Math.cos(angle);
    var s=Math.sin(angle)
    m[0] = c;
    m[2] = s;
    m[8] = -s;
    m[10] = c
    return m;
  },
  createRotateZ:function(angle){
    angle = angle * Math.PI / 180
    var m = mat4.ident();
    var c=Math.cos(angle);
    var s=Math.sin(angle)
    m[0] = c;
    m[1] = -s;
    m[4] = s;
    m[5] = c;
    return m;
  },
  // 一次旋转多个角度
  createRotateN:function(rx, ry, rz){
    rx = rx * Math.PI / 180
    ry = ry * Math.PI / 180
    rz = rz * Math.PI / 180
    var m = mat4.ident();
    var sx, sy, sz;
    var cx, cy, cz;
    sx = Math.sin(rx);
    sy = Math.sin(ry);
    sz = Math.sin(rz);
    cx = Math.cos(rx);
    cy = Math.cos(ry);
    cz = Math.cos(rz);
    m[0] = cy*cz;
    m[1] = -cy * sz;
    m[2] = sy;
    m[4] = cx * sz + sx * sy * cz;
    m[5] = -sx*sy*sz+cx*cz;
    m[6] = -sx*cy;
    m[8] = sx * sz - cx * sy * cz;
    m[9] = sx * cz + cx * sy * sz;
    m[10] = cx * cy;

    return m;
  },
  //沿任意轴的旋转首先分解出正交矩阵m [u,v,w] X m [u,v,w]T(因为是w作为Z轴,所以w必须放在第三个变量)
  //首先 左乘 [u,v,w]T 转换到 uvw正交基坐标系 然后作Z轴旋转（W与绕的轴重合）再返回原坐标系
  // w*u=v u*w=-v  v*w=u w*v=-u  所以changeMin({x:w.x,y:w.y,z:w.z} 取代的位置相当于是v的位置
  createRotate:function( w, angle){
    var m = mat4.createRotateZ(angle);
    
      w = vec3.normalize(w);
      var v = vec3.cross(w, changeMin(vec3.set([], w)), vec3.create() )
      v = vec3.normalize(v);
      var u=vec3.cross(v, w, []);
      var l = mat4.ident();
      l[0] = u[0];
      l[1] = v[0];
      l[2] = w[0];
      l[4] = u[1];
      l[5] = v[1];
      l[6] = w[1]
      l[8] = u[2]
      l[9] = v[2]
      l[10] = w[2]

      var r = mat4.ident();

      r[0] = u[0];
      r[1] = u[1];
      r[2] = u[2];
      r[4] = v[0];
      r[5] = v[1];
      r[6] = v[2];
      r[8] = w[0];
      r[9] = w[1];
      r[10] = w[2];

      // r X m Xl
      var res=  mat4.pmult(
              mat4.pmult(r, m), l
            );
      return res;
  },

  // // 推算 @TODO
  // // http://www.cnblogs.com/kesalin/archive/2012/12/06/3d_math.html
  // http://hi.baidu.com/dych_cnu/item/a7b78ba58a86e0208819d30f
  frustum: function(left, right, bottom, top, near , far , dest){
    var r2l = right - left,
      t2b = top - bottom,
      f2n = far - near;
      dest = dest || mat4.create() ;
          
      dest[0] = (2 * near)/r2l;  dest[1] = 0;            dest[2] = (right + left)/r2l;    dest[3] = 0;
      dest[4] = 0;            dest[5] = (2 * near)/t2b;  dest[6] = (top + bottom)/t2b;    dest[7] = 0;
      dest[8] = 0;            dest[9] = 0;            dest[10] = -(far + near)/f2n;  dest[11] = -(far * near * 2) / f2n;
      dest[12] = 0;           dest[13] = 0;           dest[14] = -1;            dest[15] = 0;
      return dest;

  },
  perspective: function(fov, aspect, near, far, dest){
    var top = near * Math.tan(fov * Math.PI / 360),
      bottom = -top,
      left = bottom * aspect,
      right = top * aspect;
      dest = dest || mat4.create() ;

      return mat4.frustum(left, right, bottom, top, near, far, dest); 
  },
  project: function(fov, aspect, near, far, dest){
    var rate = 1/ Math.tan(fov * Math.PI / 360);
    var matrix = mat4.create();
    return mat4.set(matrix, 
      rate / fov, 0, 0, 0,
      0 , rate, 0, 0,
      0 , 0, far/ (far - near), far * near /(near - far),
      0, 0, 1 , 0
      )

  },
  // http://stackoverflow.com/questions/349050/calculating-a-lookat-matrix
  // get a transformer from camera to origin
  lookAt: function(eye, center, up, dest){
    var z = vec3.normalize( vec3.sub(center, eye ,  []) );
    var x = vec3.normalize( vec3.cross(up, z, []) );
    var y = vec3.cross(z, x, []);
    // console.log(z,x,y,'------')
    return mat4.set(dest || mat4.ident(), 
            x[0], x[1], x[2], -vec3.dot(x, eye),
            y[0], y[1], y[2], -vec3.dot(y, eye),
            z[0], z[1], z[2], -vec3.dot(z, eye),
            0,   0,   0,   1);
  }

})

function changeMin(v){
  var min = Math.min(v[0], Math.min(v[1], v[2]))
  var flag= min == v[0]? 0 :(min == v[1]? 1: 2);
  v[flag]=1;
  return v;
}


var log  = function(m){
  if(m.length !== 16) return console.log(m);
  var str = ""
  for(var i =0; i< 4; i++){
    str += [].slice.call(m, i*4, i*4+4).join("," ) + "\n"
  }
  console.log(str)
}

window.mat4 = mat4;
window.vec3 = vec3;
// log(gmat4.lookAt([],[0,0,1],[0,0,0], [0,1,0]))
// log(mat4.lookAt([0,0,1],[0,0,0], [0,1,0], []))



var m = module.exports = {
  vec3: vec3,
  mat4: mat4,
}


// log(mat4.perspective(90, 1 ,1, 100, []))
// log(mat4.transform(mat4.perspective(90, 1,1, 100, []), [1,2,5]))
// log(Mat4.perspective([], 90, 1, 1, 100))
// log(Mat4.mulVec3(Mat4.perspective([], 90, 1,1, 100),[1,2,5]))

console.timeEnd(1)
console.log( )

