/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

import EstimatedErrorBudget from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloObjectiveSection/EstimatedErrorBudget';
import TimeWindowSelector from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloObjectiveSection/TimeWindowSelector';
import TargetSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloObjectiveSection/TargetSection';
import Sections from 'in-components/workspace/Sections/Sections';

import locals from './SloObjectiveSection.mless';

export default function SloObjectiveSection() {
  return (
    <Stack direction="vertical" wrap gap="xxsmall">
      <Typography variant="heading-200" component="h2">
        {t('in-service-levels:createSloDialog.selectObjectiveTitle')}
      </Typography>

      <Stack gap="medium" direction="horizontal" distribution="stretch" wrap>
        <Sections className={locals.inputSection}>
          <TargetSection />
          <TimeWindowSelector />
        </Sections>
        <Sections className={locals.estimatedBudgetSection}>
          <EstimatedErrorBudget />
        </Sections>
      </Stack>
    </Stack>
  );
}
