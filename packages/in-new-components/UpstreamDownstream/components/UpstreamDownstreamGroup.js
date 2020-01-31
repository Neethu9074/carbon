import React from 'react';

import UpstreamDownstreamItem from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamItem/UpstreamDownstreamItem';
import { relationships } from 'in-new-components/UpstreamDownstream/constants';
import { Ul } from 'in-new-components/lists/List';

import locals from './UpstreamDownstreamGroup.mless';

export default function UpstreamDownstreamGroup({
  items,
  area,
  selectedMetric,
  timeConfig,
  result,
  totalHits,
  applicationId,
  serviceId
}) {
  return (
    <div>
      <div className={locals.groupHead}>
        {relationships.info[area].text} ({totalHits})
      </div>
      <Ul>
        {items.map(item => (
          <UpstreamDownstreamItem
            applicationId={applicationId}
            key={item.service.id}
            itemServiceId={item.service.id}
            serviceId={serviceId}
            result={result}
            item={item}
            area={area}
            selectedMetric={selectedMetric}
            timeConfig={timeConfig}
          />
        ))}
      </Ul>
    </div>
  );
}
