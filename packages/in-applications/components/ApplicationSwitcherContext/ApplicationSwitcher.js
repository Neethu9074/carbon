/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon, Button } from '@instana/components';

import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
import { applicationId as matrixApplicationId } from 'in-applications/navigation/matrix';
import WithHealthIndication from 'in-components/health/WithHealthIndication';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { APPLICATION_CLICK_CREATE } from 'in-services/tracking/eventNames';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { CREATED_OBJECT } from 'in-services/util/constants';
import { t, Trans } from 'in-i18n';

import locals from './ApplicationSwitcher.mless';

export default function ApplicationSwitcher({ applicationId, applications, viewPath, delayedOpen, delayedClose }) {
  return (
    <div onMouseEnter={delayedOpen} onMouseLeave={delayedClose}>
      <div className={locals.header}>
        <SvgIcon className={locals.headingIcon} type="lib_application_invert" size="l" />
        <Trans i18nKey="in-applications:applicationSwitcher.header" />
      </div>

      <div className={locals.content}>
        {applications.data.items
          .filter(item => item.application.id === applicationId)
          .map(item => (
            <SelectedItem key={item.application.id} item={item} />
          ))}
        <p className={locals.subSectionHeading}>{t('in-applications:applicationSwitcher.subHeader')}</p>
        <ul className={locals.menu}>
          {applications.data.items
            .filter(item => item.application.id !== applicationId)
            .map(item => (
              <ApplicationButtonItem key={item.application.id} item={item} viewPath={viewPath} />
            ))}
        </ul>
      </div>
    </div>
  );
}

function ApplicationButtonItem({ item, viewPath }) {
  const { unstable_trackEvent } = useSegmentTracking();
  const { location, createHref } = useNavigation();
  setOrDeleteMatrixKey(location, viewPath, matrixApplicationId, item.application.id);

  return (
    <li key={item.application.id} className={locals.row}>
      <Button
        className={locals.button}
        kind="subtle"
        href={createHref(location)}
        onClick={() => unstable_trackEvent(CREATED_OBJECT, { objectType: APPLICATION_CLICK_CREATE }, {})}
        icon="lib_application"
      >
        {item.application.label}
      </Button>
    </li>
  );
}

function SelectedItem({ item }) {
  return (
    <div className={locals.selectedItem}>
      <div className={locals.selectedItemLabelWrapper}>
        <WithApplicationHealthIndicationBehaviour
          applicationId={item.application.id}
          render={healthInfo => (
            <WithHealthIndication healthInfo={healthInfo}>
              <SvgIcon type="lib_application" className={locals.icon} />
            </WithHealthIndication>
          )}
        />
        {item.application.label}
      </div>
      <SvgIcon type="lib_uncheck" className={locals.checkIcon} />
    </div>
  );
}
