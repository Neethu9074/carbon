/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Stack, StackItem } from '@instana/components';

import FeatureFeedback from 'in-components/FeatureFeedback';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

interface FormComponentHeaderProps {
  showFeedbackButton?: boolean;
}

export default function FormComponentHeader({ showFeedbackButton }: FormComponentHeaderProps) {
  return (
    <Header>
      <Stack direction="horizontal" distribution="spaceBetween" align="end" wrap>
        <StackItem>{t('in-custom-dashboards:widgets.slo.formComponent.sloConfig')}</StackItem>
        <StackItem>
          {showFeedbackButton ? (
            <FeatureFeedback href="https://forms.gle/dwTA7EVXXoRB96uA8" />
          ) : (
            // render placeholder with same height as FeatureFeedback component to prevent content jump
            <div style={{ height: '2.6875rem' }} />
          )}
        </StackItem>
      </Stack>
    </Header>
  );
}
