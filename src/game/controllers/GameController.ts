import { KeyboardEvent, KeyboardController, KeyboardHandler, KeyName } from "../../library";
import { Controller } from "../../library/abstract/mvc/Controller";
import { ControllerResponse } from "../../library/abstract/mvc/Response";
import { Game } from "../base/Game";
import { Entity } from "../models/Entity";
import { GameModel } from "../models/GameModel";
import { GameView } from "../views/GameView";

export class GameController implements Controller, KeyboardController {

    public constructor(
        public model: GameModel,
    ) {
    }

    /**
     * Start a new game
     */
    public newGame(): ControllerResponse {
        this.model.entities = [];
        this.model.current_text = "Press Enter";
        return null;
    }

    /**
     * @returns true if the game is over
     */
    public isGameOver(): boolean {
        return false;
    }

    /**
     * Update the game state
     * @param delta_seconds 
     * @returns 
     */
    public update(delta_seconds: number): ControllerResponse {
        this.model.update(delta_seconds);
        return null;
    }

    /**
     * Break words into single characters
     */
    public breakWords() {
        const font_width = this.model.context.measureText("_").width;
        // split all entities into single characters
        this.model.entities = this.model.entities
            .reduce(
                (sum: Array<Entity>, entity: Entity) => {
                    if (entity.label.length == 1) {
                        return sum.concat(entity);
                    }
                    return sum.concat(
                        entity.label.split("").map(
                            (char: string, index: number) => {
                                const new_entity = this.model.createEntity(char);
                                new_entity.hitbox.center.y = entity.hitbox.center.y;
                                new_entity.hitbox.center.x = entity.hitbox.left + font_width * index + font_width / 2;
                                return new_entity;
                            }
                        )
                    );
                }, []
            );
    }

    public onKeyUp(event: KeyboardEvent): void {
    }

    public onKeyDown(event: KeyboardEvent): void {
        const kb = window.game.keyboard;
        const is_ctrl_down = kb.getKey(KeyName.Control).is_down;
        if (is_ctrl_down) {
            switch (event.key.name) {
                case KeyName.KeyR:
                    this.newGame();
                    return;
                case KeyName.KeyB:
                    this.breakWords();
                    return;
                case KeyName.KeyD:
                    this.model.debug = !this.model.debug;
                    return;
                case KeyName.KeyC:
                    this.model.current_text = "";
                    return;
            }
        }
        const is_alt_down = kb.getKey(KeyName.Alt).is_down;
        const is_meta_down = kb.getKey(KeyName.Meta).is_down;
        if (!is_alt_down && !is_meta_down && event.key.name.match(/^[a-zA-Z0-9 ]$/)) {
            this.model.current_text += event.key.name;
        }
        if (event.key.name === KeyName.Backspace) {
            this.model.current_text = this.model.current_text.slice(0, -1);
        }
        if (event.key.name === KeyName.Enter) {
            const entity = this.model.createEntity(this.model.current_text);
            if (entity.hitbox.w > 799) {
                this.breakWords();
            }
            this.model.current_text = "";
        }
    }
}