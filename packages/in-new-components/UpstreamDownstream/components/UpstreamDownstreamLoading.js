import React from 'react';

import { IndeterminateLoadingIndicator } from 'in-new-components/LoadingIndicators';

import locals from './UpstreamDownstreamLoading.mless';

export default function UpstreamDownstreamLoading() {
  return (
    <div className={locals.wrapper}>
      <IndeterminateLoadingIndicator size="96" />
    </div>
  );
}
