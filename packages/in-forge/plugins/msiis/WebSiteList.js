/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import List from 'in-sdk/components/sidebar/List';

export default function WebSiteList({ snapshot }) {
  const sites = snapshot.getIn(['data', 'allsites']);
  return !sites || sites.size === 0 ? null : (
    <List>
      {sites.map(site => (
        <List.Item key={site}>{site}</List.Item>
      ))}
    </List>
  );
}
