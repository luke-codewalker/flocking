class Vehicle {
  constructor(x, y) {
    this.width = 10;
    this.length = 20;
    this.position = new Vector(x, y);
    this.velocity = new Vector(random(-1, 1), random(-1, 1));
    this.acceleration = new Vector(0, 0);
    this.maxSpeed = 2;
    this.maxSteering = 0.125;
  }

  display(strokeColor, fillColor) {
    const w = this.width;
    const l = this.length;
    const heading = this.velocity.heading();
    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(heading);
    ctx.beginPath();
    ctx.moveTo(- l / 2, - w / 2);
    ctx.lineTo(l / 2, 0);
    ctx.lineTo(- l / 2, w / 2);
    ctx.arcTo(l / 2, 0, - l / 2, - w / 2, w / 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  applyForce(force) {
    // add force to acceleration, all forces sum up to one acceleration
    this.acceleration = Vector.add(this.acceleration, force);
  }

  update() {
    // change velocity according to the acceleration but don't exceed the maximum speed
    this.velocity = Vector.add(this.velocity, this.acceleration);
    this.velocity.limit(this.maxSpeed);
    // move position and null out the acceleration for the next frame
    this.position = Vector.add(this.position, this.velocity);
    this.acceleration.mult(0);
  }

  // behaviors
  seek(target) {
    const desired = Vector.sub(target, this.position);
    desired.setMag(this.maxSpeed);
    const steering = Vector.sub(desired, this.velocity);
    return steering.limit(this.maxSteering);
  }

  separate(targets) {
    let sum = new Vector(0, 0);
    let count = 0;
    for (const other of targets) {
        const distance = Vector.dist(this.position, other.position);
        let desiredSeparation = this.length * 4;
        if (distance > 0 && distance < desiredSeparation) {
            // get the vector pointing away from the other vehicle
            let difference = Vector.sub(this.position, other.position);
            // weight it by the distance to that vehicle (the closer the stronger the repulsion)
            difference.norm();
            difference.mult(1 / distance);

            sum = Vector.add(sum, difference);
            count++;
        }
    }

    if (count > 0) {
        // if we have accumulated some distances we apply steering based on their average
        const desired = Vector.mult(sum, 1 / count);
        desired.setMag(this.maxSpeed);
        const steering = Vector.sub(desired, this.velocity);
        return steering.limit(this.maxSteering);
    } else {
        // if not the desired separation is nothing
        return new Vector(0, 0);
    }
  }

  align(targets) { 
    let sum = new Vector(0, 0);
    let count = 0;
    for (const other of targets) {
      const distance = Vector.dist(this.position, other.position);
      const reach = 50;
      if(distance > 0 && distance < reach) {
        // add up the velocities of all other targets
        sum = Vector.add(sum, other.velocity);
        count++;
      }
    }

    if (count > 0) {
      // if we have accumulated some velocities we apply steering based on their average
      const desired = Vector.mult(sum, 1 / count);
      desired.setMag(this.maxSpeed);
      const steering = Vector.sub(desired, this.velocity);
      return steering.limit(this.maxSteering);
    } else {
        // if not the desired alignment is nothing
        return new Vector(0, 0);
    }
  }

  cohesion(targets) {
    let sum = new Vector(0, 0);
    let count = 0;
    for (const other of targets) {
      const distance = Vector.dist(this.position, other.position);
      const reach = 50;
      if(distance > 0 && distance < reach) {
        // add up the velocities of all other targets
        sum = Vector.add(sum, other.position);
        count++;
      }
    }

    if (count > 0) {
      // if we have accumulated some positions we apply steering based on their average
      const desired = Vector.mult(sum, 1 / count);
      return this.seek(desired);
    } else {
        // if not the desired cohesion is nothing
        return new Vector(0, 0);
    }
  }
  
}