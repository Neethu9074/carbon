import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import * as ro from 'reactive-observables';

import {getLayers} from 'in-services/wiring';
import {getFullSnapshot} from 'in-services/snapshots';

import RelatedSnapshotList from './RelatedSnapshotList';
import enhance from './hoc/enhance';

const WiringList = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshot: irpt.map.isRequired,
    wiredSnapshots: React.PropTypes.array
  },

  statics: {
    createObservables(props) {
      return {
        wiredSnapshots: getLayers(props.snapshot)
          .flatMap(layers => ro.combineLatest(layers.map(getFullSnapshot)))
      };
    }
  },

  render() {
    if (this.props.wiredSnapshots == null) {
      return null;
    }

    return <RelatedSnapshotList snapshots={this.props.wiredSnapshots} />;
  }

});

export default enhance(WiringList);
