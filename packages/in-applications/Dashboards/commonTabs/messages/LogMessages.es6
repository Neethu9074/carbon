import { get } from 'lodash';
import React from 'react';

import LogMessagesTable from 'in-applications/Dashboards/commonTabs/messages/components/LogMessagesTable';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    applicationName: props.applicationId ? getApplication({ id: props.applicationId }).map(getLabel) : null,
    serviceName: props.serviceId ? getServiceLabel({ id: props.serviceId }).map(getLabel) : null
  }),
  function LogMessages(props) {
    return <LogMessagesTable {...props} />;
  }
);

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
