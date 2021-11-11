/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import useResizeObserver from 'in-hooks/useResizeObserver';

import locals from './ExternallyDefinedWidthAndHeight.mless';

interface ChildProps extends React.HTMLAttributes<HTMLElement> {
  width?: number | string;
  height?: number | string;
}
export interface Props {
  children: (props: ChildProps) => React.ReactNode;
}

export default function ExternallyDefinedWidthAndHeight({ children }: Props) {
  const { ref, width, height } = useResizeObserver();
  return (
    <div className={locals.outterWrapper} ref={ref as React.MutableRefObject<HTMLDivElement>}>
      {width && <div className={locals.innerWrapper}>{children({ width, height })}</div>}
    </div>
  );
}
