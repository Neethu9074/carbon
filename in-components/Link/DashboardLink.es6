import React from 'react';

import {joinClassNames} from 'in-services/util/classnames';
import {getDashboardLink} from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

import './DashboardLink.less';

export default connectTo(props => {
  return {
    href: getDashboardLink(props.snapshotId)
  };
}, function DashboardLink({href, children, className}) {
  return (
    <a href={href}
       onClick={stopPropagation}
       className={joinClassNames('in-dashboard-link', className)}>
      {children}
    </a>
  );
});

function stopPropagation(e) {
  e.stopPropagation();
}
