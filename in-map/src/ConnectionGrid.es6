import {createLogger} from 'instalog';

import {gamlib} from './lib/gamlib-ai.es6';


const LOGGER = createLogger('in-map.connectionGrid');

class ConnectionGrid {

  constructor() {
    this.width = 300;
    this.height = 150;

    // create grid, defaulting to 'walkable'
    this.grid = new gamlib.AStarArray(this.width, this.height);
  }

  clearPosition(position) {
    this.setWalkableAt(position.x, -position.z, 0);
  }

  blockPosition(position) {
    this.setWalkableAt(position.x, -position.z, -1);
  }

  setWalkableAt(x, y, value) {
    if (x === 0 || y === 0) {
      return;
    }

    try {
      // set our field, values less then 0 mean 'not walkable' whereas 0 or higher means walkable
      this.grid.setValue(x, y, value); // make upper left corner not walkable
    } catch (err) {
      LOGGER.debug('cannot set position for:', x, y);
      LOGGER.error(err);
    }
  }

  getPath({fromX, fromY, toX, toY}) {
    this.setWalkableAt(fromX, fromY, 0);
    this.setWalkableAt(toX, toY, 0);

    const path = this.grid.find(fromX, fromY, toX, toY);

    this.setWalkableAt(fromX, fromY, -1);
    this.setWalkableAt(toX, toY, -1);

    if (path.length > 1) {
      return path;
    }

    return undefined;
  }
}

const grid = new ConnectionGrid();
export default grid;
