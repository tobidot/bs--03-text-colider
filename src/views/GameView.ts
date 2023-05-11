import { GameModel } from "../models/GameModel";
import { View } from "../../library/abstract/mvc/View";

export class GameView implements View {

    public constructor(
        public context: CanvasRenderingContext2D,
    ) {
        this.resetCanvasState();
    }

    public update(delta_ms: number): void {
        // do nothing
    }

    public render(model: GameModel): void {
        this.resetCanvasState();
        // if (model.debug) {
        // }
        
        this.context.fillStyle = "#0f0";
        this.context.fillText(
            model.current_text,
            400,
            300,
        );
        this.context.fillStyle = "#fff";
        model.entities.forEach((entity) => {
            this.context.fillText(
                entity.label,
                entity.hitbox.center.x,
                entity.hitbox.center.y
            );
            if (model.debug) {
                this.context.strokeStyle = "#f00";
                this.context.strokeRect(
                    entity.hitbox.x, entity.hitbox.y,
                    entity.hitbox.w, entity.hitbox.h
                );
            }
        });
    }

    /**
     * Reset default canvas state and paint the background
     */
    protected resetCanvasState() {
        this.context.fillStyle = "#000";
        this.context.fillRect(0, 0, 800, 600);
        this.context.fillStyle = "#fff";
        this.context.font = "46px monospace";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.imageSmoothingEnabled = false;
    }
}