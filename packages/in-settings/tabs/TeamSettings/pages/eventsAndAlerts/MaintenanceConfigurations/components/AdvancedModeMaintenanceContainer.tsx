/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { MaintenanceConfigV2 } from '@instana/types';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';
import MaintenanceNamePreviewStep from './steps/MaintenanceNamePreviewStep';
import MaintenanceScheduleStep from './steps/MaintenanceScheduleStep';
import MaintenanceScopeStep from './steps/MaintenanceScopeStep';
import StepsContainer from 'in-components/StepsContainer';
import { t } from 'in-i18n';

interface AdvancedModeMaintenanceContainerProps {
  form: MapForm<any>;
  onChange: OnEntityChange<MaintenanceConfigV2>;
  onChangeApplyOn: Function;
  setForm: SetFormFunction;
}

export default function AdvancedModeMaintenanceContainer({
  form,
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
                <MaintenanceScheduleStep form={form} setForm={setForm} />
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
