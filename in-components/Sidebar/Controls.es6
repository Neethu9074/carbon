import React from 'react/addons';

import classnames from 'in-services/util/classnames';

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
          {this.renderControlIcon('metrics', 'metrics')}
          {this.renderControlIcon('tags', 'tags')}
          {this.renderControlIcon('zones', 'snapshotList')}
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
  }
});

export default Controls;
