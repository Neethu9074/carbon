import React from 'react/addons';

import classnames from 'in-services/util/classnames';
import {getClassName} from 'in-services/react';

import Tooltip from '../Tooltip';
import Icon from '../Icon';

import './Controls.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-controls';

const Controls = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    onChangeActiveControl: rpt.func.isRequired,
    activeControl: rpt.string,
    className: rpt.string
  },

  render() {
    return (
      <nav className={getClassName(this, block)}>
        <ul className={block + '__control-list'}>

          {this.renderControlIcon('metrics', 'metrics', 'Show metrics.', true)}
          {this.renderControlIcon('tags', 'tags', 'Show Tags', true)}

          {__DEV__ ?
            this.renderControlIcon('system', 'mapStats', 'Show map rendering stats.', true)
          : null}
        </ul>
      </nav>
    );
  },

  renderControlIcon(icon, controlName, tooltip, enabled) {
    // Assign the click handler only when enabled to ensure that the Icon component
    // is automatically switching between a <button> and an simple <i> element.
    let clickHandler;
    if (enabled) {
      clickHandler = () => this.props.onChangeActiveControl(controlName);
    }
    return (
      <li className={classnames({
        [block + '__control-item']: true,
        [block + '__control-item--active']: this.props.activeControl === controlName,
        [block + '__control-item--enabled']: enabled
      })}>
        <Tooltip content={tooltip}>
          <Icon type={icon}
                className={classnames({
                  [block + '__control-icon']: true,
                  [block + '__control-icon--active']: this.props.activeControl === controlName,
                  [block + '__control-icon--enabled']: enabled
                })}
                onClick={clickHandler}/>
        </Tooltip>
      </li>
    );
  }
});

export default Controls;
