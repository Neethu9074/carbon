import React from 'react';

import {getTraceViewWithSelectedTrace} from 'in-stores/navigation/traces';
import convertHexToLong from 'in-services/subscription/hexToLong';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './ViewBackendTraceButton.less';

const block = 'in-tracing-page-view-backend-trace';

export default connectTo(props => {
  return {
    link: convertHexToLong(props.traceId)
      .flatMap(getTraceViewWithSelectedTrace)
  };
}, function ViewBackendTraceButton({link}) {
  if (!link) {
    return null;
  }
  return (
    <Button href={link}
            size='sm'
            className={block}>
      View Backend Trace
    </Button>
  );
});
