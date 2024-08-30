/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import { ApplicationBoundaryScope } from '@instana/types';
import { Stack, Button } from '@instana/components';
import { t } from '@instana/i18n-react';

// eslint-disable-next-line import/no-deprecated -- Existing usage of deprecated code, this component will be removed in the future
import { getField } from 'in-custom-dashboards/widgets/SloLegacy/form';
import {
  apdexEntityKey,
  boundaryScopeKey,
  includeInternalKey,
  includeSyntheticKey,
  tagFilterExpressionKey
} from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/form';
import BoundaryScopeConfigurator from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/BoundaryScopeConfigurator';
import HiddenCallsConfigurator from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/HiddenCallsConfigurator';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { setFieldValue } from 'in-custom-dashboards/widgets/Apdex/form';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import Header from 'in-components/workspace/Header';

interface ApplicationScopeConfiguratorProps {
  form: MapForm<any>;
  updateForm: (path: string[], updater: (i: Item) => Item) => void;
  QueryBuilder: QueryBuilderComponent;
}

export default function ApplicationScopeConfiguratorSections({
  form,
  updateForm,
  QueryBuilder
}: ApplicationScopeConfiguratorProps) {
  const boundaryScope =
    // eslint-disable-next-line import/no-deprecated
    getField<ApplicationBoundaryScope>(form, [apdexEntityKey, boundaryScopeKey])?.value ?? 'INBOUND';
  // eslint-disable-next-line import/no-deprecated
  const includeInternal = getField<boolean>(form, [apdexEntityKey, includeInternalKey])?.value;
  // eslint-disable-next-line import/no-deprecated
  const includeSynthetic = getField<boolean>(form, [apdexEntityKey, includeSyntheticKey])?.value;
  // eslint-disable-next-line import/no-deprecated
  const tagFilterExpression = getField<FormModelElement[]>(form, [apdexEntityKey, tagFilterExpressionKey])?.value ?? [];

  return (
    <Stack component="section" gap="normal">
      <Header>{t('in-custom-dashboards:widgets.apdex.applicationScopeConfigurator.label')}</Header>
      <Sections>
        <Section title={t('in-custom-dashboards:widgets.apdex.applicationScopeConfigurator.boundaryScope')}>
          <BoundaryScopeConfigurator
            value={boundaryScope}
            onChange={scope => updateForm([apdexEntityKey, boundaryScopeKey], f => setFieldValue(f, scope, true))}
          />
        </Section>
        <Section title={t('in-custom-dashboards:widgets.apdex.applicationScopeConfigurator.hiddenCalls')}>
          <HiddenCallsConfigurator
            includeInternal={includeInternal}
            includeSynthetic={includeSynthetic}
            onChangeInternal={value =>
              updateForm([apdexEntityKey, includeInternalKey], f => setFieldValue(f, value, true))
            }
            onChangeSynthetic={value =>
              updateForm([apdexEntityKey, includeSyntheticKey], f => setFieldValue(f, value, true))
            }
          />
        </Section>
        <Section
          title={t('in-custom-dashboards:widgets.apdex.applicationScopeConfigurator.additionalFilters')}
          actions={
            <Button
              kind="subtle"
              icon="lib_openclose_cancel"
              size="compact"
              onClick={() => updateForm([apdexEntityKey, tagFilterExpressionKey], f => setFieldValue(f, [], true))}
            >
              {t('in-custom-dashboards:widgets.slo.tagFilterExpressConfig.clear')}
            </Button>
          }
        >
          <QueryBuilder
            onChange={value => updateForm([apdexEntityKey, tagFilterExpressionKey], f => setFieldValue(f, value, true))}
            value={tagFilterExpression}
          />
        </Section>
      </Sections>
    </Stack>
  );
}
