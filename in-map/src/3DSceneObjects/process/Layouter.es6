/* eslint-disable complexity */
import {combineLatest} from 'reactive-observables';

import {currentLayoutingStrategy$} from 'in-map/src/stores/process/layouterStore';
import {edges$} from 'in-map/src/stores/process/edgesStore';
import {nodes$} from 'in-map/src/stores/process/nodesStore';
import {eventBus} from 'in-map/src/services/eventBus';


export default class Layouter {

  constructor() {
    this.layoutingSubscription = combineLatest([nodes$,
                                                edges$,
                                                currentLayoutingStrategy$,
                                                eventBus.on('resetProcessViewLayouting')])
                                 .map(([nodes, edges, currentLayoutingStrategy]) => {
                                   return {
                                     nodes: Object.keys(nodes).map(key => nodes[key]),
                                     edges: Object.keys(edges).map(key => edges[key]),
                                     currentLayoutingStrategy
                                   };
                                 })
                                 .debounce(100)
                                 .subscribe(inventar => inventar.currentLayoutingStrategy.applyLayout(inventar, true));

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
