import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';

import locals from './EntityPageMainNotificationLightCardV2.mless';

export default function EntityPageMainNotificationLightCardV2(props) {
  return (
    <div className={locals.well}>
      <EntityPageMainNotification {...props} />
    </div>
  );
}
