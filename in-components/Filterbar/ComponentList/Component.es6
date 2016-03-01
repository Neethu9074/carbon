import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getColorPool} from 'in-services/util/ColorGenerator';
import Collapsible from 'in-components/Collapsible';
import getSnapshot from 'in-hoc/getSnapshot';

import './Component.less';


const block = 'in-sidebar-component';
const rpt = React.PropTypes;

export default getSnapshot(
               React.createClass({

  displayName: 'ComponentItem',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    children: rpt.any.isRequired,
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    const colorPool = getColorPool('groups');

    return (
      <Collapsible initiallyOpen={false}
                   className={block}>
        <Collapsible.Header style={{ color: colorPool.getColorHex(this.props.snapshotId) }}>
          <span className={block + '__label'}>
            {snapshot.getIn(['data', 'groupId']) + ' (' + this.props.children.size + ')'}
          </span>
        </Collapsible.Header>
        <Collapsible.Content>
          <ul className={block + '__list'}>
            {this.props.children}
          </ul>
        </Collapsible.Content>
      </Collapsible>
    );
  }
}));
