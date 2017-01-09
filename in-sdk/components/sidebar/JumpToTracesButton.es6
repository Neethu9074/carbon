import React from 'react';

import {zeroDecimalPlaces} from 'in-services/formatters/number';
import Separator from 'in-sdk/components/sidebar/Separator';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';

import './JumpToTracesButton.less';

const block = 'in-jump-to-traces';

export default function JumpToTracesButton({href, traceCount, title='Traces', tooltip='Jump to traces starting at this service'}) {
  if (traceCount == null || traceCount === 0) {
    return null;
  }

  return (
    <div>
      <Separator />

      <Tooltip content={tooltip}>
        <Button href={href}
                className={block}
                kind='secondary'>
          {title} ({zeroDecimalPlaces(traceCount)})
        </Button>
      </Tooltip>
    </div>
  );
}
