/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item } from 'formalistic';
import React from 'react';

import { Stack, Typography } from '@instana/components';

// Files below are shared files coming from in-custom-dashboards. There is a plan to move these components to a proper shared folders,
// but for now it is a faster solution
// eslint-disable-next-line
import BoundaryScopeConfigurator from 'in-custom-dashboards/widgets/Slo/sli/BoundaryScopeConfigurator';
import { ApplicationTagFilterBuilder } from 'in-service-levels/components/SloList/components/FormComponents/TagFilterBuilder/ApplicationTagFilterBuilder';
// eslint-disable-next-line
import HiddenCallsConfigurator from 'in-custom-dashboards/widgets/Slo/sli/HiddenCallsConfigurator';
import { ApplicationSloForm, ApplicationSloFormPath } from 'in-service-levels/components/ConfigDialog/createSloForm';
// eslint-disable-next-line
import EndpointSelectBox from 'in-custom-dashboards/widgets/Slo/sli/EndpointSelectBox';
// eslint-disable-next-line
import ServiceSelectBox from 'in-custom-dashboards/widgets/Slo/sli/ServiceSelectBox';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

interface SloScopeSectionProps {
  form: ApplicationSloForm;
  onChange: (path: ApplicationSloFormPath, updater: (i: Item) => Item) => void;
}

export const SloScopeApplicationSection = ({ form, onChange }: SloScopeSectionProps) => {
  const applicationIdField = form.getIn(['entity', 'applicationId']);
  const endpointIdField = form.getIn(['scope', 'endpointId']);
  const boundaryField = form.getIn(['scope', 'boundaryScope']);
  const includeInternalField = form.getIn(['scope', 'includeInternal']);
  const includeSyntheticField = form.getIn(['scope', 'includeSynthetic']);
  const serviceIdField = form.getIn(['scope', 'serviceId']);

  return (
    <section>
      <Typography variant="heading-200" component="h2">
        {t('in-service-levels:createSloDialog.selectScopeTitle')}
      </Typography>
      <Stack gap="small">
        <Sections>
          <Section title={t('in-service-levels:general.boundary')} titleWidth="6rem">
            <BoundaryScopeConfigurator
              value={boundaryField.value}
              onChange={scope =>
                onChange(['scope', 'boundaryScope'], () => boundaryField.setValue(scope).setTouched(true))
              }
            />
          </Section>
        </Sections>
        <Sections>
          <Section title={t('in-custom-dashboards:widgets.slo.sliFormPresenter.hiddenCalls')} titleWidth="6rem">
            <HiddenCallsConfigurator
              includeInternal={includeInternalField.value}
              includeSynthetic={includeSyntheticField.value}
              onChangeInternal={() =>
                onChange(['scope', 'includeInternal'], () => includeInternalField.setValue(!includeInternalField.value))
              }
              onChangeSynthetic={() =>
                onChange(['scope', 'includeSynthetic'], () =>
                  includeSyntheticField.setValue(!includeSyntheticField.value)
                )
              }
            />
          </Section>
        </Sections>
        <Sections>
          <ServiceSelectBox
            boundaryScope={boundaryField.value}
            applicationId={applicationIdField.value}
            value={serviceIdField.value}
            hasError={!serviceIdField.valid && serviceIdField.touched}
            onChange={value => onChange(['scope', 'serviceId'], () => serviceIdField.setValue(value!).setTouched(true))}
          />
          <EndpointSelectBox
            boundaryScope={boundaryField.value}
            applicationId={applicationIdField.value}
            serviceId={serviceIdField.value}
            value={endpointIdField.value}
            hasError={!endpointIdField.valid && endpointIdField.touched}
            onChange={value =>
              onChange(['scope', 'endpointId'], () => endpointIdField.setValue(value).setTouched(true))
            }
          />
          <ApplicationTagFilterBuilder form={form} onChange={onChange} />
        </Sections>
      </Stack>
    </section>
  );
};
