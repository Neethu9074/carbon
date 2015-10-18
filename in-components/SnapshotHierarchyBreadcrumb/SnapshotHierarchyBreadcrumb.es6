import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import * as wiring from 'in-services/wiring';
import * as views from 'in-services/views';
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
    selectedSnapshot: irpt.map.isRequired,
    hierarchy: rpt.array
  },

  statics: {
    createObservables() {
      return {
        selectedSnapshot: selectedSnapshotStore.selectedSnapshot,
        hierarchy: selectedSnapshotStore.selectedSnapshot.transform({
          emitLatestOnSubscribe: true,

          transform(snapshot) {
            if (!snapshot) {
              return alwaysEmptyArray;
            }
            return wiring.getAllStepsBetweenNodeAndLeaf(views.physical, snapshot);
          },

          shouldRetransform(prevSnapshot, snapshot) {
            // reference check works because of immutable objects
            return prevSnapshot !== snapshot;
          }
        })
      };
    }
  },

  render() {
    const hierarchy = this.props.hierarchy;
    if (!hierarchy) {
      return null;
    }

    // if the root element is the host
    if (hierarchy.length === 0) {
      hierarchy.push(this.props.selectedSnapshot);
    }

    return (
      <ul className={block}>
        {hierarchy.reverse().map(child =>
          <Crumb key={child.get('id')}
                 coordinates={child}/>
        )}
      </ul>
    );
  }
});

export default enhance(SnapshotHierarchyBreadcrumb);
