/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityPageMainNotification, {
  EntityPageMainNotificationProps
} from 'in-components/EntityPageMainNotification/EntityPageMainNotification';

import locals from 'in-components/EntityPageMainNotification/EntityPageMainNotificationLightCardV2.mless';

export default function EntityPageMainNotificationLightCardV2(
  props: React.PropsWithChildren<EntityPageMainNotificationProps>
) {
  return (
    <div className={locals.well}>
      <EntityPageMainNotification {...props} />
    </div>
  );
}
