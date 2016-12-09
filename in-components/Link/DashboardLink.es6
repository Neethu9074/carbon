import React from 'react';

import ExpandHierarchyIcon from 'in-components/Link/ExpandHierarchyIcon';
import {joinClassNames} from 'in-services/util/classnames';
import {getPhysicalHierarchy} from 'in-stores/snapshot';
import {getDashboardLink} from 'in-stores/navigation';
import {alwaysNull} from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';

import './DashboardLink.less';


const block = 'in-dashboard-link';

export default connectTo(props => {
  return {
    href: getDashboardLink(props.snapshotId),
    hierarchy: props.calculateHierarchy ? getPhysicalHierarchy(props.snapshotId) : alwaysNull
  };
},
function DashboardLinkComponent({href, children, className, hierarchy}) {
  if (!hierarchy || hierarchy.size === 0) {
    return (
      <a href={href}
         onClick={stopPropagation}
         className={joinClassNames(block, className)}>
        {children}
      </a>
    );
  }

  return (
    <div className={`${block}__link-wrapper`}>
      <ExpandHierarchyIcon hierarchy={hierarchy} />
      <a href={href}
         onClick={stopPropagation}
         className={joinClassNames(block, className)}>
        {children}
      </a>
    </div>
  );
});


function stopPropagation(e) {
  e.stopPropagation();
}
