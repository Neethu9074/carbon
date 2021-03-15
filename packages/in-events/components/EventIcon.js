/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getIcon, getColorForEventAtFocusedMomentAsStream } from 'in-stores/events';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

export default connectTo(
  props => {
    if (props.disableColorCalculation) {
      return {};
    }
    return {
      color: getColorForEventAtFocusedMomentAsStream(props.event, { defaultColor: theme.lib.colors.N700Medium })
    };
  },
  function Icon({ className, event, color, size }) {
    return (
      <SvgIcon
        style={{
          fill: color || '#40535b'
        }}
        className={className}
        type={getIcon({ event })}
        size={size || 's'}
      />
    );
  }
);
