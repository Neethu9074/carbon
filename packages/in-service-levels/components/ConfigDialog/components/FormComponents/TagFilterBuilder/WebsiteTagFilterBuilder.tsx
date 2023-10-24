/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { SloForm, SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { useWebsiteQueryBuilder } from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import { titleWidth } from 'in-service-levels/constants';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

interface SloScopeWebsiteSectionProps {
  form: SloForm;
  onChange: SloFormOnChange;
}

export default function WebsiteTagFilterBuilder({ form, onChange }: SloScopeWebsiteSectionProps) {
  const beaconTypeField = form.getIn(['scope', 'beaconType']);
  const tagFilterExpressionField = form.getIn(['scope', 'tagFilterExpression']);
  const websiteIdField = form.getIn(['entity', 'entityId']);

  const { QueryBuilder } = useWebsiteQueryBuilder({
    beaconType: beaconTypeField.value,
    websiteId: websiteIdField.value
  });

  const isScopeSelected = beaconTypeField.value && websiteIdField.value;

  return (
    <Section
      titleWidth={titleWidth}
      actions={
        tagFilterExpressionField.value.length ? (
          <Button
            kind="subtle"
            icon="lib_openclose_cancel"
            size="compact"
            onClick={() =>
              onChange(['scope', 'tagFilterExpression'], () => tagFilterExpressionField.setValue([]).setTouched(true))
            }
          >
            {t('in-service-levels:general.clear')}
          </Button>
        ) : null
      }
      title={t('in-service-levels:createSloDialog.customFilter')}
    >
      {isScopeSelected ? (
        <QueryBuilder
          onChange={newFilterExpression =>
            onChange(['scope', 'tagFilterExpression'], () =>
              tagFilterExpressionField.setValue(newFilterExpression).setTouched(true)
            )
          }
          value={tagFilterExpressionField.value}
        />
      ) : (
        <Button size="compact" icon="lib_openclose_add" kind="subtle" disabled>
          {t('in-components:queryBuilder.components.filterButtonAddFilter')}
        </Button>
      )}
    </Section>
  );
}
