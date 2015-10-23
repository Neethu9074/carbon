import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import * as ro from 'reactive-observables';

import {getDeployedUnits} from 'in-services/wiring';
import {getFullSnapshot} from 'in-services/snapshots';

import RelatedSnapshotList from './RelatedSnapshotList';
import enhance from './hoc/enhance';

const DeployedUnitList = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshot: irpt.map.isRequired,
    deployedUnits: React.PropTypes.array
  },

  statics: {
    createObservables(props) {
      return {
        deployedUnits: getDeployedUnits(props.snapshot)
          .flatMap(deployedUnits => ro.combineLatest(deployedUnits.map(getFullSnapshot)))
      };
    }
  },

  render() {
    if (this.props.deployedUnits == null) {
      return null;
    }

    return <RelatedSnapshotList snapshots={this.props.deployedUnits} />;
  }

});

export default enhance(DeployedUnitList);
