/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';
import { noop } from 'lodash';

import { Application } from '@instana/types';
import { Card } from '@instana/components';

import SloEntityTable from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTable';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import useApplication from 'in-applications/hooks/useApplication';
import { t } from 'in-i18n';

export default function SloApplicationEntityEditSection() {
  const { form } = useContext(SloFormContext);

  const sloEntityTypeField = form.getIn(['entity', 'type']);
  const entityIdField = form.getIn(['entity', 'entityId']);
  const entityId = entityIdField.value;

  const [selectedApplication, , , progress] = useApplication(entityId);

  return (
    <Card title={t('in-service-levels:general.select', { entity: sloEntityTypeField.value })}>
      <SloEntityTable
        disabled
        entityList={[selectedApplication] as Application[]}
        onChange={noop}
        progress={progress}
      />
    </Card>
  );
}
