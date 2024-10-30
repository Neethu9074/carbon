/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';
import { noop } from 'lodash';

import { Typography } from '@instana/components';
import { Website } from '@instana/types';

import SloEntityTable from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTable';
import SloTableHeader from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloTableHeader';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import Sections from 'in-components/workspace/Sections/Sections';
import useWebsite from 'in-websites/hooks/useWebsite';
import { t } from 'in-i18n';

export default function SloWebsiteEntityEditSection() {
  const { form } = useContext(SloFormContext);

  const sloEntityTypeField = form.getIn(['entity', 'type']);
  const entityIdField = form.getIn(['entity', 'entityIds']);
  const entityId = entityIdField.value[0];

  const [selectedWebsite, , , progress] = useWebsite(entityId);

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
        entityList={[selectedWebsite] as Website[]}
        onChange={noop}
        progress={progress}
      />
    </Sections>
  );
}
