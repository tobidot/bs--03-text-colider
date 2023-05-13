import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { AABBCollisionProxy } from "../../library/physics/AABBPhysicsEngine";
import { PhysicsProxiable, PhysicsProxy } from "../../library/physics/Physics";

export class Entity implements PhysicsProxiable {
    public static next_id = 0;
    public id: number = Entity.next_id++;
    // 
    public hitbox: Rect;
    public velocity: Vector2D;
    public label: string = "";
    public reference: Entity;
    public color: string = "white";
    public physics_id: number|null = null;

    constructor(
        position: Vector2D,
        label: string,
        context: CanvasRenderingContext2D
    ) {
        this.reference = this;
        // set the size of the text box to the size of the text        
        const text_metrics = context.measureText(label);
        const width = text_metrics.actualBoundingBoxRight + text_metrics.actualBoundingBoxLeft;
        const height = text_metrics.actualBoundingBoxAscent + text_metrics.actualBoundingBoxDescent;

        // set the text box to the center of the screen box
        // 
        this.hitbox = Rect.fromCenterAndSize(position, { x: width, y: height });

        this.label = label;
        // assuming the text only contains numbers and letters convert a character to a value
        const charToValue = (c: string) => c.match(/[0-9]/) 
            ? c.charCodeAt(0) - '0'.charCodeAt(0) 
            : c.match(/[a-z]/) 
                ? c.charCodeAt(0) - 'a'.charCodeAt(0)
                : c.charCodeAt(0) - 'A'.charCodeAt(0);
        // sum all the values
        const angle_degrees = this.label.split('')
            .map(charToValue)
            .reduce((a, b) => a + b, 0);
        // set the velocity based on the label
        this.velocity = Vector2D.fromAngle(angle_degrees * Math.PI / 26, 100);
    }

    /**
     * 
     * @param delta_seconds 
     */
    public update(delta_seconds: number) {     
        // do nothing currently handled by the physics engine
    }

    /**
     * 
     * @param other 
     */
    public onCollision(other: PhysicsProxy) {
        // on collision 
        this.color = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    }   
}