/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { Button } from '@instana/components';

import {
  ALERTING_CREATE,
  APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_STARTED
} from 'in-services/tracking/eventNames';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

import locals from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton.mless';

export default function CreateSmartAlertButton({
  isGlobal,
  buttonName,
  isMigrate = false,
  boundaryScope,
  defaultBoundaryScope,
  serviceId,
  applicationId,
  endpointId,
  eventSpecificationId,
  renderAsSimpleButton = false
}: {
  isGlobal: boolean;
  buttonName: string;
  isMigrate?: boolean;
  boundaryScope?: string;
  defaultBoundaryScope?: string;
  serviceId?: string;
  applicationId?: string;
  endpointId?: string;
  eventSpecificationId?: string;
  renderAsSimpleButton?: boolean;
}) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl();
  const createSmartAlertPath = getLinkToCreateSmartAlert({
    isGlobal: isGlobal,
    migration: isMigrate,
    boundaryScope: boundaryScope || defaultBoundaryScope,
    serviceId: serviceId,
    applicationId: applicationId,
    endpointId: endpointId,
    eventSpecificationId: eventSpecificationId
  });
  const { trackCta } = useSegmentTracking();

  return (
    <Button
      className={classNames({
        [locals.button]: renderAsSimpleButton
      })}
      icon="lib_alerts_create"
      kind={'primaryv2'}
      href={createSmartAlertPath}
      onClick={() => {
        if (isMigrate) {
          trackCta(APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_STARTED, { eventSpecificationId });
        } else {
          trackCta(ALERTING_CREATE);
        }
      }}
    >
      {buttonName}
    </Button>
  );
}
