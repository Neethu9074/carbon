import React from 'react';

import SliFormComponent from 'in-custom-dashboards/widgets/Slo/SliFormComponent';
import { SloTarget } from 'in-custom-dashboards/widgets/Slo/form';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import { Row, Col } from 'in-new-components/layout/Grid';
import Header from 'in-components/form/Header/Header';
import FormGroup from 'in-components/form/FormGroup';
import Stack from 'in-new-components/layout/Stack';
import Select from 'in-components/form/Select';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Button from 'in-components/Button';
import SvgIcon from 'in-components/SvgIcon';

export default function FormComponent({ form, onChange, widgetTitleFormGroup, setSlideInView, widgetPreview }) {
  return (
    <>
      <Stack space="large">
        <StackItem>
          <Header>Customize the Widget</Header>
          {widgetTitleFormGroup}
        </StackItem>

        <StackItem>
          <Header>SLO Configuration</Header>
          {
            // <ApplicationSelection form={form} onChange={onChange} />
          }
        </StackItem>
        <StackItem>
          <SliFormComponent
            form={form}
            onChange={onChange}
            widgetPreview={false}
            widgetTitleFormGroup={widgetTitleFormGroup}
            openManageSLIComponent={
              <Button
                kind={'primary'}
                onClick={() =>
                  setSlideInView({
                    title: 'Sli Management',
                    getContent({ slideOut }) {
                      return (
                        <>
                          <p>More to come</p>
                          <Button kind={'primary'} onClick={slideOut}>
                            Cancel
                          </Button>
                        </>
                      );
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
                      f.setValue(target.value == '' ? '' : target.value / 100).setTouched(true)
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
        <StackItem>{widgetPreview}</StackItem>
      </Stack>
    </>
  );
}

const DropDownMock = ({ options }) => (
  <Select>
    {(options ?? []).map(({ id, label }) => (
      <option key={id} value={id}>
        {label}
      </option>
    ))}
  </Select>
);

const InputMock = ({ value, type, ...props }) => <Input type={type} value={value} {...props} />;
