import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {setHighlightedEntityId, clearHighlightedEntityId} from 'in-services/stores/highlightedEntityId';
import getHighlightedState from 'in-hoc/getHighlightedState';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import HealthIcon from 'in-components/HealthIcon';
import getSnapshot from 'in-hoc/getSnapshot';
import {getLabel} from 'in-sdk/snapshot';

import './ComponentItem.less';


const block = 'in-sidebar-component-item';

export default getSnapshot(
               getHighlightedState(
               React.createClass({

  displayName: 'ComponentItem',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: React.PropTypes.string.isRequired,
    highlighted: React.PropTypes.bool,
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    return (
      <li className={this.props.highlighted ? block + ' ' + block + '__highlighted' : block}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onClick}>

        {getLabel(snapshot)}
        <HealthIcon snapshotId={this.props.snapshotId}/>
      </li>
    );
  },

  onClick() {
    setSelectedSnapshotId(this.props.snapshotId);
  },

  onMouseEnter() {
    setHighlightedEntityId(this.props.snapshotId);
  },

  onMouseLeave() {
    clearHighlightedEntityId();
  }
})));
