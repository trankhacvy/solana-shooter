import Enemy from "./EnemyV2";
import {
    DeadState,
    IdleState,
    MoveUpState,
    MoveDownState,
    MoveRightState,
    MoveLeftState,
} from "./states";

export type EnemyStateType =
    | "idle"
    | "moveLeft"
    | "moveRight"
    | "moveDown"
    | "moveUp"
    | "dead";

export default class EnemyStateController {
    private states: { [key: string]: { enter: () => void } };

    private currentState = { enter: () => {} };

    constructor(enemy: Enemy) {
        this.states = {
            idle: new IdleState(enemy),
            moveLeft: new MoveLeftState(enemy),
            moveRight: new MoveRightState(enemy),
            moveDown: new MoveDownState(enemy),
            moveUp: new MoveUpState(enemy),
            dead: new DeadState(enemy),
        };
    }

    setState(name: EnemyStateType) {
        if (this.currentState === this.states[name]) {
            return;
        }

        this.currentState = this.states[name];
        this.currentState.enter();
    }
}

