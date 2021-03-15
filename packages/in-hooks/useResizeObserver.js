/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import useResizeObserver from 'use-resize-observer/polyfilled';
import { useState, useMemo, useRef, useEffect } from 'react';
import { debounce } from 'lodash';

import { emptyObject } from 'in-services/fixedObjects';

// Implements the wrapper around use-resize-observer that is recommended by the project
// itself when one wants to:
//
// a) Decouple resize observation processing from the resize event itself (via requestAnimationFrame)
// b) Avoid too many events (via debounce)
export default function useResizeObserverCustom({ millis = 100 } = emptyObject) {
  // To allow detection of an unmounted component so that we do not call setState when the
  // component is unmounted.
  const isUnmountedRef = useRef();
  useEffect(() => {
    isUnmountedRef.current = false;
    return () => (isUnmountedRef.current = true);
  });

  const [state, setState] = useState(emptyObject);
  const onResize = useMemo(
    () =>
      debounce(
        newState =>
          requestAnimationFrame(() => {
            if (!isUnmountedRef.current) {
              setState(newState);
            }
          }),
        millis,
        { leading: true }
      ),
    [millis]
  );
  const { ref } = useResizeObserver({ onResize });
  return { ref, ...state };
}
