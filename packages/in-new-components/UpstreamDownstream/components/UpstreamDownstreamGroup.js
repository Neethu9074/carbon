/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import { get } from 'lodash';

import { Link } from '@instana/components';
import { Ul } from '@instana/components';

import UpstreamDownstreamItem from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamItem/UpstreamDownstreamItem';
import UpstreamDownstreamMetric from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamMetric';
import { getApplicationList, getServiceList } from 'in-applications/navigation/paths';
import { relationships } from 'in-new-components/UpstreamDownstream/constants';
import { capitalize } from 'in-services/formatters/string';
import { t } from 'in-i18n';

import locals from './UpstreamDownstreamGroup.mless';

export default function UpstreamDownstreamGroup({
  items,
  activeTab,
  timeConfig,
  result,
  applicationId,
  serviceId,
  endpointId,
  itemType,
  tagFilters,
  snapshotId,
  plugin
}) {
  const [selectedMetric, onChangeMetric] = useState('errors');
  const totalHits = result.data.totalHits;
  const relationshipTypeText = relationships.info[activeTab][itemType].type;
  const relationshipText = relationships.info[activeTab][itemType].text;

  return (
    <div>
      <div className={locals.groupHead}>
        <div className={locals.groupHeadText}>
          {t(relationshipText, { context: relationshipTypeText, count: totalHits })}
        </div>
        <UpstreamDownstreamMetric
          metrics={[
            {
              text: t('in-new-components:upstreamDownstream.metricLabelCallsAndErroneousCalls'),
              key: 'callsAndErroneous'
            },
            { text: t('in-new-components:upstreamDownstream.metricLabelCallsAndLatency'), key: 'callsAndlatency' }
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
      <div className={locals.seeAll}>
        {itemType == relationships.APPLICATION
          ? getSeeAllApplicationsLink(
              totalHits,
              activeTab,
              applicationId,
              serviceId,
              endpointId,
              tagFilters,
              snapshotId,
              plugin
            )
          : getSeeAllServicesLink(
              totalHits,
              activeTab,
              applicationId,
              serviceId,
              endpointId,
              tagFilters,
              snapshotId,
              plugin
            )}
      </div>
    </div>
  );
}

function getSeeAllApplicationsLink(
  totalHits,
  activeTab,
  applicationId,
  serviceId,
  endpointId,
  tagFilters,
  snapshotId,
  plugin
) {
  let tagFilterEntity = activeTab === 'UPSTREAM' ? 'DESTINATION' : 'SOURCE';
  let tagFiltersWithEntity;
  if (tagFilters) {
    tagFiltersWithEntity = tagFilters.map(tagFilter => ({ ...tagFilter, entity: tagFilterEntity }));
  }

  return (
    <Link
      href$={getApplicationList({
        applicationId,
        serviceId,
        endpointId,
        contextScope: activeTab,
        tagFilters: tagFiltersWithEntity,
        snapshotId,
        plugin
      })}
    >
      {totalHits > 1
        ? t('in-new-components:upstreamDownstream.linkSeeAllApplications', {
            count: totalHits,
            activeTab: capitalize(activeTab.toLowerCase())
          })
        : t('in-new-components:upstreamDownstream.linkSeeApplication')}
    </Link>
  );
}

function getSeeAllServicesLink(
  totalHits,
  activeTab,
  applicationId,
  serviceId,
  endpointId,
  tagFilters,
  snapshotId,
  plugin
) {
  let tagFilterEntity = activeTab === 'UPSTREAM' ? 'DESTINATION' : 'SOURCE';
  let tagFiltersWithEntity;
  if (tagFilters) {
    tagFiltersWithEntity = tagFilters.map(tagFilter => ({ ...tagFilter, entity: tagFilterEntity }));
  }

  return (
    <Link
      href$={getServiceList({
        applicationId,
        serviceId,
        endpointId,
        contextScope: activeTab,
        tagFilters: tagFiltersWithEntity,
        snapshotId,
        plugin
      })}
    >
      {totalHits > 1
        ? t('in-new-components:upstreamDownstream.linkSeeAllServices', {
            count: totalHits,
            activeTab: capitalize(activeTab.toLowerCase())
          })
        : t('in-new-components:upstreamDownstream.linkSeeService')}
    </Link>
  );
}
