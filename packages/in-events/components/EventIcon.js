import React from 'react';

import { getIconTypeForEventType, getEventType, getColorForEventAtFocusedMomentAsStream } from 'in-stores/events';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

export default connectTo(
  props => ({
    color: getColorForEventAtFocusedMomentAsStream(props.event, { defaultColor: theme.lib.colors.N700Medium })
  }),
  function Icon({ className, event, color, size }) {
    const iconType = getIconTypeForEventType(getEventType(event), true);
    return (
      <SvgIcon
        style={{
          fill: color
        }}
        className={className}
        type={iconType}
        size={size || 'xxs'}
      />
    );
  }
);
