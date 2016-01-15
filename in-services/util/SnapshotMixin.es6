import Immutable from 'immutable';
import invariant from 'invariant';

import {getSnapshot} from 'in-stores/snapshot';


const SnapshotMixin = {
  getInitialState() {
    return {
      snapshot: Immutable.Map()
    };
  },

  componentWillMount() {
    invariant(this.props.id, 'React class needs an id property');

    this.snapshot = Immutable.Map();
    this.snapshotSubscription = getSnapshot(this.props.id).subscribe(snapshot => this.setState({snapshot}));
  },

  componentWillUnmount() {
    this.snapshotSubscription.dispose();
  }
};

export default SnapshotMixin;
