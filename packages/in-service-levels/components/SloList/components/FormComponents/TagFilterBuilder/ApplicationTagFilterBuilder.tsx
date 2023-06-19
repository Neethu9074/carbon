/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item } from 'formalistic';
import React from 'react';

import { Button } from '@instana/components';

// eslint-disable-next-line
import { useApplicationQueryBuilder } from 'in-custom-dashboards/widgets/Slo/sli/hooks/useApplicationQueryBuilder';
import { ApplicationSloForm, ApplicationSloFormPath } from 'in-service-levels/components/ConfigDialog/createSloForm';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

interface SloScopeWebsiteSectionProps {
  form: ApplicationSloForm;
  onChange: (path: ApplicationSloFormPath, updater: (i: Item) => Item) => void;
}

export const ApplicationTagFilterBuilder = ({ form, onChange }: SloScopeWebsiteSectionProps) => {
  const applicationIdField = form.getIn(['entity', 'applicationId']);
  const boundaryScopeField = form.getIn(['scope', 'boundaryScope']);
  const tagFilterExpressionField = form.getIn(['scope', 'tagFilterExpression']);

  const { QueryBuilder } = useApplicationQueryBuilder({
    boundaryScope: boundaryScopeField.value,
    applicationId: applicationIdField.value
  });

  return (
    <Section
      title={t('in-service-levels:createSloDialog.customFilter')}
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
            {t('in-custom-dashboards:widgets.slo.tagFilterExpressConfig.clear')}
          </Button>
        ) : null
      }
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
