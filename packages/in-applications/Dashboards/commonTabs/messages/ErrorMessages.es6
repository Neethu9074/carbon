import { get } from 'lodash';
import React from 'react';

import AnalyzeMessagesButton from 'in-applications/Dashboards/commonTabs/messages/components/AnalyzeMessagesButton';
import ErrorMessagesTable from 'in-applications/Dashboards/commonTabs/messages/components/ErrorMessagesTable';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    applicationName: props.applicationId ? getApplication({ id: props.applicationId }).map(getLabel) : null,
    serviceName: props.serviceId ? getServiceLabel({ id: props.serviceId }).map(getLabel) : null
  }),
  function ErrorMessages(props) {
    return (
      <MaxWidthFullscreenContainer>
        <Card
          title="Error Messages"
          header={<AnalyzeMessagesButton groupByTagName="call.error.message" {...props} />}
          withoutPadding
        >
          <ErrorMessagesTable {...props} />
        </Card>
      </MaxWidthFullscreenContainer>
    );
  }
);

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
