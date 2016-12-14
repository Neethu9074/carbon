import React from 'react';

import {joinClassNames} from 'in-services/util/classnames';
import {getPhysicalHierarchy} from 'in-stores/snapshot';
import {getDashboardLink} from 'in-stores/navigation';
import Hierarchy from 'in-components/Link/Hierarchy';
import {alwaysNull} from 'in-services/fixedStreams';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './DashboardLink.less';


const block = 'in-dashboard-link';

export default connectTo(props => {
  return {
    href: getDashboardLink(props.snapshotId),
    hierarchy: (props.calculateHierarchy) ? getPhysicalHierarchy(props.snapshotId) : alwaysNull
  };
},
React.createClass({

  displayName: 'DashboardLinkComponent',

  getInitialState() {
    return {
      isExpanded: false
    };
  },

  render() {
    const isExpanded = this.state.isExpanded;
    const hierarchy = this.props.hierarchy;
    const className = this.props.className;
    const children = this.props.children;
    const href = this.props.href;

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
        <SvgIcon className={`${block}__info-icon`}
                 onClick={this.onClick}
                 type={isExpanded ? 'timeline_close' : 'timeline_open'}
                 width={12}
                 height={12}
                 color={isExpanded ? '#000' : '#92A5AE'} />
        {isExpanded ?
          <Hierarchy hierarchy={hierarchy} />
        : <a href={href}
             onClick={stopPropagation}
             className={joinClassNames(block, className)}>
          {children}
        </a>
        }
      </div>
    );
  },

  onClick(e) {
    stopPropagation(e);
    this.setState({isExpanded: !this.state.isExpanded});
  }
}));

function stopPropagation(e) {
  e.stopPropagation();
}
