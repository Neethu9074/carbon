import React from 'react';

import {joinClassNames} from 'in-services/util/classnames';
import {getDashboardLink} from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

import './DashboardLink.less';


export default connectTo(props => {
  return {
    href: getDashboardLink(props.snapshotId)
  };
}, function DashboardLink({href, children, className, onClick}) {
  return (
    <a href={href}
       onClick={e => {
         if (onClick) {
           onClick();
         }
         e.stopPropagation();
       }}
       className={joinClassNames('in-dashboard-link', className)}>
      {children}
    </a>
  );
});
