import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import * as wiring from 'in-services/wiring';
import {alwaysEmptyArray} from 'in-services/fixedStreams';

import enhance from '../hoc/enhance';
import Crumb from './Crumb';

import './SnapshotHierarchyBreadcrumb.less';

const rpt = React.PropTypes;
const block = 'in-snapshot-hierarchy-breadcrumb';

const SnapshotHierarchyBreadcrumb = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshot: irpt.map,
    hierarchy: rpt.array
  },

  statics: {
    createObservables(props) {
      let hierarchy;
      if (!props.snapshot) {
        hierarchy = alwaysEmptyArray;
      } else {
        hierarchy = wiring.getAllStepsBetweenNodeAndLeaf(props.snapshot);
      }
      return {hierarchy};
    }
  },

  render() {
    const hierarchy = this.props.hierarchy;
    if (!hierarchy) {
      return null;
    }

    // if the root element is the host
    if (hierarchy.length === 0) {
      hierarchy.push(this.props.snapshot);
    }

    return (
      <ul className={block}>
        {hierarchy.reverse().map(child =>
          <Crumb key={child.get('id')}
                 coordinates={child}
                 selectedSnapshot={this.props.snapshot}/>
        )}
      </ul>
    );
  }
});

export default enhance(SnapshotHierarchyBreadcrumb);
