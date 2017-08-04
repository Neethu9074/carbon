import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Separator from 'in-sdk/components/sidebar/Separator';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './CountBasedJumpToButton.less';

const block = 'in-count-based-jump-to-button';

export default connectTo(
  props => {
    const result = {};

    if (props.href$) {
      result.href = props.href$;
    }

    if (props.count$) {
      result.count = props.count$;
    }

    return result;
  },
  function CountBasedJumpToButton({ href, count, title, tooltip }) {
    // Count may be -1 when the span keyword is used as calculation of counts
    // may be too expensive.
    if (count == null || count === 0) {
      return null;
    }

    return (
      <div>
        <Separator />

        <Tooltip content={tooltip}>
          <Button href={href} className={block} kind="secondary" size="sm">
            {title}
            {count > 0 ? <br /> : null}
            {count > 0 ? `(${zeroDecimalPlaces(count)})` : null}
          </Button>
        </Tooltip>
      </div>
    );
  }
);
