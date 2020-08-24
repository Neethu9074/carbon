import React from 'react';

import { SliConfigId } from 'in-custom-dashboards/widgets/Slo/form';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { getSliConfigurations } from 'in-custom-dashboards/api';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Message from 'in-new-components/Message';
import Select from 'in-components/form/Select';
import Header from 'in-components/form/Header';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';

import locals from './SliSelectionForm.mless';

export default connectTo(({ api }) => ({
  sliConfigurations: (api?.getSliConfigurations ?? getSliConfigurations)().map(({ data }) => data)
}))(SliSelectionForm);

function SliSelectionForm({ form, onChange, sliConfigurations, apConfigId, openManageSLIComponent }) {
  const filteredSLIs = sliConfigurations?.filter(sli => sli?.sliEntity?.applicationId === apConfigId) ?? [];
  return (
    <>
      <Row withoutTopMargin>
        <Col md={2}>
          <Header>SLI</Header>
          <Label htmlFor="metric-configurator-sli-id">Service Level Indicator</Label>
        </Col>
        <Col md={10} className={locals.rightAligned}>
          {form.get(SliConfigId)?.map(field => (
            <FormGroup withoutBottomMargin className={locals.form}>
              <Select
                disabled={!apConfigId}
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
            </FormGroup>
          ))}
          <div className={locals.gap} />
          {openManageSLIComponent}
        </Col>
      </Row>
      <Row withoutTopMargin>
        <Col xs={12}>
          <Message small withIcon title="You can set up new SLIs using our API." />
        </Col>
      </Row>
    </>
  );
}
