/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/awsS3/Info';
import TagList from 'in-sdk/components/sidebar/TagList';

export default function AwsS3Sidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>S3 Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />

          <TagList snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
