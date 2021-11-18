/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field } from 'formalistic';
import React from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Spacer } from '@instana/components';

import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingFieldValidationMessage';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import HelpAction from 'in-components/workspace/HelpAction';
import Sections from 'in-components/workspace/Sections';
import { getWebsites } from 'in-websites/api/websites';
import { WebsiteConfiguration } from 'in-types';
import { t } from 'in-i18n';

interface WebsiteSelectorProps {
  websiteIdField: Field<string>;
  onChange: (id: string) => void;
  getWebsiteConfigs: () => Observable<WebsiteConfiguration[]>;
}

export default function WebsiteSelector({
  websiteIdField: field,
  onChange,
  getWebsiteConfigs = getWebsites
}: WebsiteSelectorProps) {
  const configs = useObservable(getWebsiteConfigs(), [getWebsiteConfigs]);
  return (
    <Sections>
      <SelectInSection
        label={t('in-custom-dashboards:widgets.slo.websiteSelector.website')}
        id="sli-config-website"
        value={field?.value}
        onChange={e => {
          onChange(e.target.value);
        }}
        hasError={!field.valid && field.touched}
        additionalContent={
          <OverridingFieldValidationMessage
            field={field}
            message={t('in-custom-dashboards:widgets.slo.websiteSelector.selectWebsite')}
          />
        }
        actions={
          <HelpAction>
            {t('in-custom-dashboards:widgets.slo.websiteSelector.websiteHelpAction')}
            <Spacer />
            {t('in-custom-dashboards:widgets.slo.websiteSelector.rbacHint')}
          </HelpAction>
        }
      >
        {!configs?.length && (
          <option value="">{t('in-custom-dashboards:widgets.slo.websiteSelector.noWebsites')}</option>
        )}
        {configs && configs.length > 0 && (
          <option value="">{t('in-custom-dashboards:widgets.slo.websiteSelector.pleaseSelect')}</option>
        )}
        {configs &&
          configs.map(({ name, id }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
      </SelectInSection>
    </Sections>
  );
}
