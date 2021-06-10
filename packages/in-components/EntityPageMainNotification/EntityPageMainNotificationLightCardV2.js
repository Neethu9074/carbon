/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';

import locals from './EntityPageMainNotificationLightCardV2.mless';

export default function EntityPageMainNotificationLightCardV2(props) {
  return (
    <div className={locals.well}>
      <EntityPageMainNotification {...props} />
    </div>
  );
}
