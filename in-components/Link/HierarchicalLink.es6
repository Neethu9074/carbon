import React from 'react';

import {getDashboardLink, getLinkToSnapshotInCurrentView} from 'in-stores/navigation';
import {joinClassNames} from 'in-services/util/classnames';
import {getPhysicalHierarchy} from 'in-stores/snapshot';
import Hierarchy from 'in-components/Link/Hierarchy';
import {alwaysNull} from 'in-services/fixedStreams';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './HierarchicalLink.less';


const block = 'in-hierarchical-link';

export default connectTo(props => {
  const snapshotId = props.snapshotId;
  return {
    href: props.useSnapshotLink ? getLinkToSnapshotInCurrentView(snapshotId) : getDashboardLink(snapshotId),
    hierarchy: (props.calculateHierarchy) ? getPhysicalHierarchy(snapshotId) : alwaysNull
  };
},
React.createClass({

  displayName: 'HierarchicalLink',

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
    const linkClassName = `${block}${kind === 'dark' ? '__dark' : '__light'}`;

    if (!hierarchy || hierarchy.size === 0) {
      return (
        <a href={href}
           onClick={stopPropagation}
           className={joinClassNames(linkClassName, className)}>
          {children}
        </a>
      );
    }

    return (
      <div className={`${block}__link-wrapper`}>
        <SvgIcon className={`${block}__info-icon ${block}__info-icon--${kind}`}
                 onClick={this.onClick}
                 type={isExpanded ? 'timeline_close' : 'timeline_open'}
                 width={12}
                 height={12} />
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
