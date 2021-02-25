/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import SectionLabelWithSubtext from 'in-new-components/workspace/SectionLabelWithSubtext';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import HelpAction from 'in-new-components/workspace/HelpAction';
import Sections from 'in-new-components/workspace/Sections';
import { compareIgnoreCase } from 'in-services/util/string';

export default function APConfigForm({ apConfigIdField: field, apConfigs, onUpdateApConfigId }) {
  return (
    <Sections>
      <SelectInSection
        label={
          <SectionLabelWithSubtext subtext={t('in-custom-dashboards:widgets.slo.apConfigFormComp.userJourneyOffering')}>
            {t('in-custom-dashboards:widgets.slo.apConfigFormComp.appnPerspective')}
          </SectionLabelWithSubtext>
        }
        id="sli-config-ap"
        value={field?.value}
        onChange={e => {
          const apId = e.target.value;
          onUpdateApConfigId(apId);
        }}
        hasError={!field.valid && field.touched}
        additionalContent={
          <OverridingTextTouchedMessage
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
