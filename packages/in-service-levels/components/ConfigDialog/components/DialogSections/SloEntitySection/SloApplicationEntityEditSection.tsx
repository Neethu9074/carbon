/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';
import { noop } from 'lodash';

import { Li, Typography, Ul } from '@instana/components';
import { Application } from '@instana/types';

import SloEntityTable from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTable';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import useApplication from 'in-applications/hooks/useApplication';
import { t } from 'in-i18n';

import locals from './SloEntityTable.mless';

export default function SloApplicationEntityEditSection() {
  const { form } = useContext(SloFormContext);

  const sloEntityTypeField = form.getIn(['entity', 'type']);
  const entityIdField = form.getIn(['entity', 'entityId']);
  const entityId = entityIdField.value;

  const [selectedApplication, , , progress] = useApplication(entityId);

  return (
    <div>
      <Ul>
        <Li className={locals.itemHeader}>
          <Typography variant="heading-200" component="h2">
            {t('in-service-levels:general.select', { entity: sloEntityTypeField.value })}
          </Typography>
        </Li>
      </Ul>
      <SloEntityTable
        disabled
        entityList={[selectedApplication] as Application[]}
        onChange={noop}
        progress={progress}
      />
    </div>
  );
}
