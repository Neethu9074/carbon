import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import { getSliConfigurations } from 'in-custom-dashboards/api';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Header from 'in-components/form/Header';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';

export default connectTo(() => {
  return {
    sliConfigurations: getSliConfigurations().map(
      ({ data }) => (data ? data.map(({ id, sliName }) => ({ id, sliName })) : null)
    )
  };
})(FormComponent);

function FormComponent({
  form,
  onChange,
  dataSourceFormGroup,
  labelFormGroup,
  formatterFormGroup,
  widgetPreview,
  timeShiftConfiguration,
  sliConfigurations
}) {
  const sliConfigField = form.get('sliConfig');

  return (
    <>
      {labelFormGroup && (
        <Row>
          <Col lg={6}>{labelFormGroup}</Col>
        </Row>
      )}

      <Row withoutTopMargin>
        <Col lg={6}>{dataSourceFormGroup}</Col>
      </Row>
      <Header>Customize the widget</Header>

      <Row>
        <Col lg>
          <Row>
            <Col lg>
              <FormGroup>
                <Label htmlFor="metic-configurator-sli">Sli Configurations</Label>
                <Select
                  id="metic-configurator-sli"
                  value={sliConfigField.value}
                  onChange={e =>
                    onChange([], form =>
                      form
                        .updateIn(['sliConfig'], field => field.setValue(e.target.value).setTouched(true))
                        .updateIn(['metric'], field => field.setValue('dummy'))
                        .updateIn(['aggregation'], field => field.setValue('dummy'))
                    )
                  }
                  hasError={!sliConfigField.valid && sliConfigField.touched}
                >
                  <option value="">Please select an Sli configuration</option>
                  {sliConfigurations &&
                    sliConfigurations.map(({ id, sliName }) => (
                      <option key={id} value={id}>
                        {sliName}
                      </option>
                    ))}
                </Select>
                <TouchedMessages field={sliConfigField} />
              </FormGroup>
            </Col>
          </Row>

          {formatterFormGroup}
        </Col>

        {widgetPreview && <Col lg>{widgetPreview}</Col>}
      </Row>

      {timeShiftConfiguration}
    </>
  );
}
