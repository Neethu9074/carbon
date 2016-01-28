import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getFullSnapshot} from 'in-services/snapshots';
import connectTo from 'in-components/hoc/connectTo';
import {getSingular} from 'in-sdk/pluginName';
import {getIcon} from 'in-sdk/snapshot';

import Tooltip from '../Tooltip';

import './Tab.less';

const block = 'in-sidebar-tab';
const rpt = React.PropTypes;

export default connectTo(
  props => {
    return {
      snapshot: getFullSnapshot(props.coordinates)
    };
  }, React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    coordinates: irpt.map.isRequired,
    isSelected: rpt.bool.isRequired,
    onClick: rpt.func.isRequired,
    className: rpt.string,
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    let className = this.props.isSelected ? block + ' ' + block + '__selected' : block;
    className += ' ' + this.props.className;

    return (
      <Tooltip content={getSingular(snapshot.get('pluginId'))}>
        <li className={className}
            onClick={() => this.props.onClick(snapshot)}>

          <img src={getIcon(snapshot)}
               alt='Snapshot icon'
               className={block + '__icon'}/>
        </li>
      </Tooltip>
    );
  }
}));
