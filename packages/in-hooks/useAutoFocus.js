import { useRef, useEffect } from 'react';

import { emptyObject, emptyArray } from 'in-services/fixedObjects';

export default function useAutoFocus({ fieldsToWatch = emptyArray } = emptyObject) {
  const refContainer = useRef(null);
  useEffect(() => {
    refContainer.current?.focus();
  }, fieldsToWatch);
  return refContainer;
}
