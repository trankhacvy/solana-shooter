import BlitterBase from '../blitterbase/BlitterBase.js';
import ImageData from '../blitterbase/bob/image/ImageData.js';

export default Blitter;

declare class Blitter extends BlitterBase {
    addImage(
        frame: string
    ): this;

    addImage(
        config: ImageData.IModifyConfig
    ): this;
}