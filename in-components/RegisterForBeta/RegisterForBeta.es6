/* global hbspt:false */
import React from 'react';

import './RegisterForBeta.less';

const block = 'in-register-for-beta';

const RegisterForBeta = React.createClass({

  shouldComponentUpdate() {
    return false;
  },

  componentDidMount() {
    const hsScript = document.createElement('script');
    hsScript.src = 'https://js.hscta.net/cta/current.js';
    hsScript.onload = () => {
      hbspt.cta.load(719302, '1b09cb76-ef14-4ee9-815c-764855208bef');
    };
    document.head.appendChild(hsScript);
  },

  render() {
    return (
      <span className={'hs-cta-wrapper ' + block}
            id='hs-cta-wrapper-1b09cb76-ef14-4ee9-815c-764855208bef'>
          <span className='hs-cta-node hs-cta-1b09cb76-ef14-4ee9-815c-764855208bef'
                id='hs-cta-1b09cb76-ef14-4ee9-815c-764855208bef'>
              <a href='http://cta-redirect.hubspot.com/cta/redirect/719302/1b09cb76-ef14-4ee9-815c-764855208bef'
                 target='_blank' >
                <img className='hs-cta-img'
                     id='hs-cta-img-1b09cb76-ef14-4ee9-815c-764855208bef'
                     style={{borderWidth: '0px'}}
                     src='https://no-cache.hubspot.com/cta/default/719302/1b09cb76-ef14-4ee9-815c-764855208bef.png'
                     alt='Register for beta'/>
              </a>
          </span>
      </span>

    );
  }
});

export default RegisterForBeta;
