/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Redirect } from 'react-router-dom';
import React from 'react';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { parseUrl } from 'in-stores/navigation/routing/parser';

export default function RedirectWithHash(props) {
  const { createHrefToPath } = useNavigation();

  const subscriptions = { ...props };
  if (props.to) {
    subscriptions.resolvedTo = createHrefToPath(props.to);
  }
  if (props.to$) {
    subscriptions.resolvedTo = props.to$;
  }

  if (subscriptions.resolvedTo) {
    // Remove the leading /# (or /tenant/unit/#) from the URL. React router
    // is expecting the path irrespective of the used routing mechanism.
    const toUrl = subscriptions.resolvedTo.replace(/^[/\w]*\/#/, '');
    return <Redirect push={props.push} from={props.from} to={parseUrl(toUrl)} />;
  }
  if (subscriptions.href) {
    // Remove the leading /# (or /tenant/unit/#) from the URL. React router
    // is expecting the path irrespective of the used routing mechanism.
    const toUrl = subscriptions.href.replace(/^[/\w]*\/#/, '');
    return <Redirect push={props.push} from={props.from} to={parseUrl(toUrl)} />;
  }
  return null;
}
