/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import { hitRate, siPrefix } from 'in-services/formatters/number';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { t } from 'in-i18n';
import Info from '../Info';

export default function Neo4jSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.neo4j.neo4J')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'primitiveCount.nodeIds',
            label: t('in-forge:plugins.neo4j.nodeIDs'),
            formatter: siPrefix
          },
          {
            metric: 'primitiveCount.propertyIds',
            label: t('in-forge:plugins.neo4j.propertyIDs'),
            formatter: siPrefix
          },
          {
            metric: 'primitiveCount.relationshipIds',
            label: t('in-forge:plugins.neo4j.relationshipIDs'),
            formatter: siPrefix
          },
          {
            metric: 'primitiveCount.relationShipTypeIds',
            label: t('in-forge:plugins.neo4j.relationshipTypeIDs'),
            formatter: siPrefix
          },
          {
            metric: 'pageCache.usageRatio',
            label: t('in-forge:plugins.neo4j.usageRatio'),
            formatter: hitRate
          },
          {
            metric: 'pageCache.hitRatio',
            label: t('in-forge:plugins.neo4j.hitRatio'),
            formatter: hitRate
          }
        ]}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
