/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

interface Props {
  getHasDataToRender: () => Observable<boolean>;
}

export default function EmptyStateHandler(props: React.PropsWithChildren<Props>) {
  const { children, getHasDataToRender } = props;

  const hasDataToRender = useObservable(getHasDataToRender().distinct(), [getHasDataToRender]) ?? true;
  if (hasDataToRender) {
    return children;
  } else {
    return false;
  }
}
