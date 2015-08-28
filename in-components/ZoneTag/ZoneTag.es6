import _ from 'lodash';
import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {viewStructure} from 'in-services/stores/view';
import {getColor, getZone} from 'in-sdk/zones';

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
            return getZone(nodeStructure.group);
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
    let classes = block;
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return (
      <div className={classes}
           style={{background: getColor(zone)}}>
        {zone}
      </div>
    );
  }
});

export default enhance(ZoneTag);
