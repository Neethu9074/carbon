/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack, Button } from '@instana/components';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

interface BeaconConfiguratorProps {
  QueryBuilder: QueryBuilderComponent;
  onChange: (expression: FormModelElement[]) => void;
  value: FormModelElement[];
  withAdditionalFilters?: boolean;
}

export default function BeaconConfigurator({
  QueryBuilder,
  value,
  onChange,
  withAdditionalFilters
}: BeaconConfiguratorProps) {
  return (
    <Stack component="section" gap="normal">
      <Header>{t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconConfigLabel')}</Header>
      <Stack component="section" gap="xsmall">
        <Sections>
          <Section title={t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconScopeLabel')}>
            {t('in-custom-dashboards:widgets.slo.sliFormPresenter.httpRequestsLabel')}
          </Section>
        </Sections>
        {withAdditionalFilters && (
          <Sections>
            <Section
              title={t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconFiltersLabel')}
              actions={
                <Button kind="subtle" icon="lib_openclose_cancel" size="compact" onClick={() => onChange([])}>
                  {t('in-alerting:smartAlerts.components.smartAlertDialog.clearTagFilterExpressionButton')}
                </Button>
              }
            >
              <QueryBuilder onChange={onChange} value={value} />
            </Section>
          </Sections>
        )}
      </Stack>
    </Stack>
  );
}
