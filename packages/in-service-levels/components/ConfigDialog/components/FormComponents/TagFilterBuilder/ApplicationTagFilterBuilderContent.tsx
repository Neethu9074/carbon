/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, Typography } from '@instana/components';

import { SloForm, SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { useApplicationQueryBuilder } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

interface ApplicationTagFilterBuilderContentProps {
  form: SloForm;
  onChange: SloFormOnChange;
  readOnly?: boolean;
  width?: string;
}

export default function ApplicationTagFilterBuilderContent({
  form,
  onChange,
  readOnly = false,
  width
}: ApplicationTagFilterBuilderContentProps) {
  const applicationIdField = form.getIn(['entity', 'entityId']);
  const boundaryScopeField = form.getIn(['scope', 'boundaryScope']);
  const tagFilterExpressionField = form.getIn(['scope', 'tagFilterExpression']);

  const { QueryBuilder } = useApplicationQueryBuilder({
    boundaryScope: boundaryScopeField.value,
    applicationId: applicationIdField.value
  });

  const shouldRenderExplanationText = readOnly && tagFilterExpressionField.value.length === 0;
  const shouldRenderClearButton = tagFilterExpressionField.value.length !== 0 && !readOnly;

  return (
    <Section
      actions={
        shouldRenderClearButton && (
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
        )
      }
      title={t('in-service-levels:createSloDialog.customFilter')}
      titleWidth={width}
    >
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
          value={tagFilterExpressionField.value}
        />
      )}
    </Section>
  );
}
