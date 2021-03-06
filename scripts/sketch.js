//Created and maintained by Natalie Orsi at http://natalieorsi.net
//Inspired by a project by Daniel Shiffman

// texture for the particle
var particle_texture;

// variable holding our particle systems
var systems;

function preload() {
    particle_texture = loadImage("data/smoke.png");
}

function setup() {
    //set the canvas size
    //createCanvas(640,360);
    canvas = createCanvas(.9*window.innerWidth, .9*window.innerHeight);
    canvas.position(window.innerWidth*.05, window.innerHeight*.05);
    canvas.class("fireflies");
    canvas.parent("bottle");
    systems = [];
    //initialize our particle system
}

function draw() {
    background(0);

    var rand1 = random(-1,0)
    var rand2 = random(0,1)
    
    var dx = map(mouseX,0,width,rand1,rand2);

    for (var j = 0; j < systems.length; ++j) {
      var rand3 = random(-2,2)
      var wind = createVector(-dx,rand3);
      systems[j].applyForce(wind);

      systems[j].run();
      systems[j].addParticle();
    }
}

function mousePressed() {
  var rand1 = random(0,4)
  this.p = new ParticleSystem(rand1, createVector(mouseX,mouseY),particle_texture);
  systems.push(p);
  if (systems.length > 8) {
    systems.splice(0,1);
  }
}
//========= PARTICLE SYSTEM ===========

/**
 * A basic particle system class
 * @param num the number of particles
 * @param v the origin of the particle system
 * @param img_ a texture for each particle in the system
 * @constructor
 */
var ParticleSystem = function(num,v,img_) {

    this.particles = [];
    this.origin = v.copy();
    this.img = img_
    for(var i = 0; i < num; ++i){
        this.particles.push(new Particle(this.origin,this.img));
    }
};

/**
 * This function runs the entire particle system.
 */
ParticleSystem.prototype.run = function() {

    // cache length of the array we're going to loop into a variable
    // You may see <variable>.length in a for loop, from time to time but
    // we cache it here because otherwise the length is re-calculated for each iteration of a loop
    var len = this.particles.length;

    //loop through and run particles
    for (var i = len - 1; i >= 0; i--) {
        var particle = this.particles[i];
        particle.run();

        // if the particle is dead, we remove it.
        // javascript arrays don't have a "remove" function but "splice" works just as well.
        // we feed it an index to start at, then how many numbers from that point to remove.
        if (particle.isDead()) {
            this.particles.splice(i,1);
        }
    }
}

/**
 * Method to add a force vector to all particles currently in the system
 * @param dir a p5.Vector describing the direction of the force.
 */
ParticleSystem.prototype.applyForce = function(dir) {
    var len = this.particles.length;
    for(var i = 0; i < len; ++i){
        this.particles[i].applyForce(dir);
    }
}

/**
 * Adds a new particle to the system at the origin of the system and with
 * the originally set texture.
 */
ParticleSystem.prototype.addParticle = function() {
    this.particles.push(new Particle(this.origin,this.img));
}

//========= PARTICLE  ===========
/**
 *  A simple Particle class, renders the particle as an image
 */
var Particle = function (pos, img_) {
    this.loc = pos.copy();

    var vx = randomGaussian() * 0.2;
    var vy = randomGaussian() * 0.95 - 1.0;

    this.vel = createVector(vx,vy);
    this.acc = createVector();
    this.lifespan = 20.0;
    this.texture = img_;
}

/**
 *  Simulataneously updates and displays a particle.
 */
Particle.prototype.run = function() {
    this.update();
    this.render();
}

/**
 *  A function to display a particle
 */
Particle.prototype.render = function() {
    imageMode(CENTER);
    tint(255,this.lifespan);
    image(this.texture,this.loc.x,this.loc.y);
}

/**
 *  A method to apply a force vector to a particle.
 */
Particle.prototype.applyForce = function(f) {
    this.acc.add(f);
}

/**
 *  This method checks to see if the particle has reached the end of it's lifespan,
 *  if it has, return true, otherwise return false.
 */
Particle.prototype.isDead = function () {
    if (this.lifespan <= 0.0) {
        return true;
    } else {
        return false;
    }
}

/**
 *  This method updates the position of the particle.
 */
Particle.prototype.update = function() {
    this.vel.add(this.acc);
    this.loc.add(this.vel);
    this.lifespan -= 2.5;
    this.acc.mult(0);
}