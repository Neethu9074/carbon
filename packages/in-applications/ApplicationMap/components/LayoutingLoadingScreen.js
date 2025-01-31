/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { t } from 'in-i18n';

import locals from './LayoutingLoadingScreen.mless';

export default function LayoutingLoadingScreen({ serviceLocatorUid }) {
  const isLayouting = useObservable(
    getServiceLocators(serviceLocatorUid).eventBusServiceLocator.on(SIGNALS.IS_LAYOUTING).throttle(400),
    []
  );

  if (!isLayouting) {
    return null;
  }
  return (
    <div className={locals.wrapper}>
      <LoadingIndicator text={t('in-applications:Rendering')} />;
    </div>
  );
}
