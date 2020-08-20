import React from 'react';

import { SloTarget, SliApConfigId, SloApName, SliConfigId } from 'in-custom-dashboards/widgets/Slo/form';
import SliFormComponent from 'in-custom-dashboards/widgets/Slo/components/SliSelectionForm';
import APConfigSelector from 'in-custom-dashboards/widgets/Slo/components/APConfigForm';
import DropDownMock from 'in-custom-dashboards/widgets/Slo/components/DropDownMock';
import InputMock from 'in-custom-dashboards/widgets/Slo/components/InputMock';
import SliManageList from 'in-custom-dashboards/widgets/Slo/SliManageList';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import { Row, Col } from 'in-new-components/layout/Grid';
import Header from 'in-components/form/Header/Header';
import FormGroup from 'in-components/form/FormGroup';
import Stack from 'in-new-components/layout/Stack';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';

export default function FormComponent({ form, onChange, widgetTitleFormGroup, setSlideInView, widgetPreview, api }) {
  const apConfigId = form.get(SliApConfigId)?.value;
  const sliConfigId = form.get(SliConfigId)?.value;
  return (
    <>
      <Stack space="large">
        <StackItem>
          <Header>Customize the Widget</Header>
          {widgetTitleFormGroup}
        </StackItem>

        <StackItem>
          <Header>SLO Configuration</Header>
          <APConfigSelector form={form} onChange={onChange} api={api} />
        </StackItem>
        <StackItem>
          <SliFormComponent
            form={form}
            apConfigId={apConfigId}
            onChange={onChange}
            api={api}
            widgetPreview={false}
            widgetTitleFormGroup={widgetTitleFormGroup}
            openManageSLIComponent={
              <Button
                disabled={!apConfigId}
                kind={'primary'}
                onClick={() =>
                  setSlideInView({
                    title: 'Sli Management',
                    getContent() {
                      return <SliManageList applicationId={apConfigId} apName={form.get(SloApName)?.value} api={api} />;
                    }
                  })
                }
              >
                Manage SLIs
              </Button>
            }
          />
        </StackItem>
        <StackItem>
          <Row>
            <Col md={2}>
              <FormGroup>
                <Label>SLO Target, e.g. 99%</Label>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Input
                  type="number"
                  value={form.get(SloTarget).value * 100}
                  onChange={({ target }) => {
                    onChange([SloTarget], f =>
                      f.setValue(target.value === '' ? '' : target.value / 100).setTouched(true)
                    );
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
        </StackItem>
        <StackItem>
          <Row>
            <Col md={2}>
              <FormGroup>
                <Label>TimeWindow Type</Label>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <DropDownMock options={[{ value: 'dynamic', label: 'Dynamic time window' }]} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <FormGroup>
                <Label>TimeWindow Size</Label>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <InputMock value={'1'} type={'number'} disabled />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <DropDownMock options={[{ value: 'm', label: 'month' }]} disabled />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <FormGroup>
                <Label>TimeWindow Start</Label>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row'
                  }}
                >
                  <InputMock value={'2020-01-01'} disabled />
                  <SvgIcon type="lib_datetime_date" />
                </div>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row'
                  }}
                >
                  <InputMock value={'00:00:00'} disabled />
                  <SvgIcon type="lib_datetime_time" />
                </div>
              </FormGroup>
            </Col>
          </Row>
        </StackItem>
        {false && (
          <StackItem>
            ap-id: {apConfigId}
            sli: {sliConfigId}
          </StackItem>
        )}
        <StackItem>{widgetPreview}</StackItem>
      </Stack>
    </>
  );
}
