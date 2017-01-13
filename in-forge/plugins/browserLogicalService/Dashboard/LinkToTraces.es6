import React from 'react';

import {getTraceViewLinkWithQuery} from 'in-stores/navigation/view';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  return {
    link: getTraceViewLinkWithQuery(props.query)
  };
}, function LinkToTraces({children, link}) {
  return (
    <a href={link}>
      {children}
    </a>
  );
});
