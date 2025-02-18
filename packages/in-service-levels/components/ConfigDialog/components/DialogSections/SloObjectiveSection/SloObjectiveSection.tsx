/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import EstimatedErrorBudget from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloObjectiveSection/EstimatedErrorBudget';
import TimeWindowSelector from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloObjectiveSection/TimeWindowSelector';
import TargetSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloObjectiveSection/TargetSection';
import SloDialogSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/Shared/SloDialogSection';
import Sections from 'in-components/workspace/Sections/Sections';
import { t } from 'in-i18n';

import locals from './SloObjectiveSection.mless';

export default function SloObjectiveSection() {
  return (
    <SloDialogSection title={t('in-service-levels:createSloDialog.selectObjectiveTitle')}>
      <Stack direction="vertical" wrap gap="xxsmall">
        <Stack gap="medium" direction="horizontal" distribution="stretch" wrap>
          <Sections className={locals.inputSection}>
            <TargetSection />
            <TimeWindowSelector />
          </Sections>
          <EstimatedErrorBudget />
        </Stack>
      </Stack>
    </SloDialogSection>
  );
}
