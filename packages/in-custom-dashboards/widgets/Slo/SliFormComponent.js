import React from 'react';

import { SliConfigId } from 'in-custom-dashboards/widgets/Slo/form';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { getSliConfigurations } from 'in-custom-dashboards/api';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Select from 'in-components/form/Select';
import Header from 'in-components/form/Header';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ api }) => ({
  sliConfigurations: (api?.getSliConfigurations ?? getSliConfigurations)().map(({ data }) => data)
}))(SliFormComponent);

function SliFormComponent({ form, onChange, sliConfigurations, apConfigId, openManageSLIComponent }) {
  const filteredSLIs = sliConfigurations?.filter(sli => sli?.sliEntity?.applicationId === apConfigId) ?? [];
  return (
    <Row withoutTopMargin>
      <Col md={2}>
        <Header>SLI</Header>
        <Label htmlFor="metric-configurator-sli-id">Service Level Indicator</Label>
      </Col>
      <Col xs>
        {form.get(SliConfigId)?.map(field => (
          <FormGroup>
            <Select
              disabled={!apConfigId}
              id="metric-configurator-sli-id"
              value={field?.value}
              onChange={e =>
                onChange([], form =>
                  form.updateIn([SliConfigId], field => field.setValue(e.target.value).setTouched(true))
                )
              }
              hasError={!field.valid && field.touched}
            >
              {filteredSLIs.length === 0 && <option value="">None available, please create one.</option>}
              {filteredSLIs.length !== 0 && <option value="">Please select</option>}
              {filteredSLIs.map(({ id, sliName }) => (
                <option key={id} value={id}>
                  {sliName}
                </option>
              ))}
            </Select>
            <TouchedMessages field={field} />
            <HelpText>You can set up new SLIs using our API.</HelpText>
          </FormGroup>
        ))}
      </Col>
      <Col md={2}>{openManageSLIComponent}</Col>
    </Row>
  );
}
