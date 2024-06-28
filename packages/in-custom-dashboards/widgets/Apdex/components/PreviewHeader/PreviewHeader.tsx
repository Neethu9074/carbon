/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode } from 'react';

import { Stack } from '@instana/components';

import NumericInput from 'in-custom-dashboards/widgets/Apdex/components/NumericInput';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

import locals from './PreviewHeader.mless';

interface PreviewHeaderProps {
  threshold?: number;
  additionalContent?: ReactNode;
  hasError?: boolean;
  onChangeThreshold: (threshold?: number) => void;
}

export default function PreviewHeader({
  threshold,
  additionalContent,
  hasError,
  onChangeThreshold
}: PreviewHeaderProps) {
  return (
    <div className={locals.wrapper}>
      <Section
        hasError={hasError}
        icon="lib_alerting_threshold_icon"
        title={t('in-custom-dashboards:widgets.apdex.createWebsiteApdexForm.thresholdLabel')}
      >
        <Stack align="center" direction="horizontal">
          <div className={locals.input}>
            <NumericInput
              aria-label={t('in-custom-dashboards:widgets.apdex.createWebsiteApdexForm.thresholdLabel')}
              value={threshold}
              onChange={value => onChangeThreshold(value)}
              hasError={hasError}
              min={1}
            />
          </div>
          <div className={locals.thresholdUnit}>
            {t('in-custom-dashboards:widgets.apdex.createWebsiteApdexForm.ms')}
          </div>
          {additionalContent}
        </Stack>
      </Section>
    </div>
  );
}
