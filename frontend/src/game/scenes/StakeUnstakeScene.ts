import Phaser from "phaser";
import RoundRectangleCanvas from "@/phaser3-rex-notes/plugins/roundrectanglecanvas";
import constants from "../config/constants";
import {
    Anchor,
    Dialog,
    ConfirmDialog,
} from "@/phaser3-rex-notes/templates/ui/ui-components";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class StakeUnstakeScene extends Phaser.Scene {
    private currentStake: number;

    constructor() {
        super({ key: constants.SCENES.STAKE_UNSTAKE });
        this.currentStake = 0;
    }

    create() {
        const style = {
            x: 400,
            y: 300,
            // width: 400,
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                item: 20,
                firstName: 20,
                firstNameTitle: 10,
                lastNameTitle: 10,
            },

            background: {
                color: 0x260e04,
                strokeColor: 0x7b5e57,
                strokeWidth: 4,
                radius: 10,
            },

            title: {
                text: { fontSize: 24 },
            },

            layoutMode: 1,

            nameTitle: {
                width: 90,
                height: 24,
            },

            nameInput: {
                width: 210,
                height: 24,
                background: {
                    color: 0xffffff,
                    "focus.color": 0xffffff,
                },
                style: {
                    color: "red",
                    backgroundBottomY: 4,
                    backgroundHeight: 18,
                },
            },

            button: {
                space: { left: 5, right: 5, top: 5, bottom: 5 },

                background: {
                    color: COLOR_DARK,
                    radius: 5,
                    "hover.strokeColor": 0xffffff,
                },

                text: { fontSize: 20 },
            },
        } as any;

        this.rexUI.add
            .nameInputDialog(style)
            .setPosition(this.scale.width / 2, this.scale.height / 2)
            .setOrigin(0.5, 0.5)
            .setDraggable("title")
            .resetDisplayContent({
                title: "Stake/Unstake $DOGO",
                firstNameTitle: "Stake",
                lastNameTitle: "Unstake",
                button: "Submit",

                firstName: "",
                lastName: "",
            })
            .layout()
            .modalPromise()
            .then(function (data) {
                console.log(data);
            });
    }
}

