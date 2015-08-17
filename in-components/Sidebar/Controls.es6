import React from 'react/addons';

import classnames from 'in-services/util/classnames';
import {theme} from 'in-services/theme';

import Icon from '../Icon';

import './Controls.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-controls';

const Controls = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    activeControl: rpt.string,
    onChangeActiveControl: rpt.func.isRequired,

    activeHealthFilter: rpt.string,
    onChangeActiveHealthFilter: rpt.func.isRequired
  },

  render() {
    return (
      <nav className={block}>
        <ul className={block + '__control-list'}>
          {this.renderControlIcon('metrics', 'metrics')}
          {this.renderControlIcon('tags', 'tags')}
          {this.renderControlIcon('zones', 'snapshotList')}

          <li className={block + '__control-item ' + block + '__control-item--start-of-group'}>
              {this.renderHealthFilterIcon('warning', 'warning')}
              {this.renderHealthFilterIcon('critical', 'danger')}
              <Icon type='system'
                    className={block + '__control-icon'}/>
          </li>
        </ul>
      </nav>
    );
  },

  renderControlIcon(icon, controlName) {
    return (
      <li className={classnames({
        [block + '__control-item']: true,
        [block + '__control-item--active']: this.props.activeControl === controlName
      })}>
        <Icon type={icon}
              className={classnames({
                [block + '__control-icon']: true,
                [block + '__control-icon--active']: this.props.activeControl === controlName
              })}
              onClick={() => this.props.onChangeActiveControl(controlName)}/>
      </li>
    );
  },

  renderHealthFilterIcon(icon, healthName) {
    return (
      <Icon type={icon}
            className={classnames({
              [block + '__control-icon']: true,
              [block + '__control-icon--active']: this.props.activeHealthFilter === healthName,
              [block + '__control-icon--inactive']: this.props.activeHealthFilter !== healthName
            })}
            style={{color: theme.health[healthName]}}
            onClick={() => this.props.onChangeActiveHealthFilter(healthName)}/>
    );
  }
});

export default Controls;
