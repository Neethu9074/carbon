/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { StackItem, Typography } from '@instana/components';

import useMergedServiceEndpointCustomFilters from 'in-service-levels/hooks/useMergedServiceEndpointCustomFilters';
import { ClearableTagFilterQueryBuilder } from 'in-service-levels/components/Shared/TagFilterQueryBuilder';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { useApplicationQueryBuilder } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import { t } from 'in-i18n';

export default function ApplicationTagFilterBuilderContent() {
  const { form, mode, onChange } = useContext(SloFormContext);
  const applicationIdField = form.getIn(['entity', 'entityIds']);
  const boundaryScopeField = form.getIn(['scope', 'boundaryScope']);
  const service = form.getIn(['scope', 'serviceId']);
  const endpoint = form.getIn(['scope', 'endpointId']);
  const tagFilterExpressionField = form.getIn(['scope', 'tagFilterExpression']);

  const applicationId = applicationIdField.value[0];
  const isCustomTag = tagFilterExpressionField.value.length > 0;
  const { QueryBuilder } = useApplicationQueryBuilder({
    boundaryScope: boundaryScopeField.value,
    applicationId: applicationId
  });
  const custom = useMergedServiceEndpointCustomFilters(form);

  const isFormInEditMode = mode === 'EDIT';
  // We need to show the config in case a customer wants to edit an existing SLO, that already has been created by using the old UI and has defined a specific service or endpoint and also some custom tag filters.
  const requiresMergedFilters = (isFormInEditMode && isCustomTag && Boolean(service.value)) || Boolean(endpoint.value);
  const shouldRenderExplanationText = isFormInEditMode && tagFilterExpressionField.value.length === 0;

  return (
    <StackItem>
      {shouldRenderExplanationText && (
        <Typography variant="body-regular">
          {t('in-service-levels:components.tagFilterBuilder.filterAbscenseExplanation')}
        </Typography>
      )}
      {!shouldRenderExplanationText && !isFormInEditMode && (
        <ClearableTagFilterQueryBuilder
          applicationId={applicationId}
          onChange={newFilterExpression =>
            onChange(['scope', 'tagFilterExpression'], () =>
              tagFilterExpressionField.setValue(newFilterExpression).setTouched(true)
            )
          }
          value={requiresMergedFilters ? custom : tagFilterExpressionField.value}
        />
      )}
      {!shouldRenderExplanationText && isFormInEditMode && (
        <QueryBuilder
          onChange={newFilterExpression =>
            onChange(['scope', 'tagFilterExpression'], () =>
              tagFilterExpressionField.setValue(newFilterExpression).setTouched(true)
            )
          }
          readOnly={isFormInEditMode}
          value={requiresMergedFilters ? custom : tagFilterExpressionField.value}
        />
      )}
    </StackItem>
  );
}
