import React from 'react';

import {
  getEntityIdView,
  teamSettingsAlertingEventBuiltIn,
  teamSettingsAlertingEventCustom
} from 'in-settings/navigation/paths';
import Link from 'in-components/Link';

import locals from './EventSpecificationLink.mless';

export default function EventSpecificationLink({ event }) {
  const eventSpecificationId = event.getIn(['metadata', 'eventSpecificationId']);
  if (eventSpecificationId == null) {
    return;
  }

  const isCustom = isCustomEvent(event);

  return (
    <Link
      className={locals.link}
      href$={getEntityIdView(getEventSpecificationSettingsBasePath(isCustom), eventSpecificationId)}
    >
      {`View ${isCustom ? 'Custom' : 'Built-in'} Event`}
    </Link>
  );
}

function getEventSpecificationSettingsBasePath(isCustom) {
  return isCustom ? teamSettingsAlertingEventCustom : teamSettingsAlertingEventBuiltIn;
}

function isCustomEvent(event) {
  return event.getIn(['metadata', 'custom_issue'], false);
}
