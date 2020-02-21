import React, { useState } from 'react';
import { get } from 'lodash';

import UpstreamDownstreamItem from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamItem/UpstreamDownstreamItem';
import { getApplicationDashboard, getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import UpstreamDownstreamMetric from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamMetric';
import { relationships } from 'in-new-components/UpstreamDownstream/constants';
import { Ul } from 'in-new-components/lists/List';
import Link from 'in-components/Link/Link';

import locals from './UpstreamDownstreamGroup.mless';

export default function UpstreamDownstreamGroup({
  items,
  area,
  timeConfig,
  result,
  applicationId,
  serviceId,
  dashboard,
  endpointId,
  boundaryScope,
  itemType
}) {
  const [selectedMetric, onChangeMetric] = useState('errors');

  return (
    <div>
      <div className={locals.groupHead}>
        <div className={locals.relationshipText}>
          {relationships.info[area][itemType].text} ({result.data.totalHits})
        </div>
        <UpstreamDownstreamMetric
          metrics={[
            { text: 'Calls and Erroneous Calls', key: 'callsAndErroneous' },
            { text: 'Calls and Latency', key: 'callsAndlatency' }
          ]}
          selectedMetric={selectedMetric}
          onChangeMetric={onChangeMetric}
        />
      </div>
      <Ul framed="topBottom">
        {items.map(item => (
          <UpstreamDownstreamItem
            applicationId={applicationId}
            key={item.service ? item.service.id : item.application.id}
            itemId={get(item, [itemType.toLowerCase(), 'id'])}
            itemLabel={get(item, [itemType.toLowerCase(), 'label'])}
            serviceId={serviceId}
            result={result}
            item={item}
            area={area}
            selectedMetric={selectedMetric}
            timeConfig={timeConfig}
            itemType={itemType}
          />
        ))}
      </Ul>
      {itemType !== relationships.APPLICATION && (
        <div className={locals.seeAll}>
          {getSeeAllLink(result, dashboard, applicationId, serviceId, endpointId, boundaryScope, close)}
        </div>
      )}
    </div>
  );
}

function getSeeAllLink(result, dashboard, applicationId, serviceId, endpointId, boundaryScope, close) {
  if (dashboard === 'application') {
    return (
      <Link href$={getApplicationDashboard(applicationId, { boundaryScope, tab: '/map' })} onClick={close}>
        See all dependencies
      </Link>
    );
  } else if (dashboard === 'service') {
    return (
      <Link href$={getServiceDashboard(serviceId, { applicationId, boundaryScope, tab: '/flowMap' })} onClick={close}>
        See all {result.data.totalHits} Services
      </Link>
    );
  }
  return (
    <Link
      href$={getEndpointDashboard(endpointId, {
        applicationId,
        serviceId,
        boundaryScope,
        tab: '/flowMap'
      })}
      onClick={close}
    >
      See all Services and Endpoints
    </Link>
  );
}
