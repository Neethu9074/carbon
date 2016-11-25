import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import {formatDateTime} from 'in-services/formatters/date';
import {yesOrNo} from 'in-services/formatters/boolean';
import {emptyMap} from 'in-services/fixedImmutables';


export default function JbossDataGridCaches({snapshot}) {
  const data = snapshot.get('data');
  const caches = data.get('caches', emptyMap);

  return (
    <div>
      {caches.map((cache, cacheName) =>
          <Collapsible initiallyOpen={false} key={cacheName}>
            <Collapsible.Header>Cache [{cacheName}]</Collapsible.Header>
            <Collapsible.Content>
              <DescriptionList>
                <DescriptionItem title='Status'>
                  {cache.get('status')}
                </DescriptionItem>
                <DescriptionItem title='Started At'>
                  {formatDateTime(cache.get('startedAt'))}
                </DescriptionItem>
                <DescriptionItem title='Cluster Name'>
                  {cache.get('clusterName')}
                </DescriptionItem>
                <DescriptionItem title='Statistics Enabled'>
                  {yesOrNo(cache.get('statisticsEnabled'))}
                </DescriptionItem>
              </DescriptionList>
              <KeyValuePopup header='Configuration'
                             data={cache.get('configuration')} />
            </Collapsible.Content>
          </Collapsible>
      ).valueSeq().toArray()}
    </div>
  );
}
