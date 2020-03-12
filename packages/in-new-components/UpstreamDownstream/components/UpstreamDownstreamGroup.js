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
  activeTab,
  timeConfig,
  result,
  applicationId,
  serviceId,
  productArea,
  endpointId,
  boundaryScope,
  itemType
}) {
  const [selectedMetric, onChangeMetric] = useState('errors');
  const totalHits = result.data.totalHits;
  const relationshipTypeText = relationships.info[activeTab][itemType].type;
  const relationshipText = relationships.info[activeTab][itemType].text;

  return (
    <div>
      <div className={locals.groupHead}>
        <div className={locals.relationshipText}>
          {relationshipText} {totalHits} {totalHits > 1 ? relationshipTypeText + 's' : relationshipTypeText}
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
            selectedMetric={selectedMetric}
            timeConfig={timeConfig}
            itemType={itemType}
          />
        ))}
      </Ul>
      {itemType !== relationships.APPLICATION && (
        <div className={locals.seeAll}>
          {getSeeAllLink(totalHits, productArea, activeTab, applicationId, serviceId, endpointId, boundaryScope, close)}
        </div>
      )}
    </div>
  );
}

function getSeeAllLink(totalHits, productArea, activeTab, applicationId, serviceId, endpointId, boundaryScope, close) {
  const tabMatrix = activeTab === 'UPSTREAM' ? { hideDownstream: true } : { hideUpstream: true };
  if (productArea === 'application') {
    return (
      <Link href$={getApplicationDashboard(applicationId, { boundaryScope, tab: '/map' })} onClick={close}>
        See all {activeTab.toLowerCase()} Services
      </Link>
    );
  } else if (productArea === 'service') {
    return (
      <Link
        href$={getServiceDashboard(serviceId, { applicationId, boundaryScope, tab: '/flowMap', tabMatrix })}
        onClick={close}
      >
        {totalHits > 1 ? `See all ${totalHits} Services` : 'See Service'}
      </Link>
    );
  }

  return (
    <Link
      href$={getEndpointDashboard(endpointId, {
        applicationId,
        serviceId,
        boundaryScope,
        tab: '/flowMap',
        tabMatrix
      })}
      onClick={close}
    >
      See all Services and Endpoints
    </Link>
  );
}
