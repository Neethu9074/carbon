/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { History, LocationListener } from 'history';

import { parseUrl } from 'in-stores/navigation/routing/parser';
import translate from 'in-stores/navigation/routing/translate';
import { Location } from 'in-stores/navigation/types';

type MatrixAwareHistoryListener = (location: Location) => void;

export interface MatrixAwareHistory {
  listen(listener: MatrixAwareHistoryListener): void;
  push(location: string | Location): void;
  replace(location: string | Location): void;
  readonly location: Location;
}

export function wrap(history: History<any>): MatrixAwareHistory {
  // needed to resolve cases where a redirect is done via React components. This will then only
  // push via a string. In these cases, we want to potentially retain all matrix and query parameters.
  let currentLocation: Location;

  const origPush = history.push;
  const origReplace = history.replace;
  const origListen = history.listen;

  // @ts-expect-error The types are incomplete. This field exists and is used by other
  // libraries that interact with the history module.
  history.location = parseUrl(window.location.hash.replace(/^#/, ''));

  // @ts-expect-error
  history.listen = (listener: MatrixAwareHistoryListener) => origListen.call(history, wrapListener(listener));
  history.push = (pathnameOrLocation: string | Location) =>
    origPush.call(history, translate(pathnameOrLocation, currentLocation));
  history.replace = (pathnameOrLocation: string | Location) =>
    origReplace.call(history, translate(pathnameOrLocation, currentLocation));

  history.listen((location: any) => (currentLocation = history.location = location));

  return history as any;
}

function wrapListener(listener: (loc: Location) => void): LocationListener<unknown> {
  return location => listener(parseUrl(location.pathname + (location.search || '')));
}
