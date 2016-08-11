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
                                 .subscribe(({nodes, edges, currentLayoutingStrategy}) => {
                                   if (this.shouldReset || this.currentLayoutingStrategy !== currentLayoutingStrategy) {
                                     nodes.forEach(node => node._wasAutomaticLayouted = false);
                                     this.shouldReset = false;
                                   }

                                   this.currentLayoutingStrategy = currentLayoutingStrategy;
                                   currentLayoutingStrategy(nodes, edges);
                                 });

    this.resetProcessViewLayoutingSubscription = eventBus.on('resetProcessViewLayouting').subscribe(shouldReset => {
      if (shouldReset) {
        this.shouldReset = true;
        eventBus.emit('resetProcessViewLayouting', false);
      }
    });

    this.currentLayoutingStrategySubscription = currentLayoutingStrategy$.distinct.subscribe(() =>
      eventBus.emit('resetProcessViewLayouting', true));

    eventBus.emit('resetProcessViewLayouting', true);
  }

  dispose() {
    this.resetProcessViewLayoutingSubscription.dispose();
    this.currentLayoutingStrategySubscription.dispose();
    this.layoutingSubscription.dispose();
  }
}
