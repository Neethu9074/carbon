/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import { Card, Ul } from '@instana/components';
import { t } from '@instana/i18n-react';

import ScopeSection from 'in-service-levels/components/SloDashboard/components/configuration/ScopeSection/ScopeSection';
import ObjectiveSection from 'in-service-levels/components/SloDashboard/components/configuration/ObjectiveSection';
import IndicatorSection from 'in-service-levels/components/SloDashboard/components/configuration/IndicatorSection';
import SloActionButtons from 'in-service-levels/components/SloDashboard/components/configuration/SloActionButtons';
import EntitySection from 'in-service-levels/components/SloDashboard/components/configuration/EntitySection';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/slo/CreateSmartAlertDialog';
import { useSloTrackers } from 'in-service-levels/hooks/SloTrackerProvider';
import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { SLO_CONFIG_VIEW } from 'in-services/tracking/eventNames';
import { sloSmartAlertsEnabled } from 'in-services/featureFlags';
import TagList from 'in-components/TagsList/TagList';
import { Nullish } from 'in-types';

interface SloConfigurationDetailsProps {
  data?: SloTabData | Nullish;
}

export interface SloConfigurationDetailsContentProps {
  data: SloTabData;
}

export default function SloConfigurationDetails({ data }: SloConfigurationDetailsProps) {
  const openCreateSmartAlertDialog = () =>
    addActiveDialog(<CreateSmartAlertDialog preselectedSloId={data?.configuration.id} />);

  if (!data) {
    return null;
  }

  return (
    <>
      {sloSmartAlertsEnabled && (
        <FloatingActionButtons>
          <FloatingActionButton icon="lib_alerts_create" kind="primaryv2" onClick={openCreateSmartAlertDialog}>
            {t('in-service-levels:general.addButtonLabel', { context: 'smartAlert' })}
          </FloatingActionButton>
        </FloatingActionButtons>
      )}

      <SloConfigurationDetailsContent data={data} />
    </>
  );
}

function SloConfigurationDetailsContent({ data }: SloConfigurationDetailsContentProps) {
  const { configuration, entity } = data;

  const track = useSloTrackers();
  useEffect(() => {
    const { indicator, timeWindow, entity } = configuration;

    track(SLO_CONFIG_VIEW, {
      id: configuration.id,
      blueprint: indicator.blueprint,
      indicatorType: indicator.type,
      timeWindowType: timeWindow.type,
      entityType: entity.type
    });
  }, [track, configuration]);

  return (
    <Card
      leftHeaderContent={<TagList tags={configuration.tags} />}
      rightHeaderContent={<SloActionButtons configuration={configuration} editDisabled={entity.deleted} />}
    >
      <Ul space="medium">
        <EntitySection data={data} />
        <ScopeSection data={data} />
        <IndicatorSection data={data} />
        <ObjectiveSection data={data} />
      </Ul>
    </Card>
  );
}
