/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack } from '@instana/components';

import ApplicationTagFilterBuilder from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/ApplicationTagFilterBuilder';
import BoundaryScopeConfigurator from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/BoundaryScopeConfigurator';
import HiddenCallsConfigurator from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/HiddenCallsConfigurator';
import EndpointSelectBox from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/EndpointSelectBox';
import ServiceSelectBox from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/ServiceSelectBox';
import SloDialogSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/Shared/SloDialogSection';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { titleWidth } from 'in-service-levels/constants';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

export default function SloScopeApplicationSection() {
  const { form, mode, onChange } = useContext(SloFormContext);

  const applicationIdField = form.getIn(['entity', 'entityId']);
  const endpointIdField = form.getIn(['scope', 'endpointId']);
  const boundaryField = form.getIn(['scope', 'boundaryScope']);
  const includeInternalField = form.getIn(['scope', 'includeInternal']);
  const includeSyntheticField = form.getIn(['scope', 'includeSynthetic']);
  const serviceIdField = form.getIn(['scope', 'serviceId']);

  const isFormInEditMode = mode === 'EDIT';

  return (
    <SloDialogSection title={t('in-service-levels:createSloDialog.selectScopeTitle')}>
      <Stack gap="small">
        <Sections>
          <Section title={t('in-service-levels:general.boundary')} titleWidth={titleWidth}>
            <BoundaryScopeConfigurator
              disabled={isFormInEditMode}
              onChange={scope =>
                onChange(['scope', 'boundaryScope'], () => boundaryField.setValue(scope).setTouched(true))
              }
              value={boundaryField.value}
            />
          </Section>
          <Section title={t('in-custom-dashboards:widgets.slo.sliFormPresenter.hiddenCalls')} titleWidth={titleWidth}>
            <HiddenCallsConfigurator
              disabled={isFormInEditMode}
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
            applicationId={applicationIdField.value}
            boundaryScope={boundaryField.value}
            disabled={isFormInEditMode}
            hasError={!serviceIdField.valid && serviceIdField.touched}
            onChange={value => onChange(['scope', 'serviceId'], () => serviceIdField.setValue(value!).setTouched(true))}
            value={serviceIdField.value}
          />
          <EndpointSelectBox
            applicationId={applicationIdField.value}
            boundaryScope={boundaryField.value}
            disabled={isFormInEditMode}
            hasError={!endpointIdField.valid && endpointIdField.touched}
            onChange={value =>
              onChange(['scope', 'endpointId'], () => endpointIdField.setValue(value).setTouched(true))
            }
            serviceId={serviceIdField.value}
            value={endpointIdField.value}
          />
          <ApplicationTagFilterBuilder form={form} onChange={onChange} readOnly={isFormInEditMode} width={titleWidth} />
        </Sections>
      </Stack>
    </SloDialogSection>
  );
}
