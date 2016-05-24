import React from 'react';

import {showHelp} from 'in-stores/navigation';

import './HelpLink.less';


const block = 'in-help-link';
const rpt = React.PropTypes;

export default function HelpLink({helpId, children}) {
  return (
    <a href='#'
       onClick={(e) => {
         e.preventDefault();
         showHelp(helpId);
       }}
       className={block}
       title='Open help information'>
      {children}
    </a>
  );
}

HelpLink.propTypes = {
  helpId: rpt.string.isRequired,
  children: rpt.any.isRequired
};
