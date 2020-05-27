import { Redirect } from 'react-router-dom';
import React from 'react';

import { getView } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const subscriptions = {};
    if (props.to) {
      subscriptions.resolvedTo = getView(props.to);
    }
    if (props.to$) {
      subscriptions.resolvedTo = props.to$;
    }
    return subscriptions;
  },
  function RedirectWithHash(props) {
    if (props.resolvedTo) {
      // Remove the leading /# from the URL. React router is expecting the path irrespective of the
      // used routing mechanism.
      const toUrl = props.resolvedTo.substring(2);
      const redirectTo = props.retainQueryParameters ? { pathname: toUrl } : toUrl;

      return <Redirect push={props.push} from={props.from} to={redirectTo} />;
    }
    return null;
  }
);
