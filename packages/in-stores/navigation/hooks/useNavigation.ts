/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useHistory } from 'react-router';
import { History } from 'history';
import { useMemo } from 'react';

import { IsViewArg, IsViewPredicate, removeDFQueryFromLocationWhenChangingArea } from 'in-stores/navigation/utils';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { applyResets } from 'in-stores/navigation/urlParameterResets';
import { stringify } from 'in-stores/navigation/routing/stringifier';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import translate from 'in-stores/navigation/routing/translate';
import { formatPathWithTU } from 'in-services/formatters/url';
import { Location } from 'in-stores/navigation/types';

interface UseNavigationResult {
  /**
   * A copy of the current location state, can be safely mutated for use as navigation target
   */
  location: Location;

  /**
   * Navigate to the target location state.
   * Won't navigate if the target state is already reached
   * @param target The target location state
   * @param replace Whether the history is to be replaced. Defaults to false, which will result in a push to the current history
   */
  navigate: (target: Location, replace?: boolean) => void;

  /**
   * Creates a href string
   * that can be used to trigger a navigation to the target location state via default browser means, like <a/> elements.
   * @param target The target location state
   */
  createHref: (target: Location) => string;

  /**
   * Creates a href string
   * that can be used to trigger a navigation to the target location state via default browser means, like <a/> elements.
   * @param path The target pathname
   */
  createHrefToPath: (path: string) => string;

  /**
   * Navigate to the provided path.
   * A simplified version of `navigate` that only allows mutation of the locations pathname property.
   * @param path The target pathname
   */
  goToPath: (path: string) => void;

  /**
   * Allows checking whether the current location matches the given predicates
   * @param args Predicates to check, either a string to match against the root path or a predicate to match against the locations pathname
   */
  matchLocation: (...args: IsViewArg[]) => boolean;
}

export function useNavigation(): UseNavigationResult {
  const location = useLocation();
  const history = useHistory();

  return useMemo(
    () => ({
      location: cloneLocation(location),
      navigate: (target: Location, replace?: boolean) => navigate(history, location, target, replace),
      createHref: (target: Location) => createHref(location, target),
      createHrefToPath: (pathname: string) => createHrefToPath(location, pathname),
      goToPath: (path: string) => goToPath(history, location, path),
      matchLocation: (...args: IsViewArg[]) => matchLocation(location, ...args)
    }),
    [location, history]
  );
}

function navigate(history: History, current: Location, target: Location, replace = false): void {
  applyResets(current, target);
  const currentStr = stringify(current);
  const targetStr = translate(target, current);

  if (currentStr === targetStr) return;

  if (replace) {
    history.replace(targetStr);
  } else {
    history.push(targetStr);
  }
}

function createHref(current: Location, target: Location): string {
  applyResets(current, target);
  return formatPathWithTU(`/#${stringify(target)}`);
}

function goToPath(history: History, current: Location, path: string): void {
  const target = cloneLocation(current);
  target.pathname = path;
  navigate(history, current, target);
}

function createHrefToPath(current: Location, path: string): string {
  const target = cloneLocation(current);
  removeDFQueryFromLocationWhenChangingArea(target, path);
  target.pathname = path;
  return createHref(current, target);
}

function matchLocation(current: Location, ...args: IsViewArg[]): boolean {
  const location = cloneLocation(current);

  const predicates = args.reduce((agg, arg) => {
    if (typeof arg === 'function') {
      agg.push(arg);
    } else if (typeof arg === 'string') {
      agg.push(getRootPathPredicate(arg));
    } else {
      if (__DEV__) {
        throw new Error(`Unsupported isView predicate of type ${typeof arg}: ${arg}`);
      }
    }
    return agg;
  }, [] as Array<IsViewPredicate>);

  for (let i = 0; i < predicates.length; i++) {
    if (predicates[i](location.pathname)) {
      return true;
    }
  }
  return false;
}
