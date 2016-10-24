import React from 'react';

import {getHealthInfoAtFocusedMoment} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

import './HealthBar.less';


const block = 'in-health-bar';

export default connectTo(props => {
  return {
    healthInfo: getHealthInfoAtFocusedMoment(props.snapshotId)
  };
}, function HealthBar({healthInfo, className}) {
  if (!healthInfo) {
    return null;
  }

  const maxSeverity = healthInfo.get('maxSeverity');

  const style = {
    width: maxSeverity * 10 + '%',
    backgroundColor: theme.health[Math.floor(maxSeverity)]
  };

  let classes = block;
  if (className) {
    classes += ' ' + className;
  }

  return (
    <div className={classes}>
      <div className={block + '__inner'}
           style={style}>
      </div>
    </div>
  );
});
