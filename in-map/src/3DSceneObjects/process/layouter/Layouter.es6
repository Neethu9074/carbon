/* eslint-disable complexity */
import {combineLatest} from 'reactive-observables';

import FruchtermanReingoldLayouter from 'in-map/src/3DSceneObjects/process/layouter/FruchtermanReingoldLayouter';
import InitialPositionLayouter from 'in-map/src/3DSceneObjects/process/layouter/InitialPositionLayouter';
import {layoutingEnabled$, inventar$} from 'in-map/src/stores/process/layouterStore';


export default class Layouter {

  constructor() {
    this.fruchtermanReingoldLayouter = new FruchtermanReingoldLayouter();
    this.initialPositionLayouter = new InitialPositionLayouter();

    this.layoutingSubscription = combineLatest([
      layoutingEnabled$,
      inventar$
    ]).debounce(100)
      .subscribe(props => {
      const isAutoLayoutEnabled = props[0];
      const inventar = props[1];

      isAutoLayoutEnabled ?
        this.fruchtermanReingoldLayouter.applyLayout(inventar) :
        this.initialPositionLayouter.applyLayout(inventar);
    });
  }

  dispose() {
    this.layoutingSubscription.dispose();
  }
}
