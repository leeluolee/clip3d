var color = module.exports = {
  hash2rgb: function( hash ){
    var str = hash.charAt(0) === '#'? hash.slice(1) : hash;
    var channels;
    if ( str.length === 6) {
        channels = [
          parseInt( str.substr(0, 2), 16), 
          parseInt( str.substr(2, 2), 16), 
          parseInt( str.substr(4, 2), 16),
          1
        ];
    }else {
        var r =  str.substr(0, 1);
        var g =  str.substr(1, 1);
        var b =  str.substr(2, 1);
        channels = [
            parseInt(r + r, 16), 
            parseInt(g + g, 16), 
            parseInt(b + b, 16),
            1
        ];
    }
    return color.limit(channels); 
  },
  //@copyright
  //https://github.com/bgrins/TinyColor
  rgb2hsl: function(rv, hv){
    hv = hv || [];
    var r = rv[0]/ 255,
        g = rv[1]/ 255,
        b = rv[2]/ 255,
        max = Math.max(r, g, b), 
        min = Math.min(r, g, b),
        h, s, l = (max + min) / 2,
        d;

    if(max == min) {
        h = 0; 
        s = 0;
    }
    else {
        var d = max - min;
        s = l >= 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    hv[0] = h * 360;
    hv[1] = s * 100;
    hv[2] = l * 100;
    hv[3] = rv[3];
    return hv;
  },
  hsl2rgb: function(hv, rv){
    rv = rv || [];
    var r, g, b,
        h = hv[0]/360,
        s = hv[1]/100,
        l = hv[2]/100;

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    rv[0] = r * 255;
    rv[1] = g * 255;
    rv[2] = b * 255;
    rv[3] = hv[3];
    return rv;
  },
  rgb2css: function(rgb){
    var r = Math.round(rgb[0]),
        g = Math.round(rgb[1]),
        b = Math.round(rgb[2]),
        a = typeof rgb[3] !== "number"? 1 : rgb[3];
    if( a === 1){
        var rs = r.toString(16),
            gs = g.toString(16),
            bs = b.toString(16)
        if(rs.length === 1) rs = '0' + rs;
        if(gs.length === 1) gs = '0' + gs;
        if(bs.length === 1) bs = '0' + bs;
        // #ffffff -> #fff
        if(rs[0] == rs[1] && gs[0] == gs[1] && bs[0] == bs[1]){
            gs = gs[0]
            bs = bs[0]
            rs = rs[0]
        }
        return '#' + rs + gs + bs;
    }else{
        return 'rgba(' + r + ',' + g + ',' + b + ',' + rgb.alpha +')';
    }
  },
  limit: function(values){
    values[0] = limit(values[0], 0, 255);
    values[1] = limit(values[1], 0, 255);
    values[2] = limit(values[2], 0, 255);
    values[3] = limit(values[3], 0, 1);
  },
  norm: function(v){
    if(typeof v[3] !== 'number') v[3] = 1;
    return v;
  },
  mix: function(c1, c2, weight){
    color.norm(c1); color.norm(c2);

    var a = c1[3] - c2[3],
      p = weight || 0.5,
      w = p * 2 -1,
      w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0,
      w2 = 1 - w1,
      alpha = c1[3] * p + c2[3]*(1-p),
      channels = [
          c1[0] * w1 + c2[0] * w2,
          c1[1] * w1 + c2[1] * w2,
          c1[2] * w1 + c2[2] * w2,
          alpha
      ];
      return channels;
  }
}

function limit(value, min, max){
  return Math.max( Math.min(value, max) , min)
}
