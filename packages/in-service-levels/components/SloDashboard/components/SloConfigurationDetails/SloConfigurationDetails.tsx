/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import { Card, Ul } from '@instana/components';
import { TagSet } from '@instana/ibm-products';

import ScopeSection from 'in-service-levels/components/SloDashboard/components/configuration/ScopeSection/ScopeSection';
import ObjectiveSection from 'in-service-levels/components/SloDashboard/components/configuration/ObjectiveSection';
import IndicatorSection from 'in-service-levels/components/SloDashboard/components/configuration/IndicatorSection';
import SloActionButtons from 'in-service-levels/components/SloDashboard/components/configuration/SloActionButtons';
import EntitySection from 'in-service-levels/components/SloDashboard/components/configuration/EntitySection';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import { SLO_CONFIG_VIEW } from 'in-services/tracking/eventNames';
import { Nullish } from 'in-types';

import locals from './SloConfigurationDetails.mless';

interface SloConfigurationDetailsProps {
  data?: SloTabData | Nullish;
}

export interface SloConfigurationDetailsContentProps {
  data: SloTabData;
}

export default function SloConfigurationDetails({ data }: SloConfigurationDetailsProps) {
  if (!data) {
    return null;
  }

  return <SloConfigurationDetailsContent data={data} />;
}

function SloConfigurationDetailsContent({ data }: SloConfigurationDetailsContentProps) {
  const { configuration, entities } = data;

  const { trackCta } = useSegmentTracking();

  useEffect(() => {
    const { indicator, timeWindow, entity } = configuration;

    trackCta(SLO_CONFIG_VIEW, {
      id: configuration.id,
      blueprint: indicator.blueprint,
      indicatorType: indicator.type,
      timeWindowType: timeWindow.type,
      entityType: entity.type
    });
  }, [trackCta, configuration]);

  return (
    <Card>
      <div className={locals.cardHeader}>
        <TagSet
          overflowClassName={locals.tagSet}
          tags={configuration.tags.map(item => {
            return { label: item };
          })}
        />
        <SloActionButtons configuration={configuration} editDisabled={entities.some(({ deleted }) => deleted)} />
      </div>
      <Ul space="medium">
        <EntitySection data={data} />
        <ScopeSection data={data} />
        <IndicatorSection data={data} />
        <ObjectiveSection data={data} />
      </Ul>
    </Card>
  );
}
