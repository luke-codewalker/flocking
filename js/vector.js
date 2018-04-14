class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Static methods
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }

    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static mult(v, scalar) {
        return new Vector(v.x * scalar, v.y * scalar);
    }

    static div(v, scalar) {
        return new Vector(v.x / scalar, v.y / scalar);
    }

    static dot(v1, v2) {
        return (v1.x * v2.x + v1.y * v2.y);
    }

    static norm(v) {
        const mag = v.mag();
        return new Vector(v.x / mag, v.y / mag);
    }

    static dist(v1, v2) {
        return Vector.sub(v1, v2).mag()
    }

    static angleBetween(v1, v2) {
        const v1norm = Vector.norm(v1);
        const v2norm = Vector.norm(v2);
        const dotProd = Vector.dot(v1norm, v2norm);
        // We need to clamp the value because of floating point rounding
        // Taken from p5.js!
        return Math.acos(Math.max(-1, Math.min(1, dotProd)));
    }

    static fromAngle(angle, length = 1) {
        return new Vector(Math.cos(angle) * length, Math.sin(angle) * length);
    }

    // scalar projection from point onto line that goes from start to end
    static scalarProjection(point, start, end) {
        const startToPoint = Vector.sub(point, start);
        const line = Vector.sub(end, start);
        line.norm();
        line.mult(Vector.dot(startToPoint, line));
        return Vector.add(start, line);
    }

    // Instance methods
    mult(scalar) {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
        return this;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    magSq() {
        return (this.x * this.x + this.y * this.y);
    }

    norm() {
        const mag = this.mag();
        if(mag !== 0) {
            this.x = this.x / mag;
            this.y = this.y / mag;
        }
        return this;
    }

    setMag(mag) {
        return this.norm().mult(mag);
    }

    limit(mag) {
        if (this.mag() > mag) {
            return this.norm().mult(mag);
        } else {
            return this;
        }
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    rotate(rad) {
        const newHeading = this.heading() + rad;
        const mag = this.mag();
        this.x = Math.cos(newHeading) * mag;
        this.y = Math.sin(newHeading) * mag;
        return this;
    }
}