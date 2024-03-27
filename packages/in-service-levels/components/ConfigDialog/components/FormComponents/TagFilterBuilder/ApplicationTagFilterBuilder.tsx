/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, Stack, Typography } from '@instana/components';

import ApplicationTagFilterBuilderContent from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/ApplicationTagFilterBuilderContent';
import { SloForm, SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { t } from 'in-i18n';

interface ApplicationTagFilterBuilderProps {
  form: SloForm;
  onChange: SloFormOnChange;
  readOnly?: boolean;
  hasServiceEndpoint?: boolean;
}

export default function ApplicationTagFilterBuilder({
  form,
  onChange,
  readOnly = false,
  hasServiceEndpoint
}: ApplicationTagFilterBuilderProps) {
  const applicationIdField = form.getIn(['entity', 'entityId']);
  const boundaryScopeField = form.getIn(['scope', 'boundaryScope']);
  const isScopeSelected = boundaryScopeField.value && applicationIdField.value;

  return (
    <Stack gap="small">
      <Typography variant="heading-200">{t('in-service-levels:createSloDialog.custom')}</Typography>
      <Typography variant="body-regular">{t('in-service-levels:createSloDialog.customDescription')}</Typography>
      {!isScopeSelected ? (
        <div>
          <Button size="compact" icon="lib_openclose_add" kind="subtle" disabled>
            {t('in-components:queryBuilder.components.filterButtonAddFilter')}
          </Button>
        </div>
      ) : (
        <ApplicationTagFilterBuilderContent
          form={form}
          onChange={onChange}
          readOnly={readOnly}
          hasServiceEndpoint={hasServiceEndpoint}
        />
      )}
    </Stack>
  );
}
