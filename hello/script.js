(function () {
  var TypePath, PhysicsDemo, bind = function (fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  };
  TypePath = function () {
    TypePath.prototype.STEP_SIZE = 2;
    TypePath.prototype.ctx = null;
    TypePath.prototype.lines = [];
    TypePath.prototype.paths = [];
    function TypePath(svg) {
      var childNode, i, len, ref;
      this.svg = svg;
      ref = this.svg.childNodes;
      for (i = 0, len = ref.length; i < len; i++) {
        childNode = ref[i];
        if (childNode.tagName === 'path') {
          this.lines.push(childNode);
        }
      }
    }

    TypePath.prototype.getPoints = function () {
      var i, len, line, path, pathData, point, ref, results, totalLength;
      ref = this.lines;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        line = ref[i];
        path = {};
        totalLength = path.totalLength = ~~line.getTotalLength();
        pathData = [];
        while (totalLength > 0) {
          point = line.getPointAtLength(totalLength);
          pathData.push(point);
          totalLength -= this.STEP_SIZE;
        }
        path.pathData = pathData;
        results.push(this.paths.push(path));
      }
      return results;
    };
    
    TypePath.prototype.getPaths = function () {
      return this.paths;
    };
    return TypePath;
  }();
  PhysicsDemo = function () {
    PhysicsDemo.prototype.AVOID_MOUSE_STRENGTH = 5000;
    PhysicsDemo.prototype.engine = new Physics();
    PhysicsDemo.prototype.sketch = Sketch.create({container: document.getElementById('container')});
    PhysicsDemo.prototype.gui = new dat.GUI();
    PhysicsDemo.prototype.yOffset = 100;
    PhysicsDemo.prototype.xOffset = 300;
    PhysicsDemo.prototype.renderer = null;
    function PhysicsDemo(paths) {
      this.paths = paths;
      this.onmousemove = bind(this.onmousemove, this);
      this.draw = bind(this.draw, this);
      this.engine.integrator = new Verlet();
      this.avoidMouse = new Attraction();
      this.createParticles();
      this.setupGUI();
      this.sketch.draw = this.draw;
      this.sketch.mousemove = this.onmousemove;
    }

    PhysicsDemo.prototype.setupGUI = function () {
      return this.gui.add(this, 'AVOID_MOUSE_STRENGTH', 5000, 15000);
    };
    PhysicsDemo.prototype.createParticles = function () {
      var _buffer, count, i, j, len, len1, max_mass, min_mass, particle, path, pathData, pos_x, pos_y, position, pull, ref, ref1;
      count = 0;
      ref = this.paths;
      for (i = 0, len = ref.length; i < len; i++) {
        path = ref[i];
        ref1 = path.pathData;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          pathData = ref1[j];
          min_mass = 1;
          max_mass = 20;
          particle = new Particle(max(min_mass, max_mass));
          _buffer = 100;
          pos_x = max(random(pathData.x - _buffer), random(pathData.x + _buffer)) + this.sketch.width / 2 - this.xOffset;
          pos_y = max(random(pathData.y - _buffer), random(pathData.y + _buffer)) + this.sketch.height / 2 - this.yOffset;
          position = new Vector(pos_x, pos_y);
          this.count++;
          particle.setRadius(random(5));
          particle.moveTo(position);
          pull = new Attraction();
          pull.target.x = pathData.x + (this.sketch.width / 2 - this.xOffset);
          pull.target.y = pathData.y + (this.sketch.height / 2 - this.yOffset);
          pull.strength = 2800;
          particle.behaviours.push(this.avoidMouse, pull);
          this.engine.particles.push(particle);
        }
      }
      this.avoidMouse.setRadius(100);
      return this.avoidMouse.strength = -this.AVOID_MOUSE_STRENGTH;
    };
    PhysicsDemo.prototype.draw = function () {
      var i, len, particle, ref, results;
      this.engine.step();
      this.avoidMouse.strength = -this.AVOID_MOUSE_STRENGTH;
      ref = this.engine.particles;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        particle = ref[i];
        this.sketch.beginPath();
        this.sketch.arc(particle.pos.x, particle.pos.y, particle.radius, 0, Math.PI * 2);
        results.push(this.sketch.fill());
      }
      return results;
    };
    PhysicsDemo.prototype.onmousemove = function () {
      this.avoidMouse.target.x = this.sketch.mouse.x;
      return this.avoidMouse.target.y = this.sketch.mouse.y;
    };
    return PhysicsDemo;
  }();
  window.onload = function (_this) {
    console.log("loaded");
    return function () {
      var _paths, tp;
      tp = new TypePath(document.getElementById('svgElement'));
      console.log(tp);
      _paths = tp.getPaths();
      console.log('path');
      console.log(_paths);

      PhysicsDemo = new PhysicsDemo(_paths);
      console.log(PhysicsDemo);
      return PhysicsDemo;
    };
  }(this);
}.call(this));