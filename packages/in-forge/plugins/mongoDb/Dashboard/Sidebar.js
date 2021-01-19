/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import MongoDbClusterInfo from 'in-forge/plugins/mongoDb/MongoDbClusterInfo';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { emptyList } from 'in-services/fixedImmutables';
import List from 'in-sdk/components/sidebar/List';

import Info from '../Info';

export default function MongoDBSidebar({ snapshot }) {
  const databases = snapshot
    .getIn(['data', 'databases'], emptyList)
    .toArray()
    .sort();

  const data = snapshot.get('data');
  const clusterName = data.get('clusterName');

  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>MongoDB</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {databases.length > 0 ? (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Databases</Collapsible.Header>
          <Collapsible.Content>
            <List>
              {databases.map(database => (
                <List.Item key={database}>{database}</List.Item>
              ))}
            </List>
          </Collapsible.Content>
        </Collapsible>
      ) : null}

      {clusterName ? <MongoDbClusterInfo snapshot={snapshot} /> : null}

      <ServiceInstancesList snapshot={snapshot} />
    </Fragment>
  );
}
