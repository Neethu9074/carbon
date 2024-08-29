/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Stack, StackItem } from '@instana/components';

import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export default function FormComponentHeader() {
  return (
    <Header>
      <Stack direction="horizontal" distribution="spaceBetween" align="end" wrap>
        <StackItem>{t('in-custom-dashboards:widgets.slo.formComponent.sloConfig')}</StackItem>
      </Stack>
    </Header>
  );
}
