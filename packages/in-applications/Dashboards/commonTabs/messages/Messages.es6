import { get } from 'lodash';
import React from 'react';

import CallErrorMessages from 'in-applications/Dashboards/commonTabs/messages/CallErrorMessages';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import LogMessages from 'in-applications/Dashboards/commonTabs/messages/LogMessages';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    applicationName: props.applicationId ? getApplication({ id: props.applicationId }).map(getLabel) : null,
    serviceName: props.serviceId ? getServiceLabel({ id: props.serviceId }).map(getLabel) : null
  }),
  function PerformanceTab(props) {
    return (
      <MaxWidthFullscreenContainer>
        <Card
          title="Call Error Messages"
          header={<ViewMoreButton groupByTagName="call.error.message" {...props} />}
          withoutPadding
        >
          <CallErrorMessages {...props} />
        </Card>
        <Card title="Log Messages" header={<ViewMoreButton groupByTagName="log.message" {...props} />} withoutPadding>
          <LogMessages {...props} />
        </Card>
      </MaxWidthFullscreenContainer>
    );
  }
);

function ViewMoreButton({ groupByTagName, applicationName, serviceName, endpointId: endpointName }) {
  const groupByTag = { name: groupByTagName };

  return (
    <Button
      kind="secondary"
      size="compact"
      href$={getLinkToAnalyze({ applicationName, serviceName, endpointName, groupByTag })}
    >
      View More
    </Button>
  );
}

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
