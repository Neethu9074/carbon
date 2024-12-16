/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { RadioButton, Stack } from '@instana/components';

import LabelDescriptionWithIcon from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/LabelDescriptionWithIcon';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import { t } from 'in-i18n';

export default function ScopeAlerting() {
  return (
    <>
      <Section title={t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeAlerting.title')}>
        <Stack direction="horizontal">
          <RadioButton
            key={t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeAlerting.customAggregation')}
            label={
              <LabelDescriptionWithIcon
                label={t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeAlerting.customAggregation')}
                description={t(
                  'in-alerting:smartAlerts.infrastructure.tearSheet.scopeAlerting.customAggregationDescription'
                )}
              />
            }
            checked={false}
            onChange={() => undefined}
          />
          <RadioButton
            key={t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeAlerting.perEntityAlerting')}
            label={
              <LabelDescriptionWithIcon
                label={t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeAlerting.perEntityAlerting')}
                description={t(
                  'in-alerting:smartAlerts.infrastructure.tearSheet.scopeAlerting.perEntityAlertingDescription'
                )}
              />
            }
            checked={false}
            onChange={() => undefined}
          />
        </Stack>
      </Section>
    </>
  );
}
