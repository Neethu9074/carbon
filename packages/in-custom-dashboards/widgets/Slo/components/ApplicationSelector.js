/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { useObservable } from '@instana/hooks';

import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingFieldValidationMessage';
import SectionLabelWithSubtext from 'in-components/workspace/SectionLabelWithSubtext';
import { getApplicationConfigsAsResultObservable } from 'in-api/applicationConfigs';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import HelpAction from 'in-components/workspace/HelpAction';
import { compareIgnoreCase } from 'in-services/util/string';
import Sections from 'in-components/workspace/Sections';
import { t } from 'in-i18n';

export default function ApplicationSelector({
  apIdField: field,
  onChange,
  getApConfigs = getApplicationConfigsAsResultObservable
}) {
  const apId = field?.value;
  const apConfigs = useObservable(
    getApConfigs().map(({ data }) => data),
    [getApConfigs]
  );

  useEffect(
    () => {
      if (apConfigs && apId) {
        onChange(apConfigs.find(({ id }) => id === apId));
      }
    },
    // Not tracking onChange and apId here because this should only the first time apConfigs finished loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apConfigs]
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
          const newId = e.target.value;
          onChange(apConfigs.find(({ id }) => id === newId));
        }}
        hasError={!field.valid && field.touched}
        additionalContent={
          <OverridingFieldValidationMessage
            field={field}
            message={t('in-custom-dashboards:widgets.slo.apConfigFormComp.selectAppPerspect')}
          />
        }
        actions={
          <HelpAction>{t('in-custom-dashboards:widgets.slo.apConfigFormComp.appPerspectHelpAction')}</HelpAction>
        }
      >
        {(apConfigs?.length ?? 0) === 0 && (
          <option value="">{t('in-custom-dashboards:widgets.slo.apConfigFormComp.noAppPerspect')}</option>
        )}
        {apConfigs?.length > 0 && (
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
