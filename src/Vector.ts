export interface IPoint {
  x: number;
  y: number;
}

export interface IVector extends IPoint {
  readonly length: number;
  translate(vector: IPoint): void;
  scale(ratio: number): void;
  distanceTo(vector: IPoint): number;
  differenceWith(vector: IPoint): IVector;
}

export class Vector implements IVector {
  static getLength(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
  }

  static getDistance(pointA: IPoint, pointB: IPoint): number {
    return Vector.getLength(pointB.x - pointA.x, pointB.y - pointA.y);
  }

  static getDifference(vectorA: IVector, vectorB: IVector): IVector {
    return new Vector(vectorB.x - vectorA.x, vectorB.y - vectorA.y);
  }

  static sum(vectors: IVector[] | Map<string, IVector>): IVector {
    const result: IVector = new Vector();
    vectors.forEach((vector: IVector) => {
      result.translate(vector);
    });
    return result;
  }

  x: number;
  y: number;
  get length() {
    return Vector.getLength(this.x, this.y);
  }

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  translate({ x, y }: IPoint): void {
    this.x += x;
    this.y += y;
  }

  scale(ratio: number): void {
    this.x *= ratio;
    this.y *= ratio;
  }

  distanceTo(vector: IPoint): number {
    return Vector.getDistance(this, vector);
  }

  differenceWith(vector: IVector): IVector {
    return Vector.getDifference(this, vector);
  }
}

export default Vector;
