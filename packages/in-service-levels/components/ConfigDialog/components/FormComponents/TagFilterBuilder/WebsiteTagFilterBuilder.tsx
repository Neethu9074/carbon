/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item } from 'formalistic';
import React from 'react';

import { Button } from '@instana/components';

import { WebsiteSloForm, WebsiteSloFormPath } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { useWebsiteQueryBuilder } from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

interface SloScopeWebsiteSectionProps {
  form: WebsiteSloForm;
  onChange: (path: WebsiteSloFormPath, updater: (i: Item) => Item) => void;
}

export const WebsiteTagFilterBuilder = ({ form, onChange }: SloScopeWebsiteSectionProps) => {
  const beaconTypeField = form.getIn(['scope', 'beaconType']);
  const tagFilterExpressionField = form.getIn(['scope', 'tagFilterExpression']);
  const websiteIdField = form.getIn(['entity', 'websiteId']);

  const { QueryBuilder } = useWebsiteQueryBuilder({
    beaconType: beaconTypeField.value,
    websiteId: websiteIdField.value
  });

  return (
    <Section
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
      <QueryBuilder
        onChange={newFilterExpression =>
          onChange(['scope', 'tagFilterExpression'], () =>
            tagFilterExpressionField.setValue(newFilterExpression).setTouched(true)
          )
        }
        value={tagFilterExpressionField.value}
      />
    </Section>
  );
};
