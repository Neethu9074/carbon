/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import TagList from 'in-sdk/components/sidebar/TagList';
import Info from '../Info';

export default function AzureAppServiceSidebarDetails({ snapshot }) {
  return (
    <div>
      <Info snapshot={snapshot} />
      <TagList snapshot={snapshot} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
