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
var xs, ys;
function numericThrow () {
  ctx.restore();
  ctx.clearRect(0, 0, coordinatesystem.width, coordinatesystem.height);
  coordinateResize();

  var scale = 100;
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

  ctx.moveTo(scale * x_0, -scale * y_0);

  xs = [x_0];
  ys = [y_0];
  var delta_t = 0.01;
  var v = {
    x: v_0 * Math.cos(angle / 180 * Math.PI),
    y: v_0 * Math.sin(angle / 180 * Math.PI)
  };
  var a = { x: 0, y: g };

  var i = 0;

  while (i < 1000 && scale * last(ys) >= 0 && scale * last(xs) < coordinatesystem.width) {
    var x = last(xs) + v.x * delta_t;
    var y = last(ys) + v.y * delta_t;

    xs.push(x);
    ys.push(y);

    v.x += a.x * delta_t;
    v.y += a.y * delta_t;

    a.x = - K.x * Math.pow(v.x, 2) / m;
    a.y = g - K.y * Math.pow(v.y, 2) / m;

    ctx.lineTo(scale * last(xs), -scale * last(ys));
    ctx.stroke();

    i += 1;
  }
}

function last (arr) {
  return arr[arr.length - 1];
}
