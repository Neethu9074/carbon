/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { StackItem, Typography } from '@instana/components';
import { TagFilter } from '@instana/types';
import { Button } from '@instana/legacy';

import { SloForm, SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { useApplicationQueryBuilder } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import useMakeServiceEndpointCustom from 'in-service-levels/hooks/useMakeServiceEndpointCustom';
import { t } from 'in-i18n';

interface ApplicationTagFilterBuilderContentProps {
  form: SloForm;
  onChange: SloFormOnChange;
  readOnly?: boolean;
  hasServiceEndpoint?: string | boolean;
}

export default function ApplicationTagFilterBuilderContent({
  form,
  onChange,
  readOnly = false,
  hasServiceEndpoint
}: ApplicationTagFilterBuilderContentProps) {
  const applicationIdField = form.getIn(['entity', 'entityId']);
  const boundaryScopeField = form.getIn(['scope', 'boundaryScope']);
  const tagFilterExpressionField = form.getIn(['scope', 'tagFilterExpression']);
  const { QueryBuilder } = useApplicationQueryBuilder({
    boundaryScope: boundaryScopeField.value,
    applicationId: applicationIdField.value
  });
  const custom = useMakeServiceEndpointCustom(form);

  const shouldRenderExplanationText = readOnly && tagFilterExpressionField.value.length === 0;
  const shouldRenderClearButton = tagFilterExpressionField.value.length !== 0 && !readOnly;

  return (
    <StackItem>
      {shouldRenderExplanationText ? (
        <Typography variant="body-regular">
          {t('in-service-levels:components.tagFilterBuilder.filterAbscenseExplanation')}
        </Typography>
      ) : (
        <QueryBuilder
          onChange={newFilterExpression =>
            onChange(['scope', 'tagFilterExpression'], () =>
              tagFilterExpressionField.setValue(newFilterExpression).setTouched(true)
            )
          }
          readOnly={readOnly}
          value={hasServiceEndpoint ? (custom as TagFilter[]) : tagFilterExpressionField.value}
        />
      )}
      {shouldRenderClearButton && (
        <Button
          icon="lib_openclose_cancel"
          kind="subtle"
          onClick={() =>
            onChange(['scope', 'tagFilterExpression'], () => tagFilterExpressionField.setValue([]).setTouched(true))
          }
          size="compact"
        >
          {t('in-service-levels:general.clear')}
        </Button>
      )}
    </StackItem>
  );
}
