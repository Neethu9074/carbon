import useResizeObserver from 'use-resize-observer/polyfilled';
import { useState, useMemo } from 'react';
import { debounce } from 'lodash';

import { emptyObject } from 'in-services/fixedObjects';

// Implements the wrapper around use-resize-observer that is recommended by the project
// itself when one wants to:
//
// a) Decouple resize observation processing from the resize event itself (via requestAnimationFrame)
// b) Avoid too many events (via debounce)
export default function customUseResizeObserver({ millis = 100 } = emptyObject) {
  const [state, setState] = useState(emptyObject);
  const onResize = useMemo(
    () => debounce(newState => requestAnimationFrame(() => setState(newState)), millis, { leading: true }),
    [millis]
  );
  const { ref } = useResizeObserver({ onResize });
  return { ref, ...state };
}
