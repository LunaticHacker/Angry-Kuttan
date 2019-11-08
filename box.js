

class Box {

  constructor(x, y, w, h) {
    const options = {
      restitution: 0.5
    }
    this.body = Matter.Bodies.rectangle(x, y, w, h, options);
    this.body.label="kuttan";
    this.body.id =Matter.Common.nextId();
    this.body.collisionFilter.mask=0x0001;
  //  this.body.collisionFilter.group=-2;
    Matter.World.add(world, this.body);
    this.w = w;
    this.h = h;
  }

  show() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    fill(255);
    rectMode(CENTER);
    imageMode(CENTER);
    image(boxImg, 0, 0, this.w, this.h);
    pop();
  }

}
