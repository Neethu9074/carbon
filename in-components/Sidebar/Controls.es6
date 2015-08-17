import React from 'react/addons';

import {theme} from 'in-services/theme';

import Icon from '../Icon';

import './Controls.less';

// const rpt = React.PropTypes;
const block = 'in-sidebar-controls';

const Controls = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    // onClick: rpt.func.isRequired
  },

  render() {
    return (
      <nav className={block}>
        <ul className={block + '__control-list'}>
          <li className={block + '__control-item'}>
            <Icon type='metrics'
                  className={block + '__control-icon'}/>
          </li>
          <li className={block + '__control-item'}>
            <Icon type='tags'
                  className={block + '__control-icon'}/>
          </li>
          <li className={block + '__control-item'}>
            <Icon type='zones'
                  className={block + '__control-icon'}/>
          </li>
          <li className={block + '__control-item ' + block + '__control-item--start-of-group'}>
            <ul className={block + '__multi-control'}>
              <Icon type='warning'
                    className={block + '__control-icon'}
                    style={{color: theme.health.warning}}/>
              <Icon type='critical'
                    className={block + '__control-icon'}
                    style={{color: theme.health.danger}} />
              <Icon type='system'
                    className={block + '__control-icon'}/>
            </ul>
          </li>
        </ul>
      </nav>
    );
  }
});

export default Controls;
