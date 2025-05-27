/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Close } from '@carbon/icons-react';
import React from 'react';

import { Typography } from '@instana/components';
import { Button } from '@instana/carbon';

import { SloForm, SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { useWebsiteQueryBuilder } from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

interface WebsiteTagFilterBuilderContentProps {
  form: SloForm;
  onChange: SloFormOnChange;
  readOnly?: boolean;
  width?: string;
}

export default function WebsiteTagFilterBuilderContent({
  form,
  onChange,
  readOnly,
  width
}: WebsiteTagFilterBuilderContentProps) {
  const beaconTypeField = form.getIn(['scope', 'beaconType']);
  const tagFilterExpressionField = form.getIn(['scope', 'tagFilterExpression']);
  const websiteIdField = form.getIn(['entity', 'entityIds']);

  const { QueryBuilder } = useWebsiteQueryBuilder({
    beaconType: beaconTypeField.value,
    websiteId: websiteIdField.value[0]
  });

  const tagFilterExpression = tagFilterExpressionField.value ?? [];
  const shouldRenderExplanationText = readOnly && tagFilterExpression.length === 0;
  const shouldRenderClearButton = tagFilterExpression.length !== 0 && !readOnly;

  return (
    <Section
      actions={
        shouldRenderClearButton && (
          <Button
            kind="ghost"
            renderIcon={Close}
            icon="lib_openclose_cancel"
            size="sm"
            onClick={() =>
              onChange(['scope', 'tagFilterExpression'], () => tagFilterExpressionField.setValue([]).setTouched(true))
            }
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
          value={tagFilterExpression}
        />
      )}
    </Section>
  );
}
