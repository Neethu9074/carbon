/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Typography } from '@instana/components';

import { SloIndicatorAvailabilityForm } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloIndicatorAvailabilityForm';
import { SloIndicatorLatencyForm } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloIndicatorLatencyForm';
import { SloIndicatorCustomForm } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloIndicatorCustomForm';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanels,
  TabSelectPanel
} from 'in-components/TabSelect';
import { SloFormContext } from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { CustomBlueprintType } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { t } from 'in-i18n';

export const SloBlueprintsSection = () => {
  const { form, onChange } = useContext(SloFormContext);

  const blueprintField = form.getIn(['indicator', 'blueprint']);

  return (
    <TabSelect<CustomBlueprintType>
      initialActivePanelId="latency"
      onChange={(_, value) => {
        onChange(['indicator', 'blueprint'], () => blueprintField.setValue(value));
      }}
    >
      <TabSelectHeader>
        <Typography variant="heading-200" noWrap noMargin>
          {t('in-service-levels:createSloDialog.selectIndicator')}
        </Typography>
      </TabSelectHeader>
      <TabSelectMenu>
        <TabSelectItem<CustomBlueprintType> forId="latency" withRadioButton value="latency">
          <span>{t('in-service-levels:general.latency')}</span>
        </TabSelectItem>
        <TabSelectItem<CustomBlueprintType> forId="availability" withRadioButton value="availability">
          <span>{t('in-service-levels:general.availability')}</span>
        </TabSelectItem>
        <TabSelectItem<CustomBlueprintType> forId="custom" withRadioButton value="custom">
          <span>{t('in-service-levels:general.custom')}</span>
        </TabSelectItem>
      </TabSelectMenu>
      <TabSelectPanels>
        <TabSelectPanel id="latency">
          <SloIndicatorLatencyForm />
        </TabSelectPanel>
        <TabSelectPanel id="availability">
          <SloIndicatorAvailabilityForm />
        </TabSelectPanel>
        <TabSelectPanel id="custom">
          <SloIndicatorCustomForm />
        </TabSelectPanel>
      </TabSelectPanels>
    </TabSelect>
  );
};
