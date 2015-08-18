import React from 'react/addons';

import Icon from 'in-components/Icon';
import {settings as globalSettings, save} from 'in-services/settings';

import './Settings.less';

const block = 'in-settings';

const Settings = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    showMenu: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      inverseCheckboxChecked: globalSettings.scrollDirection === 1 ? false : true
    };
  },

  closeSettings() {
    save();
    this.props.showMenu(false);
  },

  render() {
    return (
      <div className={block + '__wrapper'}>
        <div className={block}>
          <Icon type='delete'
                className={block + '__icon-close'}
                onClick={this.closeSettings}/>

          <span className={block + '__heading'}>settings</span>

          <div>
            <input type='checkbox'
                   defaultChecked={this.state.inverseCheckboxChecked}
                   className={block + '__checkbox'}
                   onClick={(e) => { globalSettings.scrollDirection = e.target.checked ? -1 : 1; }}/>
            {'Inverse scroll direction'}
          </div>

        </div>
      </div>
    );
  }
});

export default Settings;
