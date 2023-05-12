import { Vector2D, Vector2DLike } from "../math";
import { BoundingBox, Rect } from "../math/Rect";
import { Collision, CollisionProxiable, CollisionProxy } from "./Physics";

/**
 * Handles collisions between Axis-Aligned Bounding Boxes (AABBs) that are moving.
 * 
 * A call to `update` will calculate a physics simulation step for each box and
 * on collision, call the `onCollision` callback for each box.
 * 
 * Updates run in fixed time steps.
 * 
 * @module Physics
 */
export class AABBCollisionHandler {
    public collisions = new Array<Collision>(); 
    public proxies: AABBCollisionProxyInterface[] = [];

    constructor(
        public world_box: Rect,
    ) {
    }

    /**
     * Update all proxies and handle collisions.
     * 
     * @param delta_seconds 
     */
    public update(delta_seconds:number): void {
        delta_seconds = 0.016; // 60 FPS
        this.proxies.forEach(proxy => {
            proxy.outerBox.move(proxy.velocity.cpy().mul(delta_seconds));
        });
        this.handleCollisions();
        this.handleWorldCollisions();
    }

    /**
     * Handles collisions between the world box and the AABBs.
     */
    public handleWorldCollisions() {
        // inset the screen box by the size of the text box,
        // this will be the area the textbox should always touch
        this.proxies.forEach(proxy => {
            const area_of_freedom = this.world_box.cpy().inset(proxy.outerBox.size);
            const distance = area_of_freedom.distance(proxy.outerBox);
            if (Math.abs(distance.x) > 0) {
                proxy.velocity.x = Math.abs(proxy.velocity.x) * ((distance.x > 0) ? -1 : 1);
                proxy.outerBox.center.x -= distance.x * 2;
            }
            if (Math.abs(distance.y) > 0) {
                proxy.velocity.y = Math.abs(proxy.velocity.y) * ((distance.y > 0) ? -1 : 1);
                proxy.outerBox.center.y -= distance.y * 2;
            }
        });
    }

    /**
     * Handles collisions between the AABBs.
     */
    public handleCollisions() {
        this.collisions = [];
        this.proxies.forEach(proxy => {
            this.proxies.forEach(other => {
                if (proxy === other) return;
                const overlap = proxy.outerBox.overlap(other.outerBox);
                if (overlap.bottom > overlap.top && overlap.right > overlap.left) {
                    const collision : AABBCollision = {
                        overlap: overlap,
                        a: proxy,
                        b: other,
                    }
                    this.solveCollision(collision);
                    proxy.onCollision(other, collision);
                    other.onCollision(proxy, collision);    
                    this.collisions.push(collision);
                }
            });
        });
    }

    /**
     * Handles a collision between two AABBs.
     * @param collision 
     */
    public solveCollision(collision: AABBCollision) {
        const {overlap,a, b} = collision;
        const overlap_rect = Rect.fromBoundingBox(overlap);
        if (overlap_rect.w < overlap_rect.h) {
            // if the overlap is taller than it is wide, then the collision is horizontal
            const a_direction = (overlap_rect.center.x < a.outerBox.center.x) ? 1 : -1;
            a.velocity.x = Math.abs(a.velocity.x) * a_direction;
            a.outerBox.center.x += overlap_rect.w / 2 * a_direction;
            const b_direction = (overlap_rect.center.x < b.outerBox.center.x) ? 1 : -1;
            b.velocity.x = Math.abs(b.velocity.x) * b_direction;
            b.outerBox.center.x += overlap_rect.w / 2 * b_direction;
        } else {                        
            // if the overlap is wider than it is tall, then the collision is vertical
            const a_direction = (overlap_rect.center.y < a.outerBox.center.y) ? 1 : -1;
            a.velocity.y = Math.abs(a.velocity.y) * a_direction;
            a.outerBox.center.y += overlap_rect.h / 2 * a_direction;
            const b_direction = (overlap_rect.center.y < b.outerBox.center.y) ? 1 : -1;
            b.velocity.y = Math.abs(b.velocity.y) * b_direction;
            b.outerBox.center.y += overlap_rect.h / 2 * b_direction;
        }
    }

    public add(proxy: AABBCollisionProxyInterface) {
        this.proxies.push(proxy);
    }

    public remove(proxy: AABBCollisionProxyInterface) {
        this.proxies = this.proxies.filter(p => p.id !== proxy.id);
    }
}

/**
 * Represents a collision between two moving Axis-Aligned Bounding Boxes (AABBs).
 */
export interface AABBCollision extends Collision {
    a: AABBCollisionProxyInterface;
    b: AABBCollisionProxyInterface;
}


/**
 * Minimal interface to serve as an entity inside the Physics engine.
 */
export interface AABBCollisionProxyInterface extends CollisionProxy {
    id: number;
    outerBox: Rect;
    velocity: Vector2D;
    onCollision: (other: CollisionProxy, collision: Collision) => void;
}


/**
 * Represents an entity with an Axis-Aligned Bounding Box (AABB) that is moving.
 */
export class AABBCollisionProxy extends CollisionProxy implements AABBCollisionProxyInterface {
    constructor(
        id: number,
        outerBox: Rect,
        public velocity: Vector2D,
        reference: CollisionProxiable,
    ) {
        super(id, outerBox, reference);
    }
}