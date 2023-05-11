import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";

export class Entity {
    public area_of_freedom: Rect;
    public hitbox: Rect;
    public velocity: Vector2D;
    public label: string = "";

    constructor(
        label: string,
        screen_box: Rect,
        context: CanvasRenderingContext2D
    ) {
        // set the size of the text box to the size of the text        
        const text_metrics = context.measureText(label);
        const width = text_metrics.actualBoundingBoxRight + text_metrics.actualBoundingBoxLeft;
        const height = text_metrics.actualBoundingBoxAscent + text_metrics.actualBoundingBoxDescent;

        // set the text box to the center of the screen box
        this.hitbox = Rect.fromCenterAndSize({ x: screen_box.w / 2, y: screen_box.h / 2 }, { x: width, y: height });

        // inset the screen box by the size of the text box,
        // this will be the area the textbox should always touch
        this.area_of_freedom = screen_box.cpy().inset(this.hitbox.size);
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
     * Move the text box by the velocity vector
     * and handle collisions with the screen box
     * @param delta_seconds 
     */
    public update(delta_seconds: number) {          
        // update text position
        this.hitbox.move(this.velocity.cpy().mul(delta_seconds / 1000));
        // if the distance to this inner box is greater than 0, the text box is outside the screen box
        const distance = this.area_of_freedom.distance(this.hitbox);
        if (Math.abs(distance.x) > 0) {
            this.velocity.x = Math.abs(this.velocity.x) * ((distance.x > 0) ? -1 : 1);
            this.hitbox.center.x -= distance.x * 2;
        }
        if (Math.abs(distance.y) > 0) {
            this.velocity.y = Math.abs(this.velocity.y) * ((distance.y > 0) ? -1 : 1);
            this.hitbox.center.y -= distance.y * 2;
        }
    }
}