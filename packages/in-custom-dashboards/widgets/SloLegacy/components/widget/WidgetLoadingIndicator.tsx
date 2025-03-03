/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { HorizontalIndicator } from '@instana/components';
import { Progress } from '@instana/types';

import locals from './WidgetLoadingIndicator.mless';

interface WidgetLoader {
  progress: Progress;
}
export default function WidgetLoadingIndicator({ progress }: WidgetLoader) {
  return (
    <div className={locals.loaderContainer} data-testid="widget-loader">
      {progress.loading && <HorizontalIndicator progress={progress} />}
    </div>
  );
}
