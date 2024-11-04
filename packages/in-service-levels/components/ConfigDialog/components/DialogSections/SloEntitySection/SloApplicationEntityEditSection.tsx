/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';
import { noop } from 'lodash';

import { Typography } from '@instana/components';
import { Application } from '@instana/types';

import SloEntityTable from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTable';
import SloTableHeader from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloTableHeader';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import useApplication from 'in-applications/hooks/useApplication';
import Sections from 'in-components/workspace/Sections/Sections';
import { t } from 'in-i18n';

export default function SloApplicationEntityEditSection() {
  const { form } = useContext(SloFormContext);

  const sloEntityTypeField = form.getIn(['entity', 'type']);
  const entityIdsField = form.getIn(['entity', 'entityIds']);
  const entityId = entityIdsField.value[0];

  const [selectedApplication, , , progress] = useApplication(entityId);

  return (
    <Sections>
      <SloTableHeader>
        <Typography variant="heading-200" component="h2">
          {t('in-service-levels:general.select', { entity: sloEntityTypeField.value })}
        </Typography>
      </SloTableHeader>
      <SloEntityTable
        asRadioButton
        disabled
        entityList={[selectedApplication] as Application[]}
        onChange={noop}
        progress={progress}
      />
    </Sections>
  );
}
