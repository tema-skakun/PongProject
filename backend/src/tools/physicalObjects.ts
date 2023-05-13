import * as math from "mathjs";
import CONFIG from '../constants/constants';
import { GameState } from "../interfaces/GameState";

export function getDotBox(gState: GameState): math.Matrix {
    return math.matrix([
      [gState.dotCoordinate.x, gState.dotCoordinate.x + CONFIG.DOT_WIDTH],
      [gState.dotCoordinate.y, gState.dotCoordinate.y + CONFIG.DOT_HEIGHT],
    ]);
  }

export function getPaddleBox(gState: GameState): math.Matrix {
    return math.matrix([
      [CONFIG.PADDING, CONFIG.PADDING + CONFIG.PADDLE_WIDTH],
      [gState.paddleY, gState.paddleY + CONFIG.PADDLE_HEIGHT],
    ]);
  }

export function getPaddleBox2(gState: GameState): math.Matrix {
    return math.matrix([
      [
        CONFIG.WIDTH - CONFIG.PADDING - CONFIG.PADDLE_WIDTH,
        CONFIG.WIDTH - CONFIG.PADDING,
      ],
      [gState.paddleY2, gState.paddleY2 + CONFIG.PADDLE_HEIGHT],
    ]);
  }

