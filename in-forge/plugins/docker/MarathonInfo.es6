import React from 'react';

import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function MarathonInfo({snapshot}) {
  const marathon = snapshot.getIn(['data', 'Marathon']);
  if (!marathon || marathon.size === 0) {
    return null;
  }

  const labels = marathon.get('labels');

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>
          Marathon
        </Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title='App ID'>
              {marathon.get('appId')}
            </DescriptionItem>
            <DescriptionItem title='App Version'>
              {marathon.get('appVersion')}
            </DescriptionItem>
            <DescriptionItem title='CPU Resources'>
              {marathon.get('cpuResources')}
            </DescriptionItem>
            <DescriptionItem title='Memory Resources'>
              {marathon.get('memoryResources') ? `${marathon.get('memoryResources')} MB` : null}
            </DescriptionItem>
            <DescriptionItem title='Disk Resources'>
              {marathon.get('diskResources') ? `${marathon.get('diskResources')} MB` : null}
            </DescriptionItem>
          </DescriptionList>

          {labels && labels.size > 0 ?
            <KeyValuePopupButton title='Marathon Labels'
                                 data={labels} >
              Show Marathon labels
            </KeyValuePopupButton>
          : null}
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
