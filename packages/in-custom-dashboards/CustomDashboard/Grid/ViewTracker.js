/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useEffect } from 'react';

import { viewWidget } from 'in-custom-dashboards/tracker';

export default function ViewTracker({ widget, children }) {
  // We deliberately only want this to run once!
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => viewWidget(widget), []);
  return children;
}
