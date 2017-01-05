import React from 'react';

import {getDashboardLink, getLinkToSnapshotInCurrentView} from 'in-stores/navigation';
import {joinClassNames} from 'in-services/util/classnames';
import {getPhysicalHierarchy} from 'in-stores/snapshot';
import Hierarchy from 'in-components/Link/Hierarchy';
import {alwaysNull} from 'in-services/fixedStreams';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './HierachialLink.less';


const block = 'in-hierachial-link';

export default connectTo(props => {
  const snapshotId = props.snapshotId;
  return {
    href: props.useSnapshotLink ? getLinkToSnapshotInCurrentView(snapshotId) : getDashboardLink(snapshotId),
    hierarchy: (props.calculateHierarchy) ? getPhysicalHierarchy(snapshotId) : alwaysNull
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
    const kind = this.props.kind;

    if (!hierarchy || hierarchy.size === 0) {
      return (
        <a href={href}
           onClick={stopPropagation}
           className={joinClassNames(block, className)}>
          {children}
        </a>
      );
    }

    let expandedIconColor;
    if (kind === 'dark') {
      expandedIconColor = isExpanded ? '#000' : '#92A5AE';
    } else {
      expandedIconColor = isExpanded ? '#fff' : '#92A5AE';
    }

    const linkClassName = `${block}${kind === 'dark' ? '__dark' : '__light'}`;

    return (
      <div className={`${block}__link-wrapper`}>
        <SvgIcon className={`${block}__info-icon`}
                 onClick={this.onClick}
                 type={isExpanded ? 'timeline_close' : 'timeline_open'}
                 width={12}
                 height={12}
                 color={expandedIconColor} />
        {isExpanded ?
          <Hierarchy hierarchy={hierarchy}
                     kind={kind}
                     useSnapshotLink={this.props.useSnapshotLink} />
        : <a href={href}
             onClick={stopPropagation}
             className={joinClassNames(linkClassName, className)}>
          {children}
        </a>
        }
      </div>
    );
  },

  onClick(e) {
    stopPropagation(e);
    this.setState({isExpanded: !this.state.isExpanded});

    if (this.props.onClick) {
      this.props.onClick();
    }
  }
}));

function stopPropagation(e) {
  e.stopPropagation();
}
