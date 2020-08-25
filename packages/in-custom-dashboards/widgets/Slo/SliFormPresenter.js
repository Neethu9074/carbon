import React from 'react';

import InboundOrAllCallsOption from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsOption';
import { AvailabilityType, sliTypeOptions, ApplicationType } from 'in-custom-dashboards/widgets/Slo/form/sliForm';
import { boundaryScopes } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import ServicesSelectBox from 'in-custom-dashboards/widgets/Slo/components/ServicesSelectBox';
import EndpointSelectBox from 'in-custom-dashboards/widgets/Slo/components/EndpointSelectBox';
import EventBasedForm from 'in-custom-dashboards/widgets/Slo/components/GoodBadEventsForm';
import { MetricsForm } from 'in-custom-dashboards/widgets/Slo/components/MetricsForm';
import DropDownMock from 'in-custom-dashboards/widgets/Slo/components/DropDownMock';
import InputMock from 'in-custom-dashboards/widgets/Slo/components/InputMock';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { Row, Col } from 'in-new-components/layout/Grid';
import KeyValue from 'in-new-components/lists/KeyValue';
import FormGroup from 'in-components/form/FormGroup';
import Stack from 'in-new-components/layout/Stack';
import Header from 'in-components/form/Header';
import Input from 'in-components/form/Input';

import locals from './SliForm.mless';

export function SliForm({ form, onChange, onChangeType, apName, api }) {
  const sliEntityForm = form.get('sliEntity');
  const applicationId = sliEntityForm?.get('applicationId')?.value;
  const serviceId = sliEntityForm?.get('serviceId')?.value;
  const endpointId = sliEntityForm?.get('endpointId')?.value;
  const boundaryScope = sliEntityForm?.get('boundaryScope')?.value;

  const onUpdateBoundaryScope = value => {
    onChange(['sliEntity', 'boundaryScope'], f => f.setValue(value).setTouched(true));
  };

  const sliType = sliEntityForm.get('sliType').value;

  return (
    <Stack space="medium">
      <StackItem>
        <Header>SLI Customization</Header>
      </StackItem>
      <StackItem>
        <Row>
          <Col md={2}>
            <FormGroup withoutBottomMargin>
              <KeyValue value="Name" inverted className={locals.oneLineLabel} />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup withoutBottomMargin>
              <InputMock form={form} onChange={onChange} fieldName="sliName" />
            </FormGroup>
          </Col>
          <Col mdOffset={2} md={10}>
            <TouchedMessages field={form.get('sliName')} />
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <FormGroup withoutBottomMargin>
              <KeyValue value="Type" inverted className={locals.oneLineLabel} />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup withoutBottomMargin>
              <DropDownMock
                value={sliType}
                hasError={!sliEntityForm.get('sliType')?.valid && sliEntityForm.get('sliType')?.touched}
                onChange={({ target }) => onChangeType(target.value)}
                options={[{ value: '', label: 'Please select' }, ...sliTypeOptions]}
              />
            </FormGroup>
          </Col>
          <Col mdOffset={2} md={10}>
            <TouchedMessages field={sliEntityForm.get('sliType')} />
          </Col>
        </Row>
      </StackItem>
      <StackItem>
        <Header>SLI Entity</Header>
      </StackItem>
      <StackItem>
        <Row>
          <Col md={2}>
            <FormGroup>
              <KeyValue value="Application Perspective" inverted className={locals.oneLineLabel} />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup withoutBottomMargin>
              <Input disabled value={apName} className={locals.applicationName} />
            </FormGroup>
          </Col>
        </Row>
        <Row withoutTopMargin>
          <Col md={2}>
            <FormGroup>
              <KeyValue value="Boundary" inverted className={locals.boundaryLabel} />
            </FormGroup>
          </Col>
          <Col md={4} xs={5}>
            <InboundOrAllCallsOption
              boundaryScope={boundaryScope}
              onBoundaryStateChange={() => onUpdateBoundaryScope(boundaryScopes.inbound)}
              scope={boundaryScopes.inbound}
            />
          </Col>
          <Col md={4} xs={5}>
            <InboundOrAllCallsOption
              boundaryScope={boundaryScope}
              onBoundaryStateChange={() => onUpdateBoundaryScope(boundaryScopes.all)}
              scope={boundaryScopes.all}
            />
          </Col>
        </Row>
        {sliType === ApplicationType && (
          <Row>
            <Col md={2}>
              <FormGroup withoutBottomMargin>
                <KeyValue value="Service" inverted className={locals.oneLineLabel} />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup withoutBottomMargin>
                <ServicesSelectBox
                  api={api}
                  boundaryScope={boundaryScope}
                  applicationId={applicationId}
                  value={serviceId}
                  onChange={value =>
                    onChange(['sliEntity', 'serviceId'], f =>
                      f.setValue(convertEmptyStringToNull(value)).setTouched(true)
                    )
                  }
                />
              </FormGroup>
            </Col>
          </Row>
        )}
        {sliType === ApplicationType && (
          <Row>
            <Col md={2}>
              <FormGroup>
                <KeyValue value="Endpoints" inverted className={locals.oneLineLabel} />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup withoutBottomMargin>
                <EndpointSelectBox
                  apName={apName}
                  boundaryScope={boundaryScope}
                  applicationId={applicationId}
                  serviceId={serviceId}
                  value={endpointId}
                  onChange={value =>
                    onChange(['sliEntity', 'endpointId'], f =>
                      f.setValue(convertEmptyStringToNull(value)).setTouched(true)
                    )
                  }
                />
              </FormGroup>
            </Col>
          </Row>
        )}
      </StackItem>
      <MetricsForm form={form} onChange={onChange} />
      {sliType === AvailabilityType && <EventBasedForm applicationName={apName} form={form} onChange={onChange} />}
    </Stack>
  );
}

const convertEmptyStringToNull = value => (value === '' ? null : value);
