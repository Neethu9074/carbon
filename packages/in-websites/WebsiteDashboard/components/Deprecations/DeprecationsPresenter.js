import React, { Fragment } from 'react';

import CrossRegionForwarding from 'in-websites/WebsiteDashboard/components/Deprecations/deprecations/CrossRegionForwarding';
import CustomPages from 'in-websites/WebsiteDashboard/components/Deprecations/deprecations/CustomPages';
import { Row, Col } from 'in-new-components/layout/Grid';

const presenterMapping = {
  xrf: CrossRegionForwarding,
  eh: CustomPages
};

export default function DeprecationsPresenter(props) {
  const { result } = props;
  if (!result || !result.data) {
    return null;
  }

  return (
    <Fragment>
      {result.data
        .filter(code => presenterMapping[code])
        .sort()
        .map(code => {
          const Component = presenterMapping[code];
          return (
            <Row key={code}>
              <Col lg={12} key={code}>
                <Component {...props} />
              </Col>
            </Row>
          );
        })}
    </Fragment>
  );
}
