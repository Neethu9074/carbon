/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import InboundOrAllCallsOption from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsOption';
import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import { sliTypeOptions, applicationType, availabilityType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { boundaryScopes } from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/config';
import ServicesSelectBox from 'in-custom-dashboards/widgets/Slo/sli/ServicesSelectBox';
import EndpointSelectBox from 'in-custom-dashboards/widgets/Slo/sli/EndpointSelectBox';
import GoodBadEvents from 'in-custom-dashboards/widgets/Slo/sli/GoodBadEventsForm';
import { MetricsForm } from 'in-custom-dashboards/widgets/Slo/sli/MetricsForm';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import HelpAction from 'in-components/workspace/HelpAction';
import Sections from 'in-components/workspace/Sections';
import Divider from 'in-components/workspace/Divider';
import Section from 'in-components/workspace/Section';
import { Row, Col } from 'in-components/layout/Grid';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export function SliForm({ form, onChange, onChangeType, apName }) {
  const sliEntityForm = form.get('sliEntity');
  const applicationId = sliEntityForm.get('applicationId')?.value;
  const serviceId = sliEntityForm.get('serviceId')?.value;
  const endpointId = sliEntityForm.get('endpointId')?.value;
  const boundaryScope = sliEntityForm.get('boundaryScope')?.value;
  const includeInternal = sliEntityForm.get('includeInternal').value;
  const includeSynthetic = sliEntityForm.get('includeSynthetic').value;

  const onUpdateBoundaryScope = value => {
    onChange(['sliEntity', 'boundaryScope'], f => f.setValue(value).setTouched(true));
  };

  const onUpdateSliEntityField = (fieldName, value) => {
    onChange(['sliEntity', fieldName], f => f.setValue(value).setTouched(true));
  };

  const sliTypeForm = sliEntityForm.get('sliType');
  const sliType = sliTypeForm.value;

  return (
    <Stack gap="large">
      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliCustomization')}</Header>

        <Stack gap="xsmall">
          <Sections>
            {form.get('sliName').map(field => (
              <InputInSection
                id="new-sli-name"
                label={t('in-custom-dashboards:widgets.slo.sliFormPresenter.name')}
                onChange={e => onChange(['sliName'], f => f.setValue(e.target.value).setTouched(true))}
                value={field?.value}
                hasError={!field.valid && field.touched}
                maxLength={256}
                additionalContent={
                  <OverridingTextTouchedMessage
                    field={field}
                    message={t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliNameNotEmpty')}
                  />
                }
              />
            ))}
          </Sections>

          <Sections>
            {sliEntityForm.get('sliType').map(field => (
              <SelectInSection
                id="new-sli-type"
                label={t('in-custom-dashboards:widgets.slo.sliFormPresenter.type')}
                onChange={e => onChangeType(e.target.value)}
                value={field?.value ?? ''}
                hasError={!field.valid && field.touched}
                actions={
                  <HelpAction href="https://instana.com/docs/service_level_objectives/#sli-configuration/" external>
                    {t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliCustomHelpAction')}
                  </HelpAction>
                }
                additionalContent={
                  <OverridingTextTouchedMessage
                    field={sliTypeForm}
                    message={t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliTimeBasedOrAnEventBasedSli')}
                  />
                }
              >
                <option value="">{t('in-custom-dashboards:widgets.slo.sliFormPresenter.pleaseSelect')}</option>
                {sliTypeOptions.map(({ value, label }) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </SelectInSection>
            ))}
          </Sections>
        </Stack>
      </Stack>

      <Divider />

      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliEntity')}</Header>

        <Stack gap="xsmall">
          <Sections>
            <Section title={t('in-custom-dashboards:widgets.slo.sliFormPresenter.boundary')}>
              <Row>
                <Col md={5} xs={5}>
                  <InboundOrAllCallsOption
                    boundaryScope={boundaryScope}
                    onBoundaryStateChange={() => onUpdateBoundaryScope(boundaryScopes.inbound)}
                    scope={boundaryScopes.inbound}
                  />
                </Col>
                <Col md={5} xs={5}>
                  <InboundOrAllCallsOption
                    boundaryScope={boundaryScope}
                    onBoundaryStateChange={() => onUpdateBoundaryScope(boundaryScopes.all)}
                    scope={boundaryScopes.all}
                  />
                </Col>
              </Row>
            </Section>
          </Sections>
          {sliType === availabilityType && (
            <Sections>
              <Section title={t('in-custom-dashboards:widgets.slo.sliFormPresenter.hiddenCalls')}>
                <Row>
                  <Col md={5} xs={5}>
                    <CheckboxFancy
                      label={t('in-custom-dashboards:widgets.slo.sliFormPresenter.includeInternalCalls')}
                      checked={includeInternal}
                      onChange={() => onUpdateSliEntityField('includeInternal', !includeInternal)}
                    />
                  </Col>
                  <Col md={5} xs={5}>
                    <CheckboxFancy
                      label={t('in-custom-dashboards:widgets.slo.sliFormPresenter.includeSyntheticCalls')}
                      checked={includeSynthetic}
                      onChange={() => onUpdateSliEntityField('includeSynthetic', !includeSynthetic)}
                    />
                  </Col>
                </Row>
              </Section>
            </Sections>
          )}
          {sliType === applicationType && (
            <>
              <Sections>
                <ServicesSelectBox
                  boundaryScope={boundaryScope}
                  applicationId={applicationId}
                  value={serviceId}
                  field={sliEntityForm.get('serviceId')}
                  onChange={value =>
                    onChange(['sliEntity', 'serviceId'], f =>
                      f.setValue(convertEmptyStringToNull(value)).setTouched(true)
                    )
                  }
                />
              </Sections>

              <Sections>
                <EndpointSelectBox
                  apName={apName}
                  boundaryScope={boundaryScope}
                  applicationId={applicationId}
                  serviceId={serviceId}
                  value={endpointId}
                  field={sliEntityForm.get('endpointId')}
                  onChange={value =>
                    onChange(['sliEntity', 'endpointId'], f =>
                      f.setValue(convertEmptyStringToNull(value)).setTouched(true)
                    )
                  }
                />
              </Sections>
            </>
          )}
        </Stack>
      </Stack>

      <MetricsForm form={form} onChange={onChange} />

      <GoodBadEvents applicationName={apName} form={form} />
    </Stack>
  );
}

const convertEmptyStringToNull = value => (value === '' ? null : value);
