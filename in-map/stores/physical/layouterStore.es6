import {create} from 'reactive-observables';

import SimpleLayouter from 'in-map/misc/physical/layoutingStrategies/SimpleLayouter';
import PackedLayouter from 'in-map/misc/physical/layoutingStrategies/PackedLayouter';
import {setIn, getIn, settings$} from 'in-services/settings';
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


const layouterSettingsPath = ['map', 'physical', 'layouter'];
export const currentLayoutingStrategy$ = create();
getIn(layouterSettingsPath).once(storedLayouter => {
  if (storedLayouter === 'simple') {
    currentLayoutingStrategy$.emit(simpleLayouting$);
  } else if(storedLayouter === 'packed') {
    currentLayoutingStrategy$.emit(packedLayouting$);
  }
});

export function setLayoutingStrategy(newLayouting$) {
  currentLayoutingStrategy$.emit(newLayouting$);
  if (newLayouting$ === simpleLayouting$) {
    setIn(layouterSettingsPath, 'simple');
  } else if(newLayouting$ === packedLayouting$) {
    setIn(layouterSettingsPath, 'packed');
  }
}
