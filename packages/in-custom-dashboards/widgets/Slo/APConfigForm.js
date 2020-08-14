import React from 'react';

import { getApplicationConfigsAsResultObservable } from 'in-api/applicationConfigs';
import { SliApConfigId, SloApName } from 'in-custom-dashboards/widgets/Slo/form';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { compareIgnoreCase } from 'in-services/util/string';
import { Row, Col } from 'in-new-components/layout/Grid';
import KeyValue from 'in-new-components/lists/KeyValue';
import FormGroup from 'in-components/form/FormGroup';
import Message from 'in-new-components/Message';
import Select from 'in-components/form/Select';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ api }) => ({
  apConfigs: (api?.getApplicationConfigsAsResultObservable ?? getApplicationConfigsAsResultObservable)().map(
    ({ data }) => data
  )
}))(APConfigForm);

function APConfigForm({ form, onChange, apConfigs }) {
  const sliApConfigIdField = form.get(SliApConfigId);
  return (
    <div>
      <Row withoutTopMargin>
        <Col md={2}>
          <KeyValue label="User Journey / Offering" value="Application Perspective" inverted />
        </Col>
        <Col xs>
          {sliApConfigIdField.map(field => (
            <FormGroup>
              <Select
                id="sli-config-ap"
                value={field?.value}
                onChange={e => {
                  const apId = e.target.value;
                  const apName = apConfigs?.find(ap => ap.id == apId).label ?? '';
                  onChange([SliApConfigId], f => f.setValue(apId).setTouched(true));
                  onChange([SloApName], f => f.setValue(apName).setTouched(true));
                }}
                hasError={!field.valid && field.touched}
              >
                {(apConfigs?.length ?? 0) === 0 && <option value="">No Application Perspectives!</option>}
                {apConfigs?.length > 0 && <option value="">Please select</option>}
                {[...(apConfigs ?? [])] // need to clone: readonly array may not be sorted
                  .sort((a, b) => compareIgnoreCase(a.label, b.label))
                  .map(({ label, id }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
              </Select>
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>
        <Col xs={12}>
          <Message
            withIcon
            title="Set up user journeys / offerings by modeling them as an Application Perspective in the Applications area of
          the product."
          />
        </Col>
      </Row>
    </div>
  );
}
