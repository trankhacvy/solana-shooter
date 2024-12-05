import Phaser from "phaser";

function selectButton(
    buttonImage: Phaser.GameObjects.Image,
    buttonSelector?: Phaser.GameObjects.Image,
    scale = 1.05
) {
    buttonImage.setScale(scale);

    if (buttonSelector) {
        buttonSelector
            .setPosition(
                buttonImage.x + buttonImage.width / 2,
                buttonImage.y + 30
            )
            .setVisible(true);
    }
}

function unselectButton(
    buttonImage: Phaser.GameObjects.Image,
    buttonSelector?: Phaser.GameObjects.Image,
    scale = 1
) {
    buttonImage.setScale(scale);

    if (buttonSelector) {
        buttonSelector.setVisible(false);
    }
}

export { selectButton, unselectButton };

