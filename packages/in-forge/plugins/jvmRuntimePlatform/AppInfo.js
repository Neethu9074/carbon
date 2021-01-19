/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

export default function AppInfo({ snapshot }) {
  const data = snapshot.get('data');
  if (!data.get('appInfo')) {
    return null;
  }

  return (
    <Collapsible initiallyOpen={false}>
      <Collapsible.Header>App</Collapsible.Header>
      <Collapsible.Content>
        <DescriptionList>
          <DescriptionItem title="Application">{data.getIn(['appInfo', 'title'])}</DescriptionItem>
          <DescriptionItem title="Version">{data.getIn(['appInfo', 'version'])}</DescriptionItem>
          <DescriptionItem title="Command Line">{data.get('name')}</DescriptionItem>
        </DescriptionList>
      </Collapsible.Content>
    </Collapsible>
  );
}
