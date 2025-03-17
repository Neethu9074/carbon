/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Spacer } from '@instana/components';

import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import GracePeriod from 'in-alerting/smart-alerts/components/GracePeriod';
import BorderedContainer from 'in-alerting/components/BorderedContainer';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/GracePeriodWrapper.mless';

interface GracePeriodWrapperProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

export default function GracePeriodWrapper({ form, updateForm }: GracePeriodWrapperProps) {
  return (
    <BorderedContainer>
      <div className={locals.container}>
        <HorizontalFlexWrapper>
          <h3 className={locals.headline}>{t('in-alerting:smartAlerts.components.gracePeriod.title')}</h3>
        </HorizontalFlexWrapper>
        <TearSheetStepTitleWrapper
          headline={''}
          description={t('in-alerting:smartAlerts.components.gracePeriod.description')}
          hideSpace
        >
          <Spacer size="normal" />
          <GracePeriod form={form} updateForm={updateForm} />
        </TearSheetStepTitleWrapper>
      </div>
    </BorderedContainer>
  );
}
