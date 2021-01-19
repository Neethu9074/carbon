/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Redirect } from 'react-router-dom';
import React from 'react';

import { parseUrl } from 'in-stores/navigation/routing/parser';
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
      return <Redirect push={props.push} from={props.from} to={parseUrl(toUrl)} />;
    }
    return null;
  }
);
