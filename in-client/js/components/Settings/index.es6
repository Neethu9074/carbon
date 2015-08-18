import React from 'react/addons';

import Icon from 'in-components/Icon';

import './index.less';

const block = 'in-settings';

const Settings = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    showMenu: React.PropTypes.func.isRequired
  },

  render() {
    return (
      <div className={block + '__wrapper'}>
        <div className={block}>
          <Icon type='delete'
                className={block + '__icon-close'}
                onClick={() => this.props.showMenu(false)}/>
        </div>
      </div>
    );
  }
});

export default Settings;
