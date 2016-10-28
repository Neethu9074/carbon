import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import {emptyList} from 'in-services/fixedImmutables';


export default function Datasources({snapshot}) {
  const data = snapshot.get('data');
  const datasources = data.get('datasourceNames', emptyList)
    .filter(datasource => data.get('datasources.' + datasource + '.maxConnections')).sort();
  if (datasources.size === 0) {
    return null;
  }

  return (
    <div>
      <Separator />
      {datasources.map((datasource, i) =>
          <Collapsible initiallyOpen={false}
                       key={i}>
            <Collapsible.Header>Datasource [{datasource}]</Collapsible.Header>
            <Collapsible.Content>
              <DescriptionList>
                <DescriptionItem title='Max Connections'>
                  {data.get('datasources.' + datasource + '.maxConnections')}
                </DescriptionItem>
                <DescriptionItem title='Min Connections'>
                  {data.get('datasources.' + datasource + '.minConnections')}
                </DescriptionItem>
                <DescriptionItem title='Connection Timeout'>
                  {data.get('datasources.' + datasource + '.connectionTimeout')}
                </DescriptionItem>
              </DescriptionList>
            </Collapsible.Content>
          </Collapsible>
      )}
    </div>
  );
}
