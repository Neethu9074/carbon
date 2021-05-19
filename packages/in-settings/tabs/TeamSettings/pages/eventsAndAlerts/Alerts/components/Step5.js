/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import SectionHeading from 'in-settings/components/SectionHeading';
import DescriptionText from 'in-components/form/DescriptionText';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/Step5.mless';

export default function Step5({ form, setForm }) {
  return (
    <Fragment>
      <div className={locals.sectionHeading}>
        <SectionHeading>{t('in-settings:tabs.5CustomPayloadsOptional')}</SectionHeading>
      </div>
      <DescriptionText>{t('in-settings:tabs.CustomPayloadDescriptionText')}</DescriptionText>

      <AlertConfigCustomPayload form={form} setForm={setForm} />
    </Fragment>
  );
}
