class ObjectFactory {
    constructor(scene) {
        this.scene = scene;

        scene.sys.events.once('destroy', this.destroy, this);
    }

    destroy() {
        this.scene = null;
    }

    static register(type, callback) {
        ObjectFactory.prototype[type] = callback;
    }
};
export default ObjectFactory;