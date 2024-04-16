/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Button, StackItem } from '@instana/components';

import ApplicationTagFilterBuilderContent from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/ApplicationTagFilterBuilderContent';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { t } from 'in-i18n';

export default function ApplicationTagFilterBuilder() {
  const { form } = useContext(SloFormContext);
  const applicationIdField = form.getIn(['entity', 'entityId']);
  const boundaryScopeField = form.getIn(['scope', 'boundaryScope']);
  const isScopeSelected = boundaryScopeField.value && applicationIdField.value;

  return (
    <>
      {!isScopeSelected ? (
        <StackItem>
          <Button size="compact" icon="lib_openclose_add" kind="subtle" disabled>
            {t('in-components:queryBuilder.components.filterButtonAddFilter')}
          </Button>
        </StackItem>
      ) : (
        <ApplicationTagFilterBuilderContent />
      )}
    </>
  );
}
