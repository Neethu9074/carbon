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

const EntityClass = getSnapshot(React.createClass({

  displayName: 'Entity',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    entity: rpt.any.isRequired,
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
    const children = this.props.entity.get('children');

    return (
      <div className={block}>

        <div className={block + '__header'}>
          <CheckBox onClick={() => this.setState({isChecked: !this.state.isChecked})}
                    defaultChecked={false} />

          {children.size > 0 ?
            <Icon className={block + '__arrow-icon'}
                  type={this.state.isCollapsed ? 'open' : 'close'}
                  onClick={() => this.setState({isCollapsed: !this.state.isCollapsed})}/>
            :
            <div className={block + '__spacing'}/>
          }

          {snapshot ?
            <img src={getIcon(snapshot)}
                 alt='plugin icon'
                 className={block + '__plugin-icon'}/>
            : null
          }

          <span className={block + '__label'}>
            {snapshot ? getLabel(snapshot) : null}
          </span>

          <HealthInfoBar snapshotId={this.props.snapshotId}/>
        </div>

        { this.state.isCollapsed ?
          null :
          children.map(child =>
            <EntityClass key={child.get('id')}
                         snapshotId={child.get('id')}
                         entity={child} />
          )
        }
      </div>
    );
  }
}));

export default EntityClass;
