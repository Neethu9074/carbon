import React from 'react/addons';

import classnames from 'in-services/util/classnames';

import Tooltip from '../Tooltip';
import Icon from '../Icon';

import './Controls.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-controls';

const Controls = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    activeControl: rpt.string,
    onChangeActiveControl: rpt.func.isRequired
  },

  render() {
    return (
      <nav className={block}>
        <ul className={block + '__control-list'}>
          {this.renderControlIcon('metrics', 'metrics', 'Show Metrics')}
          {this.renderControlIcon('tags', 'tags', 'Show Tags')}
          {this.renderControlIcon('zones', 'snapshotList', 'Show Component List')}
        </ul>
      </nav>
    );
  },

  renderControlIcon(icon, controlName, tooltip) {
    return (
      <li className={classnames({
        [block + '__control-item']: true,
        [block + '__control-item--active']: this.props.activeControl === controlName
      })}>
        <Tooltip content={tooltip}>
          <Icon type={icon}
                className={classnames({
                  [block + '__control-icon']: true,
                  [block + '__control-icon--active']: this.props.activeControl === controlName
                })}
                onClick={() => this.props.onChangeActiveControl(controlName)}/>
        </Tooltip>
      </li>
    );
  }
});

export default Controls;
