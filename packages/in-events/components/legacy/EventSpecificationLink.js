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

export default function EventSpecificationLink({ event }) {
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
      {`View ${isCustom ? 'Custom' : 'Built-in'} Event`}
    </Button>
  );
}

function getEventSpecificationSettingsBasePath(isCustom) {
  return isCustom ? teamSettingsAlertingEventCustom : teamSettingsAlertingEventBuiltIn;
}

function isCustomEvent(event) {
  return event.getIn(['metadata', 'custom_issue'], false);
}
