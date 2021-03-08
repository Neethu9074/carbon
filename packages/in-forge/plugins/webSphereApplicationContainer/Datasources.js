/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { emptyList } from 'in-services/fixedImmutables';

export default function Datasources({ snapshot }) {
  const data = snapshot.get('data');
  const datasources = data
    .get('datasourceNames', emptyList)
    .filter(datasource => data.get('datasources.' + datasource + '.maxConnections'))
    .sort();
  if (datasources.size === 0) {
    return null;
  }

  return (
    <div>
      {datasources.map((datasource, i) => (
        <Collapsible initiallyOpen={false} key={i}>
          <Collapsible.Header>
            {t('in-forge:plugins.webSphereAppContainer.headerDatasourceName', {
              datasourceName: datasource
            })}
          </Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title={t('in-forge:plugins.webSphereAppContainer.titleMaxConnections')}>
                {data.get('datasources.' + datasource + '.maxConnections')}
              </DescriptionItem>
              <DescriptionItem title={t('in-forge:plugins.webSphereAppContainer.titleMinConnections')}>
                {data.get('datasources.' + datasource + '.minConnections')}
              </DescriptionItem>
              <DescriptionItem title={t('in-forge:plugins.webSphereAppContainer.titleConnectionTimeout')}>
                {data.get('datasources.' + datasource + '.connectionTimeout')}
              </DescriptionItem>
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      ))}
    </div>
  );
}
