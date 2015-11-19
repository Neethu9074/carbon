import React from 'react/addons';

import Icon from 'in-components/Icon';

import './MenuHeader.less';

const block = 'in-menu-header';

const MenuHeader = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  render() {
    return (
      <div className={block}
           onClick={this.onClick}>

        <div className={block + '__wrapper'}>
          <span className={block + '__welcome'}>
            Welchome to Instana,
          </span>
          <br/>
          <span className={block + '__user-name'}>
            {window.instana.user.fullName}
          </span>
        </div>

        <Icon type={'right'} className={block + '__icon'}/>

      </div>
    );
  },

  onClick() {

  }
});

export default MenuHeader;
