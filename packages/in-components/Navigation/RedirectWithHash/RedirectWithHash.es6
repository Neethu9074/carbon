import { Redirect } from 'react-router-dom';
import React from 'react';

import { getView } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    resolvedTo: getView(props.to)
  }),
  function RedirectWithHash(props) {
    if (props.resolvedTo) {
      // Remove the leading /# from the URL. React router is expecting the path irrespect of the
      // used routing mechanism.
      return <Redirect push={props.push} from={props.from} to={props.resolvedTo.substring(2)} />;
    }
    return null;
  }
);
