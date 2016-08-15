/* eslint-disable complexity */
import {combineLatest} from 'reactive-observables';

import {nodePositions$, clearAll} from 'in-map/src/stores/process/logicalLayouterStore';
import {currentLayoutingStrategy$} from 'in-map/src/stores/process/layouterStore';
import {edges$} from 'in-map/src/stores/process/edgesStore';
import {nodes$} from 'in-map/src/stores/process/nodesStore';
import {eventBus} from 'in-map/src/services/eventBus';


export default class Layouter {

  constructor() {
    this.layoutingSubscription = combineLatest([nodes$,
                                                edges$,
                                                currentLayoutingStrategy$,
                                                nodePositions$])
                                 .map(([nodes, edges, currentLayoutingStrategy, nodePositions]) => {
                                   return {
                                     nodes: Object.keys(nodes).map(key => nodes[key]),
                                     edges: Object.keys(edges).map(key => edges[key]),
                                     currentLayoutingStrategy,
                                     nodePositions
                                   };
                                 })
                                 .debounce(100)
                                 .subscribe(({nodes, edges, currentLayoutingStrategy, nodePositions}) => {
                                   currentLayoutingStrategy(nodes, edges, nodePositions);
                                 });

    this.resetProcessViewLayoutingSubscription = eventBus.on('resetProcessViewLayouting').subscribe(shouldReset => {
      if (shouldReset) {
        clearAll();
        eventBus.emit('resetProcessViewLayouting', false);
      }
    });
  }

  dispose() {
    this.resetProcessViewLayoutingSubscription.dispose();
    this.layoutingSubscription.dispose();
  }
}
