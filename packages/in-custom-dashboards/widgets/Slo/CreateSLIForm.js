import React, { useState } from 'react';

import InboundOrAllCallsOption from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsOption';
import { boundaryScopes } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import ServicesSelectBox from 'in-custom-dashboards/widgets/Slo/components/ServicesSelectBox';
import EndpointSelectBox from 'in-custom-dashboards/widgets/Slo/components/EndpointSelectBox';
import EventBasedForm from 'in-custom-dashboards/widgets/Slo/components/GoodBadEventsForm';
import { MetricsForm } from 'in-custom-dashboards/widgets/Slo/components/MetricsForm';
import DropDownMock from 'in-custom-dashboards/widgets/Slo/components/DropDownMock';
import InputMock from 'in-custom-dashboards/widgets/Slo/components/InputMock';
import { DebugInfo } from 'in-custom-dashboards/widgets/Slo/DebugInfo';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import { Row, Col } from 'in-new-components/layout/Grid';
import { createMapForm, createField } from 'formalistic';
import FormGroup from 'in-components/form/FormGroup';
import Stack from 'in-new-components/layout/Stack';
import Header from 'in-components/form/Header';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

function createSliTypeForm(sliEntity) {
  let sliEntityForm = createMapForm()
    .put(
      'sliType',
      createField({
        value: sliEntity.sliType ?? null
      })
    )
    .put(
      'applicationId',
      createField({
        value: sliEntity.applicationId
      })
    )
    .put(
      'serviceId',
      createField({
        value: sliEntity.serviceId ?? null
      })
    )
    .put(
      'endpointId',
      createField({
        value: sliEntity.endpointId ?? null
      })
    )
    .put(
      'boundaryScope',
      createField({
        value: sliEntity.boundaryScope ?? null
      })
    )
    .put(
      'goodEventFilters',
      createField({
        value: [
          {
            name: 'call.http.status',
            stringValue: '2',
            numberValue: null,
            booleanValue: null,
            operator: 'STARTS_WITH',
            entity: 'NOT_APPLICABLE'
          }
        ]
      })
    )
    .put(
      'badEventFilters',
      createField({
        value: [
          {
            name: 'call.http.status',
            stringValue: '2',
            numberValue: null,
            booleanValue: null,
            operator: 'STARTS_WITH',
            entity: 'NOT_APPLICABLE'
          }
        ]
      })
    );
  return sliEntityForm;
}

function createForm(savedState, applicationId) {
  const sliConfig = savedState;

  let form = createMapForm();
  form = form.put(
    'sliName',
    createField({
      value: savedState['sliName'] ?? ''
    })
  );

  const sliEntity = { ...savedState?.sliEntity, applicationId: applicationId };
  if (sliEntity) {
    form = form.put('sliEntity', createSliTypeForm(sliEntity));
  }
  if (sliConfig.metricConfiguration) {
    form = form.put('metricConfiguration', createMetricsForm(savedState.metricConfiguration));
  }

  const { sliType } = sliEntity ?? {};
  if (sliType === 'application') {
    form = form.put('metricConfiguration', createMetricsForm(sliConfig.metricConfiguration ?? {}));
  }
  return form;
}

function resetFormForSliType(sliType, setForm, form, sliConfig) {
  if (sliType === 'application') {
    setForm(
      form
        .put('metricConfiguration', createMetricsForm(sliConfig.metricConfiguration ?? {}))
        .updateIn(['sliEntity'], f => f.remove('goodEventFilters'))
        .updateIn(['sliEntity'], f => f.remove('badEventFilters'))
    );
  } else {
    setForm(form.remove('metricConfiguration'));
  }
}

function renderForm(form, onChange, onChangeType, apName, sliConfig, api) {
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
              <ServicesSelectBox api={api} boundaryScope={boundaryScope ?? null} applicationId={applicationId} />
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

export default function CreateNewSLIForm({
  api,
  apName,
  applicationId,
  close,
  sliConfig
}) {
  const [form, setForm] = useState(createForm(sliConfig ?? {}, applicationId));

  const [state, setState] = useState({
    success: false,
    saving: false,
    error: false
  });
  const { saving, error, success } = state;


  const onChange = (path, fn) => {
    console.log('updating ... on path', path, fn);
    setForm(form.updateIn(path, fn));
  };
  const onChangeType = sliType => {
    let updatedForm = form.updateIn(['sliEntity', 'sliType'], f => f.setValue(sliType).setTouched(true));
    resetFormForSliType(sliType, setForm, updatedForm, sliConfig);
  };

  const onSubmit = (e, form) => {
    e.preventDefault();

    if (!form.hierarchyValid) {
      updateForm(form.setTouched(true, { recurse: true }));
      return;
    }

    const entityToUpdate = form.toJS();

    setState({
      saving: true,
      success: false,
      error: false
    });
  };

  const savingStateName = 'Saving…';
  const saveButtonLabel = 'Save';

  return (
    <form onSubmit={e => onSubmit(e, form, setForm)}>
      {renderForm(form, onChange, onChangeType, apName, sliConfig, api)}

      <div>
        <Button kind="subtle" size="compact" onClick={close}>
          cancel
        </Button>
        {form && ( // && form.touched
          <Button
            icon={saving ? 'lib_actions_loading' : null}
            iconSpinning
            kind="create"
            type="submit"
            disabled={(!form.hierarchyValid && form.touched) || saving}
          >
            {saving ? savingStateName : saveButtonLabel}
          </Button>
        )}
      </div>
    </form>
  );
}

export function createMetricsForm(metricConfiguration) {
  return createMapForm()
    .put(
      'metricName',
      createField({
        value: metricConfiguration.metricName ?? 'unknoWNmatrix'
      })
    )
    .put(
      'metricAggregation',
      createField({
        value: metricConfiguration.metricAggregation ?? 'P97'
      })
    )
    .put(
      'threshold',
      createField({
        value: metricConfiguration.threshold ?? 111
      })
    );
}
