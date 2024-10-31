/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { MaintenanceConfigV2 } from '@instana/types';

import MaintenanceNamePreviewStep from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/steps/MaintenanceNamePreviewStep';
import MaintenanceScheduleStep from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/steps/MaintenanceScheduleStep';
import MaintenanceScopeStep from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/steps/MaintenanceScopeStep';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';
import StepsContainer from 'in-components/StepsContainer';
import { t } from 'in-i18n';

interface AdvancedModeMaintenanceContainerProps {
  form: MapForm<any>;
  entity: MaintenanceConfigV2;
  onChange: OnEntityChange<MaintenanceConfigV2>;
  onChangeApplyOn: Function;
  setForm: SetFormFunction;
}

export default function AdvancedModeMaintenanceContainer({
  form,
  entity,
  onChange,
  onChangeApplyOn,
  setForm
}: AdvancedModeMaintenanceContainerProps) {
  return (
    <StepsContainer
      navItems={[
        {
          scrollId: '1',
          label: t('in-settings:tabs.scheduleStep'),
          valid: true,
          title: '',
          content: (
            <>
              <ExpandableLightCard title={t('in-settings:tabs.scheduleStep')} darkFrame openByDefault>
                <MaintenanceScheduleStep form={form} setForm={setForm} entity={entity} />
              </ExpandableLightCard>
            </>
          )
        },
        {
          scrollId: '2',
          label: t('in-settings:tabs.scope'),
          valid: true,
          title: '',
          content: (
            <>
              <ExpandableLightCard title={t('in-settings:tabs.scope')} darkFrame openByDefault>
                <MaintenanceScopeStep
                  form={form}
                  onChange={onChange}
                  onChangeApplyOn={onChangeApplyOn}
                  setForm={setForm}
                />
              </ExpandableLightCard>
            </>
          )
        },
        {
          scrollId: '3',
          label: t('in-settings:tabs.namePreviewStepName'), // i18n
          valid: true,
          title: '',
          content: (
            <>
              <ExpandableLightCard title={t('in-settings:tabs.namePreviewStepName')} darkFrame openByDefault>
                <MaintenanceNamePreviewStep form={form} onChange={onChange} />
              </ExpandableLightCard>
            </>
          )
        }
      ]}
    />
  );
}
