/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import useResizeObserver from 'in-hooks/useResizeObserver';

import locals from './ExternallyDefinedWidthAndHeight.mless';

export default function ExternallyDefinedWidthAndHeight({ children }) {
  const { ref, width, height } = useResizeObserver();
  return (
    <div className={locals.outterWrapper} ref={ref}>
      {width && <div className={locals.innerWrapper}>{children({ width, height })}</div>}
    </div>
  );
}
