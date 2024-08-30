/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field } from 'formalistic';
import React from 'react';

import { Stack, Button } from '@instana/components';

import BeaconSelectInSection from 'in-custom-dashboards/widgets/SloLegacy/sli/BeaconSelectInSection';
import { AvailableBeaconTypes } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import SectionLabelWithSubtext from 'in-components/workspace/SectionLabelWithSubtext';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

interface BeaconConfiguratorProps {
  beaconOptions: readonly AvailableBeaconTypes[];
  QueryBuilder: QueryBuilderComponent;
  onChangeBeaconType: (value: string) => void;
  onChangeTagFilterExpression: (expression: FormModelElement[]) => void;
  withAdditionalFilters?: boolean;
  tagFilterExpressionField?: Field<FormModelElement[]>;
  beaconTypeField?: Field<AvailableBeaconTypes>;
}

export default function BeaconConfigurator({
  beaconOptions,
  QueryBuilder,
  onChangeBeaconType,
  onChangeTagFilterExpression,
  withAdditionalFilters,
  tagFilterExpressionField,
  beaconTypeField
}: BeaconConfiguratorProps) {
  return (
    <Stack component="section" gap="normal">
      <Header>{t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconConfigLabel')}</Header>
      <Stack component="section" gap="xsmall">
        <Sections>
          <BeaconSelectInSection
            onChange={onChangeBeaconType}
            beaconOptions={beaconOptions}
            hasError={!beaconTypeField?.valid && beaconTypeField?.touched}
            value={beaconTypeField?.value}
          />
        </Sections>
        {withAdditionalFilters && (
          <Sections>
            <Section
              title={
                <SectionLabelWithSubtext
                  subtext={t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconFiltersSubtext')}
                >
                  {t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconFiltersLabel')}
                </SectionLabelWithSubtext>
              }
              actions={
                <Button
                  kind="subtle"
                  icon="lib_openclose_cancel"
                  size="compact"
                  onClick={() => onChangeTagFilterExpression([])}
                >
                  {t('in-custom-dashboards:widgets.slo.tagFilterExpressConfig.clear')}
                </Button>
              }
            >
              <QueryBuilder onChange={onChangeTagFilterExpression} value={tagFilterExpressionField?.value ?? []} />
            </Section>
          </Sections>
        )}
      </Stack>
    </Stack>
  );
}
