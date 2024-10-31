/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import MaintenanceNamePreviewStep, {
  MaintenanceNamePreivewProps
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/steps/MaintenanceNamePreviewStep';
import MaintenanceScopeStep, {
  MaintenanceScopeProps
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/steps/MaintenanceScopeStep';
import { MaintenanceScheduleStepProps } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/steps/MaintenanceScheduleStep';
import MaintenanceScheduleStep from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/steps/MaintenanceScheduleStep';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import { t } from 'in-i18n';

export interface MaintenanceStepConfigObject {
  title: string;
  mustBeTouched: Array<Array<string>>;
  mustBeValid: Array<Array<string>>;
}

export const stepConfigs = [
  {
    title: t('in-settings:tabs.step1RMWTitle'),
    mustBeTouched: [
      ['window', 'start', 'date'],
      ['window', 'start', 'time'],
      ['window', 'duration']
    ],
    mustBeValid: [['window']]
  },
  {
    title: t('in-settings:tabs.step2RMWTitle'),
    mustBeTouched: [['query'], ['applicationIds'], ['tagFilterExpression']],
    mustBeValid: [['applyOn'], ['query'], ['applicationIds'], ['tagFilterExpression']]
  },
  {
    title: t('in-settings:tabs.step3RMWTitle'),
    mustBeTouched: [],
    mustBeValid: []
  }
];

export const stepRenderers = [
  ({ form, setForm, entity }: MaintenanceScheduleStepProps) => (
    <SimpleModeStepContentWrapper headline={t('in-settings:tabs.scheduleTitle')}>
      <MaintenanceScheduleStep form={form} setForm={setForm} entity={entity} />
    </SimpleModeStepContentWrapper>
  ),
  ({ form, onChange, onChangeApplyOn, setForm }: MaintenanceScopeProps) => (
    <SimpleModeStepContentWrapper headline={t('in-settings:tabs.scopeTitle')}>
      <MaintenanceScopeStep form={form} onChange={onChange} onChangeApplyOn={onChangeApplyOn} setForm={setForm} />
    </SimpleModeStepContentWrapper>
  ),
  ({ form, onChange }: MaintenanceNamePreivewProps) => (
    <SimpleModeStepContentWrapper headline={t('in-settings:tabs.namePreviewTitle')}>
      <MaintenanceNamePreviewStep form={form} onChange={onChange} />
    </SimpleModeStepContentWrapper>
  )
];
