/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Typography } from '@instana/components';

import WebsiteTagFilterBuilder from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/WebsiteTagFilterBuilder';
import BeaconSelector from 'in-service-levels/components/ConfigDialog/components/FormComponents/BeaconSelector';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { defaultBeaconType, titleWidth } from 'in-service-levels/constants';
import Sections from 'in-components/workspace/Sections/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

export default function SloScopeWebsiteSection() {
  const { form, mode, onChange } = useContext(SloFormContext);

  const websiteIdField = form.getIn(['entity', 'entityIds']);
  const beaconTypeField = form.getIn(['scope', 'beaconType']);

  const beaconType = beaconTypeField.value ?? defaultBeaconType;
  const isFormInEditMode = mode === 'EDIT';

  return (
    <section>
      <Typography variant="heading-200" component="h2">
        {t('in-service-levels:createSloDialog.selectScopeNavItem')}
      </Typography>
      <Sections>
        <Section title={t('in-service-levels:general.beacon')} titleWidth={titleWidth}>
          <BeaconSelector
            disabled={!websiteIdField || isFormInEditMode}
            onChange={newBeaconType =>
              onChange(['scope', 'beaconType'], () => beaconTypeField.setValue(newBeaconType).setTouched(true))
            }
            value={beaconType}
          />
        </Section>
        <WebsiteTagFilterBuilder readOnly={isFormInEditMode} width={titleWidth} />
      </Sections>
    </section>
  );
}
