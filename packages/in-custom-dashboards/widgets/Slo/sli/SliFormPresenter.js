import React from 'react';

import InboundOrAllCallsOption from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsOption';
import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import { boundaryScopes } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import { sliTypeOptions, applicationType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import ServicesSelectBox from 'in-custom-dashboards/widgets/Slo/sli/ServicesSelectBox';
import EndpointSelectBox from 'in-custom-dashboards/widgets/Slo/sli/EndpointSelectBox';
import { isQB2ModeEnabled } from 'in-new-components/Alerting/components/WithQB1orQB2';
import GoodBadEvents from 'in-custom-dashboards/widgets/Slo/sli/GoodBadEventsForm';
import { MetricsForm } from 'in-custom-dashboards/widgets/Slo/sli/MetricsForm';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import HelpAction from 'in-new-components/workspace/HelpAction';
import Sections from 'in-new-components/workspace/Sections';
import Divider from 'in-new-components/workspace/Divider';
import Section from 'in-new-components/workspace/Section';
import { Row, Col } from 'in-new-components/layout/Grid';
import Header from 'in-new-components/workspace/Header';
import Stack from 'in-new-components/layout/Stack';

export function SliForm({ form, onChange, onChangeType, apName }) {
  const sliEntityForm = form.get('sliEntity');
  const applicationId = sliEntityForm.get('applicationId')?.value;
  const serviceId = sliEntityForm.get('serviceId')?.value;
  const endpointId = sliEntityForm.get('endpointId')?.value;
  const boundaryScope = sliEntityForm.get('boundaryScope')?.value;

  const onUpdateBoundaryScope = value => {
    onChange(['sliEntity', 'boundaryScope'], f => f.setValue(value).setTouched(true));
  };

  const sliTypeForm = sliEntityForm.get('sliType');
  const sliType = sliTypeForm.value;

  return (
    <Stack space="large">
      <Stack space="normal">
        <Header>SLI Customization</Header>

        <Stack space="xsmall">
          <Sections>
            {form.get('sliName').map(field => (
              <InputInSection
                id="new-sli-name"
                label="Name"
                onChange={e => onChange(['sliName'], f => f.setValue(e.target.value).setTouched(true))}
                value={field?.value}
                hasError={!field.valid && field.touched}
                maxLength={256}
                additionalContent={
                  <OverridingTextTouchedMessage field={field} message="The SLI name cannot be empty." />
                }
              />
            ))}
          </Sections>

          <Sections>
            {sliEntityForm.get('sliType').map(field => (
              <SelectInSection
                id="new-sli-type"
                label="Type"
                onChange={e => onChangeType(e.target.value)}
                value={field?.value ?? ''}
                hasError={!field.valid && field.touched}
                actions={
                  <HelpAction href="https://instana.com/docs/service_level_objectives/#sli-configuration/" external>
                    Information about SLI customization and SLI types are located within our docs.
                  </HelpAction>
                }
                additionalContent={
                  <OverridingTextTouchedMessage
                    field={sliTypeForm}
                    message="The SLI type must be either a time-based or an event-based SLI."
                  />
                }
              >
                <option value="">Please select</option>
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

      <Stack space="normal">
        <Header>SLI Entity</Header>

        <Stack space="xsmall">
          {!isQB2ModeEnabled && (
            <Sections>
              <InputInSection id="sli-form-ap" label="Application Perspective" disabled value={apName} />
            </Sections>
          )}

          <Sections>
            <Section title="Boundary">
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

      <GoodBadEvents applicationName={apName} form={form} onChange={onChange} />
    </Stack>
  );
}

const convertEmptyStringToNull = value => (value === '' ? null : value);
