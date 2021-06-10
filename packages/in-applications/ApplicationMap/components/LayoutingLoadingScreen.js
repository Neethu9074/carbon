/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './LayoutingLoadingScreen.mless';

export default connectTo(
  ({ serviceLocatorUid }) => ({
    isLayouting: getServiceLocators(serviceLocatorUid)
      .eventBusServiceLocator.on(SIGNALS.IS_LAYOUTING)
      .throttle(400)
  }),
  function LayoutingLoadingScreen({ isLayouting }) {
    if (!isLayouting) {
      return null;
    }
    return (
      <div className={locals.wrapper}>
        <LoadingIndicator text={t('in-applications:Rendering')} />;
      </div>
    );
  }
);
