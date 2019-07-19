import React from 'react';

import theme from 'in-themes';

import locals from './LogIndicator.mless';

export default function LogIndicator({ inTimeline, left, parentCall, top, onCallClicked, log = false }) {
  return (
    <div
      style={{
        left: `calc(${left}% - 10px`,
        top: `calc(${top}px - 7.5px)`,
        borderColor: `${log.errorCount ? theme.lib.colors.failure : theme.lib.colors.warning} transparent transparent`
      }}
      className={inTimeline ? locals.logIndicatorTimeline : locals.logIndicator}
      onClick={onCallClicked != null ? () => onCallClicked(parentCall) : null}
    />
  );
}
