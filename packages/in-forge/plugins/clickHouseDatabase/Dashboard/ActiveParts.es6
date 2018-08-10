import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getRawPayload } from 'in-stores/snapshot';
import { isBlank } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

export default connectTo(
  props => {
    return {
      activeParts: getRawPayload(props.snapshot.get('id'), 'activeParts')
    };
  },
  function ProcessTopList({ activeParts }) {
    if (isBlank(activeParts)) {
      return null;
    }

    return (
      <DashboardSection title="Tables With Most Active Parts">
        <Code code={activeParts} showLineNumbers={false} />
      </DashboardSection>
    );
  }
);
