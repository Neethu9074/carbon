/* eslint-disable complexity */
import {combineLatest} from 'reactive-observables';

import Chessboard from 'in-map/src/3DSceneObjects/process/layoutingStrategies/Chessboard';
// import FR from 'in-map/src/3DSceneObjects/process/layoutingStrategies/FruchtermannReingold';
import {edges$} from 'in-map/src/stores/process/edgesStore';
import {nodes$} from 'in-map/src/stores/process/nodesStore';
import {eventBus} from 'in-map/src/services/eventBus';


export default class Layouter {

  constructor() {
    // this.layoutingStrategy = new FR();
    this.layoutingStrategy = new Chessboard();

    this.layoutingSubscription = combineLatest([nodes$, edges$, eventBus.on('resetProcessViewLayouting')])
                                 .map(([nodes, edges]) => {
                                   return {
                                     nodes: Object.keys(nodes).map(key => nodes[key]),
                                     edges: Object.keys(edges).map(key => edges[key])
                                   };
                                 })
                                 .debounce(100)
                                 .subscribe(inventar => this.layoutingStrategy.applyLayout(inventar, true));

    this.resetProcessViewLayoutingSubscription = eventBus.on('resetProcessViewLayouting').subscribe(shouldReset => {
      if (shouldReset) {
        this.shouldReset = true;
        eventBus.emit('resetProcessViewLayouting', false);
      }
    });

    eventBus.emit('resetProcessViewLayouting', true);
  }

  dispose() {
    this.resetProcessViewLayoutingSubscription.dispose();
    this.layoutingSubscription.dispose();
  }
}
