import { Group, Vector3 } from 'three';

export class PhysicsObject extends Group {
  p: Vector3; // Position
  v: Vector3; // Velocity
  a: Vector3; // Acceleration

  constructor() {
    super();
    this.p = this.position;
    this.v = new Vector3(0, 0, 0);
    this.a = new Vector3(0, 0, 0); // Accelerate downwards
  }

  stepPhysics(delta: number) {
    // Collide/bounce with the floor
    if (this.p.y < 0.0001) {
      // Stop bouncing and sit still
      if (Math.abs(this.v.y) < 1) {
        this.v = new Vector3(0, 0, 0);
        this.p.y = 0;
        return;
      }
      // Bounce
      this.v.y = Math.abs(this.v.y);
    }

    this.v.addScaledVector(this.a, delta); // Update velocity
    this.p.addScaledVector(this.v, delta); // Update position
    this.position.copy(this.p);
  }
}
