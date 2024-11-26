/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Typography } from '@instana/components';

import SloApplicationEntityEditSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloApplicationEntityEditSection';
import SloWebsiteEntityEditSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloWebsiteEntityEditSection';
import SloSynthethicEntitySection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloSynthethicEntitySection';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { t } from 'in-i18n';

export default function SloEntityEditModeSectionContent() {
  const { form } = useContext(SloFormContext);

  const sloSloEntityTypeField = form.getIn(['entity', 'type']);

  return (
    <>
      <Typography variant="heading-200" component="h2" noMargin>
        {t('in-service-levels:general.entityTypes.label', { context: sloSloEntityTypeField.value })}:
      </Typography>
      {sloSloEntityTypeField.value === 'application' && <SloApplicationEntityEditSection />}
      {sloSloEntityTypeField.value === 'website' && <SloWebsiteEntityEditSection />}
      {sloSloEntityTypeField.value === 'synthetic' && <SloSynthethicEntitySection />}
    </>
  );
}
