/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

import SimpleLayouter from 'in-map/misc/physical/layoutingStrategies/SimpleLayouter';
import PackedLayouter from 'in-map/misc/physical/layoutingStrategies/PackedLayouter';
import { setSingle, getSetting$, settings$ } from 'in-services/settings';
import { always } from 'in-services/fixedStreams';

export const simpleLayouting$ = always({
  applyLayout: SimpleLayouter,
  config: {}
});

export const packedLayouting$ = settings$.map(settings => {
  return {
    applyLayout: PackedLayouter,
    config: {
      packingXSpace: settings['map_packingXSpace'],
      packingYSpace: settings['map_packingYSpace']
    }
  };
});

export const currentLayoutingStrategy$ = create();
getSetting$('map_physical_layouter').once(storedLayouter => {
  if (storedLayouter === 'simple') {
    currentLayoutingStrategy$.emit(simpleLayouting$);
  } else if (storedLayouter === 'packed') {
    currentLayoutingStrategy$.emit(packedLayouting$);
  }
});

export function setLayoutingStrategy(newLayouting$) {
  currentLayoutingStrategy$.emit(newLayouting$);
  if (newLayouting$ === simpleLayouting$) {
    setSingle('map_physical_layouter', 'simple');
  } else if (newLayouting$ === packedLayouting$) {
    setSingle('map_physical_layouter', 'packed');
  }
}
