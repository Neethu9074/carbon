import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import getSnapshot from 'in-hoc/getSnapshot';
import {getLabel} from 'in-sdk/snapshot';
import Icon from 'in-components/Icon';

import './ConnectionLine.less';


const rpt = React.PropTypes;
const block = 'in-connection-item';

const ConnectionLine = getSnapshot(
                       React.createClass({

  displayName: 'ConnectionLine (Process)',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    connection: rpt.object.isRequired,
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    const connection = this.props.connection;

    return (
      <div key={connection.id}
           className={block}>
        {connection.direction === DIRECTIONS.IN ?
          <Icon className={block + '__icon'} type={'arrow_left'}/> :
          <Icon className={block + '__icon'} type={'arrow_right'}/>
        }
        <span className={block + '__ip'}>
          {getLabel(snapshot)}
        </span>
      </div>
    );
  }
}));

export function renderConnectionLine(connection) {
  return (
    <ConnectionLine key={connection.id}
                    snapshotId={connection.destinationNode.id}
                    connection={connection}/>
  );
}
