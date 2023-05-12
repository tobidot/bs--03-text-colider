import { BoundingBox, Rect } from "../math/Rect";

/**
 * Represents an entity inside the Physics engine.
 */
export interface CollisionProxiable {
    onCollision?: (other: CollisionProxy, collision: Collision) => void;
}

/**
 * Represents an physics entity.
 */
export class CollisionProxy {
    constructor(
        public id: number,
        public outerBox: Rect,
        public reference: CollisionProxiable,
    ) {

    }

    /**
     * A collision has occurred between this entity and another.
     * @param other 
     * @param collision 
     */
    public onCollision(other: CollisionProxy, collision: Collision) {
        if ( !!this.reference.onCollision ) {
            this.reference.onCollision(other, collision);
        }
    }
}

/**
 * Represents a collision between two Axis-Aligned Bounding Boxes (AABBs).
 */
export interface Collision {
    overlap: BoundingBox;
    a: CollisionProxy;
    b: CollisionProxy;
}
