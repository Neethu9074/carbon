/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Version">{snapshot.getIn(['data', 'version'])}</DescriptionItem>
    </DescriptionList>
  );
}
