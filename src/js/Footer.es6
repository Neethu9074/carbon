'use strict';

import React from 'react';

import Icon from 'instana-ui-components/Icon';
import Lettering from 'instana-ui-components/Lettering';

import './Footer.less';

const block = 'in-footer';

const Footer = React.createClass({
  render() {

    return (
      <div className={block}>
        <div className={block + '__block'}>
          <Icon type='tasks'
                className={block + '__issues'}/>
          <Lettering className={block + '__lettering'}/>
        </div>

        <div className={block + '__block'}>
          <Icon type='cubes'
                className={block + '__content-control'} />
          <Icon type='bar-chart'
                className={block + '__content-control'}/>
          <Icon type='cog'
                className={block + '__content-control'}/>
        </div>

        <div className={block + '__block ' + block + '__help'}>
          Need any help?
        </div>
      </div>
    );
  }
});

export default Footer;
