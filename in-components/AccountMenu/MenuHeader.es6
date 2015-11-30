import React from 'react/addons';

import {config} from 'in-services/config';
import Icon from 'in-components/Icon';

import './MenuHeader.less';

const block = 'in-menu-header';
const url = `https://${config.groundskeeperDomain}/ump/${config.tenant}/${config.tenantUnit}`;

const MenuHeader = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  render() {
    return (
      <div className={block}
           onClick={this.onClick}>

        <a className={block + '__wrapper'}
           href={url}
           target='_blank'>
          <span className={block + '__welcome'}>
            Welchome to Instana,
          </span>
          <br/>
          <span className={block + '__user-name'}>
            {window.instana.user.fullName}
          </span>
        </a>

        <Icon type={'right'} className={block + '__icon'}/>

      </div>
    );
  }
});

export default MenuHeader;
