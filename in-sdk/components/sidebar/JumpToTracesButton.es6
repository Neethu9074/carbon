import React from 'react';

import {getTraceViewFilteredBySnapshotLink} from 'in-stores/navigation/search';
import {getNumberOfTracesStartingAtService} from 'in-stores/traces';
import {zeroDecimalPlaces} from 'in-services/formatters/number';
import Separator from 'in-sdk/components/sidebar/Separator';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './JumpToTracesButton.less';

const block = 'in-jump-to-traces';

export default connectTo(props => {
  return {
    href: getTraceViewFilteredBySnapshotLink(props.snapshotId)
      .nextFrame(),
    traceCount: getNumberOfTracesStartingAtService(props.snapshotId)
  };
}, function JumpToTracesButton({href, traceCount}) {
  if (traceCount == null || traceCount === 0) {
    return null;
  }

  return (
    <div>
      <Separator />

      <Tooltip content='Jump to traces starting at this service'>
        <Button href={href}
                className={block}
                kind='secondary'>
          Traces ({zeroDecimalPlaces(traceCount)})
        </Button>
      </Tooltip>
    </div>
  );
});
