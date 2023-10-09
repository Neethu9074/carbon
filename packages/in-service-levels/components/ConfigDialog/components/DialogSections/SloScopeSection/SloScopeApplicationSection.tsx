/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack, Typography } from '@instana/components';

import ApplicationTagFilterBuilder from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/ApplicationTagFilterBuilder';
import BoundaryScopeConfigurator from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/BoundaryScopeConfigurator';
import HiddenCallsConfigurator from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/HiddenCallsConfigurator';
import EndpointSelectBox from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/EndpointSelectBox';
import ServiceSelectBox from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/ServiceSelectBox';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

export default function SloScopeApplicationSection() {
  const { form, onChange } = useContext(SloFormContext);

  const applicationIdField = form.getIn(['entity', 'entityId']);
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
          <Section title={t('in-service-levels:general.boundary')} titleWidth="9.7rem">
            <BoundaryScopeConfigurator
              value={boundaryField.value}
              onChange={scope =>
                onChange(['scope', 'boundaryScope'], () => boundaryField.setValue(scope).setTouched(true))
              }
            />
          </Section>
          <Section title={t('in-custom-dashboards:widgets.slo.sliFormPresenter.hiddenCalls')} titleWidth="10.7rem">
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
}
