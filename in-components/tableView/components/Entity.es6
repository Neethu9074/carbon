import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import HealthInfoBar from 'in-components/HealthInfoBar';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import CheckBox from 'in-components/CheckBox';
import getSnapshot from 'in-hoc/getSnapshot';
import Icon from 'in-components/Icon';

import './Entity.less';


const block = 'in-table-view-entity';
const rpt = React.PropTypes;

export default getSnapshot(
  React.createClass({

    displayName: 'Entity',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      snapshotId: rpt.string.isRequired,
      snapshot: irpt.map
    },

    getInitialState() {
      return {
        isCollapsed: true,
        isChecked: false
      };
    },

    render() {
      const snapshot = this.props.snapshot;

      return (
        <div className={block} >

          <CheckBox onClick={() => this.setState({isChecked: !this.state.isChecked})}
                    defaultChecked={false} />

          <Icon className={block + '__arrow-icon'}
                type={this.state.isCollapsed ? 'open' : 'close'}
                onClick={() => this.setState({isCollapsed: !this.state.isCollapsed})} />

          {snapshot ?
            <img src={getIcon(snapshot)}
                 alt='plugin icon'
                 className={block + '__plugin-icon'}/>
            : null
          }

          <span className={block + '__label'}>
            {snapshot ? getLabel(snapshot) : null}
          </span>

          <HealthInfoBar snapshotId={this.props.snapshotId} />
        </div>
      );
    }
  })
);
