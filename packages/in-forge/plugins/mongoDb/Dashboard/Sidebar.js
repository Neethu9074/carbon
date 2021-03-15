/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import MongoDbClusterInfo from 'in-forge/plugins/mongoDb/MongoDbClusterInfo';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { emptyList } from 'in-services/fixedImmutables';
import List from 'in-sdk/components/sidebar/List';
import { t } from 'in-i18n';
import Info from '../Info';

export default function MongoDBSidebar({ snapshot }) {
  const databases = snapshot
    .getIn(['data', 'databases'], emptyList)
    .toArray()
    .sort();

  const data = snapshot.get('data');

  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.mongoDb.mongoDb')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {databases.length > 0 ? (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>{t('in-forge:plugins.mongoDb.databases')}</Collapsible.Header>
          <Collapsible.Content>
            <List>
              {databases.map(database => (
                <List.Item key={database}>{database}</List.Item>
              ))}
            </List>
          </Collapsible.Content>
        </Collapsible>
      ) : null}

      <MongoDbClusterInfo snapshotId={snapshot.get('id')} data={data} />

      <ServiceInstancesList snapshot={snapshot} />
    </Fragment>
  );
}
