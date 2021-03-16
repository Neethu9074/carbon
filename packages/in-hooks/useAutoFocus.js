/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useRef, useEffect } from 'react';

import { emptyObject, emptyArray } from 'in-services/fixedObjects';

export default function useAutoFocus({ fieldsToWatch = emptyArray } = emptyObject) {
  const refContainer = useRef(null);
  useEffect(() => {
    refContainer.current?.focus();
    // Static analysis is not possible here, because fieldsToWatch is user configurable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, fieldsToWatch);
  return refContainer;
}
