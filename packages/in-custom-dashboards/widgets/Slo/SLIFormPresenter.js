import React from 'react';

import InboundOrAllCallsOption from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsOption';
import { boundaryScopes } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import ServicesSelectBox from 'in-custom-dashboards/widgets/Slo/components/ServicesSelectBox';
import EndpointSelectBox from 'in-custom-dashboards/widgets/Slo/components/EndpointSelectBox';
import EventBasedForm from 'in-custom-dashboards/widgets/Slo/components/GoodBadEventsForm';
import { MetricsForm } from 'in-custom-dashboards/widgets/Slo/components/MetricsForm';
import DropDownMock from 'in-custom-dashboards/widgets/Slo/components/DropDownMock';
import InputMock from 'in-custom-dashboards/widgets/Slo/components/InputMock';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Stack from 'in-new-components/layout/Stack';
import Header from 'in-components/form/Header';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export function SliForm({ form, onChange, onChangeType, apName, api }) {
  const sliEntityForm = form.get('sliEntity');
  const applicationId = sliEntityForm?.get('applicationId')?.value;
  const serviceId = sliEntityForm?.get('serviceId')?.value;
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
        <Row withoutTopMargin>
          <Col xs={2}>
            <FormGroup>
              <Label>Name</Label>
            </FormGroup>
          </Col>
          <Col xs={3}>
            <FormGroup withoutBottomMargin>
              <InputMock form={form} onChange={onChange} fieldName="sliName" />
            </FormGroup>
          </Col>
        </Row>
        <Row withoutTopMargin>
          <Col xs={2}>
            <FormGroup withoutBottomMargin>
              <Label>Type: {sliType}</Label>
            </FormGroup>
          </Col>
          <Col xs={3}>
            <FormGroup withoutBottomMargin>
              <DropDownMock
                value={sliType}
                onChange={({ target }) => onChangeType(target.value)}
                options={[
                  { value: '', label: 'Please select' },
                  { value: 'application', label: 'Time-based' },
                  { value: 'availability', label: 'Event-based', description: 'e.g. availability' }
                ]}
              />
            </FormGroup>
          </Col>
        </Row>
      </StackItem>
      <StackItem>
        <Header>SLI Entity</Header>
        <Row withoutTopMargin>
          <Col xs={2}>
            <FormGroup>
              <Label>Application Perspective</Label>
            </FormGroup>
          </Col>
          <Col xs={3}>
            <FormGroup withoutBottomMargin>
              <Input disabled value={apName} />
            </FormGroup>
          </Col>
        </Row>
        <Row withoutTopMargin>
          <Col xs={2}>
            <FormGroup>
              <Label>Boundary</Label>
            </FormGroup>
          </Col>
          <Col xs={4} md={5}>
            <InboundOrAllCallsOption
              boundaryScope={boundaryScope}
              onBoundaryStateChange={() => onUpdateBoundaryScope(boundaryScopes.inbound)}
              scope={boundaryScopes.inbound}
            />
          </Col>
          <Col xs={4} md={5}>
            <InboundOrAllCallsOption
              boundaryScope={boundaryScope}
              onBoundaryStateChange={() => onUpdateBoundaryScope(boundaryScopes.all)}
              scope={boundaryScopes.all}
            />
          </Col>
        </Row>
        <Row withoutTopMargin>
          <Col xs={2}>
            <FormGroup>
              <Label>Service</Label>
            </FormGroup>
          </Col>
          <Col xs={3}>
            <FormGroup withoutBottomMargin>
              <ServicesSelectBox api={api} boundaryScope={boundaryScope} applicationId={applicationId} />
            </FormGroup>
          </Col>
        </Row>
        <Row withoutTopMargin>
          <Col xs={2}>
            <FormGroup>
              <Label>Endpoints</Label>
            </FormGroup>
          </Col>
          <Col xs={3}>
            <FormGroup withoutBottomMargin>
              <EndpointSelectBox
                apName={apName}
                boundaryScope={boundaryScope}
                applicationId={applicationId}
                serviceId={serviceId}
              />
            </FormGroup>
          </Col>
        </Row>
      </StackItem>
      <MetricsForm form={form} onChange={onChange} />
      {sliType === 'availability' && <EventBasedForm form={form} onChange={onChange} />}
    </Stack>
  );
}
