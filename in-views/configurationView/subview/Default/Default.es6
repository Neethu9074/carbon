import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import 'in-views/configurationView/subview/Default/Default.less';


export default function DefaultConfigView() {
  return (
    <div className='in-configuration-default-view'>
      <SvgIcon type='gear'
               width={250}
               color='#ddd' />
    </div>
  );
}
