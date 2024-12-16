/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

interface DisabledTagFilterButtonProps {
  width?: string;
  noCustomTitle?: boolean;
}
export default function DisabledTagFilterButton({ width, noCustomTitle }: DisabledTagFilterButtonProps) {
  return noCustomTitle ? (
    <Button size="compact" icon="lib_openclose_add" kind="subtle" disabled>
      {t('in-components:queryBuilder.components.filterButtonAddFilter')}
    </Button>
  ) : (
    <Section title={t('in-service-levels:createSloDialog.customFilter')} titleWidth={width}>
      <Button size="compact" icon="lib_openclose_add" kind="subtle" disabled>
        {t('in-components:queryBuilder.components.filterButtonAddFilter')}
      </Button>
    </Section>
  );
}
