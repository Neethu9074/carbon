import React from 'react';

import {getHealthInfoAtFocusedMoment} from 'in-stores/events';
import TooltipFrame from 'in-components/Tooltips/Frame';
import EventListing from 'in-components/EventListing';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

import './SidebarHealthInfo.less';

const block = 'in-sidebar-health-info';

export default connectTo(props => {
  return {
    healthInfo: getHealthInfoAtFocusedMoment(props.snapshotId)
  };
}, function SidebarHealthInfo({healthInfo, snapshotId}) {
  const maxSeverity = healthInfo ? healthInfo.get('maxSeverity') : 0;
  const color = maxSeverity > 0 ? theme.health[Math.floor(maxSeverity)] : '#92A5AE';
  const numberOfOpenIssues = healthInfo ? healthInfo.get('numberOfOpenIssues') : 0;

  const counter = (
    <span className={block + '__counter'}
          style={{
            color: maxSeverity < 6 ? '#172429' : '#fff',
            backgroundColor: color
          }}>
      {numberOfOpenIssues}
    </span>
  );

  return (
    <div className={block}>
      Health

      <div className={`${block}__bar`}>
        <div className={`${block}__bar-inner`}
             style={{
               width: `${maxSeverity * 10}%`,
               background: color
             }}/>
        <div className={`${block}__bar-shadow`}/>
      </div>

      {numberOfOpenIssues > 0 ?
        <Tooltip content={
                   <TooltipFrame>
                     <EventListing snapshotId={snapshotId}/>
                   </TooltipFrame>
                 }>
          {counter}
        </Tooltip>
      : counter}
    </div>
  );
});
