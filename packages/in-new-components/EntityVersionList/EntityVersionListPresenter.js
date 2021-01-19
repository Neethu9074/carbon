/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import EntityVersionListing from 'in-new-components/EntityVersionList/EntityVersionListing';
import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification';

export default function EntityVersionListPresenter({ plugin, versions }) {
  return (
    <EntityPageMainNotification
      framed
      plugin={plugin}
      explanation="We could not find a version of this entity in the selected time range. We found other versions in different time
    ranges:"
    >
      <EntityVersionListing versions={versions} />
    </EntityPageMainNotification>
  );
}
