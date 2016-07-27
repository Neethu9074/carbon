import React from 'react';

import {getDashboardLink} from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

import './DashboardLink.less';

export default connectTo(props => {
  return {
    href: getDashboardLink(props.snapshotId)
  };
}, function DashboardLink({href, children}) {
  return (
    <a href={href}
       onClick={stopPropagation}
       className='in-dashboard-link'>
      {children}
    </a>
  );
});

function stopPropagation(e) {
  e.stopPropagation();
}
