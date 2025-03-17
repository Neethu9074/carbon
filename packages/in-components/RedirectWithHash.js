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
      // Remove the leading /# (or /tenant/unit/#) from the URL. React router
      // is expecting the path irrespective of the used routing mechanism.
      const toUrl = props.resolvedTo.replace(/^[/\w]*\/#/, '');
      return <Redirect push={props.push} from={props.from} to={parseUrl(toUrl)} />;
    }
    if (props.href) {
      // Remove the leading /# (or /tenant/unit/#) from the URL. React router
      // is expecting the path irrespective of the used routing mechanism.
      const toUrl = props.href.replace(/^[/\w]*\/#/, '');
      return <Redirect push={props.push} from={props.from} to={parseUrl(toUrl)} />;
    }
    return null;
  }
);
