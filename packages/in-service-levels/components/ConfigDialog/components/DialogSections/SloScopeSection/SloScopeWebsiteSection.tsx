/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item } from 'formalistic';
import React from 'react';

import { Typography } from '@instana/components';

import { WebsiteTagFilterBuilder } from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/WebsiteTagFilterBuilder';
import { BeaconSelector } from 'in-service-levels/components/ConfigDialog/components/FormComponents/BeaconSelector';
import { WebsiteSloForm, WebsiteSloFormPath } from 'in-service-levels/components/ConfigDialog/createSloForm';
import Sections from 'in-components/workspace/Sections/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

interface SloScopeWebsiteSectionProps {
  form: WebsiteSloForm;
  onChange: (path: WebsiteSloFormPath, updater: (i: Item) => Item) => void;
}

export const SloScopeWebsiteSection = ({ form, onChange }: SloScopeWebsiteSectionProps) => {
  const beaconTypeField = form.getIn(['scope', 'beaconType']);

  return (
    <section>
      <Typography variant="heading-200" component="h2">
        {t('in-service-levels:createSloDialog.selectScopeTitle')}
      </Typography>
      <Sections>
        <Section title={t('in-service-levels:general.beacon')}>
          <BeaconSelector
            onChange={newBeaconType =>
              onChange(['scope', 'beaconType'], () => beaconTypeField.setValue(newBeaconType).setTouched(true))
            }
            value={beaconTypeField.value}
          />
        </Section>
        <WebsiteTagFilterBuilder form={form} onChange={onChange} />
      </Sections>
    </section>
  );
};
