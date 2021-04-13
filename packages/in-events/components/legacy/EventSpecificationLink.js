/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  getEntityIdView,
  teamSettingsAlertingEventBuiltIn,
  teamSettingsAlertingEventCustom
} from 'in-settings/navigation/paths';
import Button from 'in-new-components/Button';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function EventSpecificationLink({ event }) {
  if (role.canConfigureCustomAlerts) {
    // at the moment the link of this button generally does not work when the canConfigureCustomAlerts permission is missing,
    // because we generally hide the Events & Alerts section, including the build-in events.
    return null;
  }

  const eventSpecificationId = event.getIn(['metadata', 'eventSpecificationId']);
  if (!eventSpecificationId) {
    return null;
  }

  const isCustom = isCustomEvent(event);

  return (
    <Button
      kind="secondary"
      href$={getEntityIdView(getEventSpecificationSettingsBasePath(isCustom), eventSpecificationId)}
    >
      {isCustom ? t('in-events:buttonViewCustomEvent') : t('in-events:buttonViewBuiltInEvent')}
    </Button>
  );
}

function getEventSpecificationSettingsBasePath(isCustom) {
  return isCustom ? teamSettingsAlertingEventCustom : teamSettingsAlertingEventBuiltIn;
}

function isCustomEvent(event) {
  return event.getIn(['metadata', 'custom_issue'], false);
}
