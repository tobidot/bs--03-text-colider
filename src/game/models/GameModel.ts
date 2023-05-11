import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Entity } from "./Entity";

export class GameModel {
    public entities: Entity[] = [];
    public screen_box: Rect;
    public current_text: string = "";
    public debug: boolean = false;

    constructor(
        public context: CanvasRenderingContext2D,
    ) {
        this.screen_box = new Rect(0, 0, context.canvas.width, context.canvas.height);
    }

    public update(delta_seconds: number) {
        this.entities.forEach((entity) => {
            entity.update(delta_seconds);
        });
    }

    /**
     * Create a new entity with the given label
     * @param label 
     * @returns 
     */
    public createEntity(label: string) :Entity {
        let entity: Entity;
        this.entities.push(entity = new Entity(
            label, 
            this.screen_box,
            this.context
        ));
        return entity;
    }
}