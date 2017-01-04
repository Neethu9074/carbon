import React from 'react';

import {emptyMap} from 'in-services/fixedImmutables';
import {emptyList} from 'in-services/fixedImmutables';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function Topics({snapshot}) {
  const topics = snapshot.getIn(['data', 'topics'], emptyList);
  const partitions = snapshot.getIn(['data', 'partitions'], emptyMap);

  return (
    <div>
      {topics.map((topicName) =>
        <DescriptionList>
          <DescriptionItem title={topicName}>
            Partitions  {partitions.get(topicName)}
          </DescriptionItem>
        </DescriptionList>
      ).valueSeq().toArray()}
    </div>
  );
}
