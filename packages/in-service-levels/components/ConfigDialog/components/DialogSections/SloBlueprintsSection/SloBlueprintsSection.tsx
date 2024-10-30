/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext, useEffect } from 'react';

import { Typography } from '@instana/components';
import { BlueprintType } from '@instana/types';

import SloIndicatorAvailabilityForm from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloIndicatorAvailabilityForm';
import SloIndicatorLatencyForm from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloIndicatorLatencyForm';
import SloIndicatorCustomForm from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloIndicatorCustomForm';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanels,
  TabSelectPanel
} from 'in-components/TabSelect';
import SloDialogSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/Shared/SloDialogSection';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { defaultBlueprint } from 'in-service-levels/constants';
import { t } from 'in-i18n';

export default function SloBlueprintsSection() {
  const { form, mode, onChange } = useContext(SloFormContext);

  const blueprintField = form.getIn(['indicator', 'blueprint']);
  const entityTypeField = form.getIn(['entity', 'type']);
  const indicatorTypeField = form.getIn(['indicator', 'type']);

  const isFormInEditMode = mode === 'EDIT';
  const isSyntheticsSlo = entityTypeField.value === 'synthetic';

  // Temporary workaround to force the indicator type for custom blueprints to always be event-based.
  // Can be removed once we have time-based indicator support for custom blueprints.
  useEffect(() => {
    if (blueprintField.value === 'custom') {
      onChange(['indicator', 'type'], () => indicatorTypeField.setValue('eventBased'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blueprintField.value]);

  return (
    <SloDialogSection title={t('in-service-levels:createSloDialog.selectIndicatorNavItem')}>
      <TabSelect<BlueprintType>
        activePanelId={blueprintField.value ?? defaultBlueprint}
        onChange={blueprint => {
          onChange(['indicator', 'blueprint'], () => blueprintField.setValue(blueprint));
        }}
      >
        <TabSelectHeader>
          <Typography variant="heading-200" noWrap noMargin>
            {t('in-service-levels:createSloDialog.selectIndicator')}
          </Typography>
        </TabSelectHeader>
        <TabSelectMenu>
          <TabSelectItem<BlueprintType> forId="latency" disabled={isFormInEditMode} withRadioButton>
            <span>{t('in-service-levels:general.latency')}</span>
          </TabSelectItem>
          <TabSelectItem<BlueprintType> forId="availability" disabled={isFormInEditMode} withRadioButton>
            <span>{t('in-service-levels:general.availability')}</span>
          </TabSelectItem>
          {!isSyntheticsSlo && (
            <TabSelectItem<BlueprintType> forId="custom" disabled={isFormInEditMode} withRadioButton>
              <span>{t('in-service-levels:general.custom')}</span>
            </TabSelectItem>
          )}
        </TabSelectMenu>
        <TabSelectPanels>
          <TabSelectPanel<BlueprintType> id="latency">
            <SloIndicatorLatencyForm />
          </TabSelectPanel>
          <TabSelectPanel<BlueprintType> id="availability">
            <SloIndicatorAvailabilityForm />
          </TabSelectPanel>
          {!isSyntheticsSlo && (
            <TabSelectPanel<BlueprintType> id="custom">
              <SloIndicatorCustomForm />
            </TabSelectPanel>
          )}
        </TabSelectPanels>
      </TabSelect>
    </SloDialogSection>
  );
}
