// import * as Phaser from 'phaser';

import BoardFactory from './board/board/Factory.js';
import QuadGridFactory from './board/grid/quad/Factory.js';
import HexagonGridFactory from './board/grid/hexagon/Factory.js';

import ShapeFactory from './board/shape/Factory.js';
import ImageFactory from './board/image/Factory.js';
import SpriteFactory from './board/sprite/Factory.js';

import MoveToFactory from './board/moveto/Factory.js';
import PathFinderFactory from './board/pathfinder/Factory.js';
import MatchFactory from './board/match/Factory.js';
import FieldOfViewFactory from './board/fieldofview/Factory.js';
import MonopolyFactory from './board/monopoly/Factory.js';
import MiniBoardFactory from './board/miniboard/Factory.js';

import HexagonMap from './board/hexagonmap/index';
import CreateTileTexture from './board/texture/CreateTileTexture.js';
import CreateBoardFromTilemap from './board/tilemap/CreateBoardFromTilemap.js';

export default BoardPlugin;

declare class Factories {
    board: typeof BoardFactory;
    quadGrid: typeof QuadGridFactory;
    hexagonGrid: typeof HexagonGridFactory;

    shape: typeof ShapeFactory;
    image: typeof ImageFactory;
    sprite: typeof SpriteFactory;

    moveTo: typeof MoveToFactory;
    pathFinder: typeof PathFinderFactory;
    match: typeof MatchFactory;
    fieldOfView: typeof FieldOfViewFactory;
    monopoly: typeof MonopolyFactory;
    miniBoard: typeof MiniBoardFactory;
}

declare class BoardPlugin extends Phaser.Plugins.ScenePlugin {
    add: Factories;

    hexagonMap: HexagonMap;
    createTileTexture: typeof CreateTileTexture;
    createBoardFromTilemap: typeof CreateBoardFromTilemap;
}

import BoardClass from './board/board/Board.js';
import HexagonClass from './board/grid/hexagon/Hexagon.js';
import QuadClass from './board/grid/quad/Quad.js';

import ShapeClass from './board/shape/Shape.js';
import ImageClass from './board/image/Image.js';
import SpriteClass from './board/sprite/Sprite.js';

import MoveToClass from './board/moveto/MoveTo.js';
import MatchClass from './board/match/Match.js';
import PathFinderClass from './board/pathfinder/PathFinder.js';
import FieldOfViewClass from './board/fieldofview/FieldOfView.js';
import MonopolyClass from './board/monopoly/Monopoly.js';
import MiniBoardClass from './board/miniboard/MiniBoard.js';

declare namespace BoardPlugin {
    type Board = BoardClass;
    type Quad = QuadClass;
    type Hexagon = HexagonClass;

    type Shape = ShapeClass;
    type Image = ImageClass;
    type Sprite = SpriteClass;

    type MoveTo = MoveToClass;
    type Match = MatchClass;
    type PathFinder = PathFinderClass;
    type FieldOfView = FieldOfViewClass;
    type Monopoly = MonopolyClass;
    type MiniBoard = MiniBoardClass;
}