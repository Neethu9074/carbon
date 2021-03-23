/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import React from 'react';

import { activeDialogs$ } from 'in-components/DialogPresenter/store';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';

export default function DialogPresenter() {
  const activeDialogs = useObservable(activeDialogs$, []) ?? [];
  useDisabledBodyScroll(activeDialogs.length > 0);
  return <>{React.Children.map(activeDialogs, (dialog, index) => React.cloneElement(dialog, { key: index }))}</>;
}
