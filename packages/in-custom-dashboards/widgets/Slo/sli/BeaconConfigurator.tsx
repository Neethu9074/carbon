/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack, Button } from '@instana/components';

import { SliEntityType, websiteTimeBased } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';
import { Field, Item, MapForm } from 'formalistic';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

type OnChange = (path: string[], updater: (item: Item) => Item) => void;

interface BeaconConfiguratorProps {
  QueryBuilder: unknown;
  form: MapForm;
  onChange: OnChange;
}

export default function BeaconConfigurator({ QueryBuilder, form, onChange }: BeaconConfiguratorProps) {
  const sliEntityForm = form.get('sliEntity') as MapForm;
  const sliType = (sliEntityForm.get('sliType') as Field<SliEntityType>).value;
  const filterExpression = (sliEntityForm.get('filterExpression') as Field<FormModelElement[]>).value;

  return (
    <Stack component="section" gap="normal">
      <Header>{t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconConfigLabel')}</Header>
      <Stack component="section" gap="xsmall">
        <Sections>
          <Section title={t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconScopeLabel')}>
            {t('in-custom-dashboards:widgets.slo.sliFormPresenter.httpRequestsLabel')}
          </Section>
        </Sections>
        {sliType === websiteTimeBased && (
          <Sections>
            <Section
              title={t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconFiltersLabel')}
              actions={
                <Button
                  kind="subtle"
                  icon="lib_openclose_cancel"
                  size="compact"
                  onClick={() =>
                    onChange(['sliEntity', 'filterExpression'], f =>
                      (f as Field<FormModelElement[]>).setValue([]).setTouched(true)
                    )
                  }
                >
                  {t('in-alerting:smartAlerts.components.smartAlertDialog.clearTagFilterExpressionButton')}
                </Button>
              }
            >
              <QueryBuilder
                onChange={fe =>
                  onChange(['sliEntity', 'filterExpression'], f =>
                    (f as Field<FormModelElement[]>).setValue(fe).setTouched(true)
                  )
                }
                value={filterExpression}
              />
            </Section>
          </Sections>
        )}
      </Stack>
    </Stack>
  );
}
