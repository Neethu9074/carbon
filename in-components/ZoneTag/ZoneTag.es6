import irpt from 'react-immutable-proptypes';
import React from 'react/addons';
import _ from 'lodash';

import {getColor} from 'in-services/util/groupColors';
import {viewStructure} from 'in-services/stores/view';
import {getClassName} from 'in-services/react';
import {getLabel} from 'in-sdk/snapshot';

import enhance from '../hoc/enhance';

import './ZoneTag.less';

const rpt = React.PropTypes;
const block = 'in-zone-tag';

const ZoneTag = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    zone: rpt.string,
    className: rpt.string
  },

  statics: {
    createObservables(props) {
      const snapshotId = props.snapshot.get('id');
      const predicate = nodeStructure => nodeStructure.node.get('id') === snapshotId;
      return {
        zone: viewStructure.map(currentViewStructure => {
          const nodeStructure = _.find(currentViewStructure, predicate);
          if (nodeStructure && nodeStructure.group) {
            return getLabel(nodeStructure.group);
          }
          return null;
        })
      };
    }
  },

  render() {
    const zone = this.props.zone;
    if (!zone) {
      return null;
    }
    return (
      <div className={getClassName(this, block)}
           style={{color: getColor(zone)}}>
        {zone}
      </div>
    );
  }
});

export default enhance(ZoneTag);
