import React from 'react';

import { getApiTokenConfigLink } from 'in-stores/navigation/configuration';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      href: getApiTokenConfigLink(props.apiToken.get('id'))
    };
  },
  function ApiTokenLink({ href, className, children }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
);
