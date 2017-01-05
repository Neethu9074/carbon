import {create} from 'reactive-observables';

import SimpleLayouter from 'in-map/misc/physical/layoutingStrategies/SimpleLayouter';
import PackedLayouter from 'in-map/misc/physical/layoutingStrategies/PackedLayouter';
import {settings$} from 'in-services/settings/settings';
import {always} from 'in-services/fixedStreams';


export const simpleLayouting$ = always({
  applyLayout: SimpleLayouter,
  config: {}
});

export const packedLayouting$ = settings$.map(settings => {
  return {
    applyLayout: PackedLayouter,
    config: {
      packingXSpace: settings.getIn(['map', 'packingXSpace']),
      packingYSpace: settings.getIn(['map', 'packingYSpace'])
    }
  };
});


export const currentLayoutingStrategy$ = create().emit(simpleLayouting$);

export function setLayoutingStrategy(newLayouting$) {
  currentLayoutingStrategy$.emit(newLayouting$);
}
