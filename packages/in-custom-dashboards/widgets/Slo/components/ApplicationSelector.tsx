/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field } from 'formalistic';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Spacer } from '@instana/components';

import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingFieldValidationMessage';
import SectionLabelWithSubtext from 'in-components/workspace/SectionLabelWithSubtext';
import { getApplicationConfigsAsResultObservable } from 'in-api/applicationConfigs';
import { ObservableCreator } from 'in-services/util/memoizingObservableGenerator';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import HelpAction from 'in-components/workspace/HelpAction';
import { compareIgnoreCase } from 'in-services/util/string';
import Sections from 'in-components/workspace/Sections';
import { Result } from 'in-types';
import { t } from 'in-i18n';

interface ApData {
  id: string;
  label: string;
}
interface ApplicationSelectorProps {
  apIdField: Field<string>;
  onChange: (id: string | undefined) => void;
  getApConfigs?: ObservableCreator<void, Result<ApData[]>>;
}

export default function ApplicationSelector({
  apIdField: field,
  onChange,
  getApConfigs = getApplicationConfigsAsResultObservable
}: ApplicationSelectorProps) {
  const apId = field?.value;
  const apConfigs = useObservable(
    getApConfigs().map(({ data }) => data),
    [getApConfigs]
  );

  return (
    <Sections>
      <SelectInSection
        label={
          <SectionLabelWithSubtext subtext={t('in-custom-dashboards:widgets.slo.apConfigFormComp.userJourneyOffering')}>
            {t('in-custom-dashboards:widgets.slo.apConfigFormComp.appnPerspective')}
          </SectionLabelWithSubtext>
        }
        id="sli-config-ap"
        value={apId}
        onChange={e => {
          onChange(e.target.value);
        }}
        hasError={!field.valid && field.touched}
        additionalContent={
          <OverridingFieldValidationMessage
            field={field}
            message={t('in-custom-dashboards:widgets.slo.apConfigFormComp.selectAppPerspect')}
          />
        }
        actions={
          <HelpAction>
            {t('in-custom-dashboards:widgets.slo.apConfigFormComp.appPerspectHelpAction')}
            <Spacer />
            {t('in-custom-dashboards:widgets.slo.apConfigFormComp.rbacHint')}
          </HelpAction>
        }
      >
        {(apConfigs?.length ?? 0) === 0 ? (
          <option value="">{t('in-custom-dashboards:widgets.slo.apConfigFormComp.noAppPerspect')}</option>
        ) : (
          <option value="">{t('in-custom-dashboards:widgets.slo.apConfigFormComp.pleaseSelect')}</option>
        )}
        {[...(apConfigs ?? [])] // need to clone: readonly array may not be sorted
          .sort((a, b) => compareIgnoreCase(a.label, b.label))
          .map(({ label, id }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
      </SelectInSection>
    </Sections>
  );
}
