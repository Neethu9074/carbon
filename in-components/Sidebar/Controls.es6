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
    className: rpt.string,
    activeControl: rpt.string,
    onChangeActiveControl: rpt.func.isRequired
  },

  render() {
    let rootClasses = block;
    if (this.props.className) {
      rootClasses += ' ' + this.props.className;
    }
    return (
      <nav className={rootClasses}>
        <ul className={block + '__control-list'}>
          {this.renderControlIcon('metrics', 'metrics', 'Show Metrics')}
          {this.renderControlIcon('tags', 'tags', 'Show Tags')}
          {this.renderControlIcon('zones', 'snapshotList', 'Show Component List')}
          {__DEV__ ?
            this.renderControlIcon('system', 'mapStats', 'Show Map Rendering Stats')
          : null}
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
