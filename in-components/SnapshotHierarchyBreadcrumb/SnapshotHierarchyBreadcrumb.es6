import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import getPhysicalHierarchy from 'in-hoc/getPhysicalHierarchy';

import Crumb from './Crumb';

import './SnapshotHierarchyBreadcrumb.less';


const block = 'in-snapshot-hierarchy-breadcrumb';

export default getPhysicalHierarchy(
               React.createClass({

  displayName: 'SnapshotHierarchyBreadcrumb',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: React.PropTypes.string.isRequired,
    physicalHierarchy: irpt.list
  },

  render() {
    if (!this.props.physicalHierarchy) {
      return null;
    }
    const hierarchy = this.props.physicalHierarchy.toJS();

    // If there is no hierarchy, we should at least have the selected element in the list.
    if (hierarchy.length === 0) {
      hierarchy.push(this.props.snapshotId);
    }

    return (
      <ul className={block}>
        {hierarchy.reverse().map(child =>
          <Crumb key={child}
                 snapshotId={child}
                 selectedSnapshotId={this.props.snapshotId}/>
        )}
      </ul>
    );
  }
}));
