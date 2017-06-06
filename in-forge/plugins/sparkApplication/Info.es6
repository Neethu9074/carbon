import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { bytesZeroDecimalPlaces, msZeroDecimalPlaces } from 'in-services/formatters/number';
import { yesOrNo } from 'in-services/formatters/boolean';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const executorMemory = data.get('executorMemory');
  const batchDuration = data.get('batchDuration');

  return (
    <DescriptionList>
      <DescriptionItem title="Application Name">
        {data.get('appName')}
      </DescriptionItem>
      <DescriptionItem title="Application ID">
        {data.get('appId')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Version">
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title="Spark User">
        {data.get('sparkUser')}
      </DescriptionItem>
      <DescriptionItem title="Master">
        {data.get('master')}
      </DescriptionItem>
      <DescriptionItem title="Executor Memory">
        {executorMemory ? bytesZeroDecimalPlaces(executorMemory * 1024 * 1024) : null}
      </DescriptionItem>
      <DescriptionItem title="Batch Duration">
        {batchDuration ? msZeroDecimalPlaces(data.get('batchDuration')) : null}
      </DescriptionItem>
      <DescriptionItem title="Streaming Application">
        {yesOrNo(data.get('streamingApp'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
