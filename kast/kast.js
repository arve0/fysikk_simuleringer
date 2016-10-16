var parameters = document.getElementById('parameters');
var coordinatesystem = document.getElementById('koordinatsystem');
var ctx = coordinatesystem.getContext('2d');

parameters.drag.onchange = (event) => {
  parameters.drag_x.value = event.target.value;
  parameters.drag_y.value = event.target.value;
}

window.onresize = () => {
  coordinateResize();
}

function coordinateResize () {
  ctx.save();
  coordinatesystem.width = window.innerWidth - 20;
  coordinatesystem.height = window.innerHeight - parameters.offsetHeight - 20;
  ctx.translate(0, coordinatesystem.height);  // y = 0 in bottom of canvas
}

setInterval(numericThrow, 100);

coordinateResize();

/**
 * Eulers method
 *
 * s = s_prev + v t
 *
 * v = v_prev + a t
 *
 * a_x = -Kv_x^2/m
 * a_y = -(g + Kv_x^2/m)
 */
function numericThrow () {
  ctx.restore();
  ctx.clearRect(0, 0, coordinatesystem.width, coordinatesystem.height);
  coordinateResize();

  var x_0 = parseFloat(parameters.x_0.value);
  var y_0 = parseFloat(parameters.y_0.value);
  var v_0 = parseFloat(parameters.v_0.value);
  var angle = parseFloat(parameters.angle.value);
  var g = parseFloat(parameters.gravity.value);
  var K = {
    x: parseFloat(parameters.drag_x.value),
    y: parseFloat(parameters.drag_y.value)
  };
  var m = parseFloat(parameters.mass.value);

  var v = {
    x: v_0 * Math.cos(angle / 180 * Math.PI),
    y: v_0 * Math.sin(angle / 180 * Math.PI)
  };
  var a = { x: 0, y: g };

  // green without drag
  var K_no_drag = { x: 0, y: 0 };
  draw(x_0, y_0, v, a, K_no_drag, g, m, '#00ff00');
  draw(x_0, y_0, v, a, K, g, m, '#000000');
}

function last (arr) {
  return arr[arr.length - 1];
}

var xs, ys;
function draw (x0, y0, v_0, a_0, K, g, m, color) {
  var scale = 100;
  var delta_t = 0.01;
  var i = 0;
  ctx.strokeStyle = color || '#000000';

  xs = [x0];
  ys = [y0];

  // copy, do not use reference
  var v = Object.assign({}, v_0);
  var a = Object.assign({}, a_0);

  ctx.beginPath();
  ctx.moveTo(scale * xs[0], -scale * ys[0]);

  while (i < 1000
         && scale * last(xs) < coordinatesystem.width
         && last(ys) >= 0) {
    var x = last(xs) + v.x * delta_t;
    var y = last(ys) + v.y * delta_t;

    xs.push(x);
    ys.push(y);

    v.x += a.x * delta_t;
    v.y += a.y * delta_t;

    a.x = - K.x * Math.pow(v.x, 2) / m;
    a.y = g - Math.sign(v.y) * K.y * Math.pow(v.y, 2) / m;

    if (i % 40 === 0) {
      ctx.font = '16px arial';
      var xx = x*scale;
      var yy = -y*scale + (color === '#000000' ? 0 : -20);
      ctx.strokeText(`a=[${a.x.toFixed(1)}, ${a.y.toFixed(1)}]  v=[${v.x.toFixed(1)}, ${v.y.toFixed(1)}]`, xx, yy);
    }

    ctx.lineTo(scale * last(xs), -scale * last(ys));
    ctx.stroke();

    i += 1;

  }
  ctx.closePath();
}
