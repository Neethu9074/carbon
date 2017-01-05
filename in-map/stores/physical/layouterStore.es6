import {create} from 'reactive-observables';

import SimpleLayouter from 'in-map/misc/physical/layoutingStrategies/SimpleLayouter';
import PackedLayouter from 'in-map/misc/physical/layoutingStrategies/PackedLayouter';
import {always} from 'in-services/fixedStreams';


export const simpleLayouting$ = always({
  applyLayout: SimpleLayouter,
  config: {}
});

export const packedLayouting$ = always({
  applyLayout: PackedLayouter,
  config: {}
});

export const currentLayoutingStrategy$ = create().emit(simpleLayouting$);

export function setLayoutingStrategy(newLayouting$) {
  currentLayoutingStrategy$.emit(newLayouting$);
}
