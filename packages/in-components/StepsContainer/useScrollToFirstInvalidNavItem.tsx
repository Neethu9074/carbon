/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useState, useEffect } from 'react';

import { create, Subject } from '@instana/observables';

import { scrollIntoView } from 'in-services/util/dom';
import { NavItem } from 'in-components/SideNav';

const triggerScrollToInvalidNavItem$: Subject<boolean> = create<boolean>();

export const triggerScrollToInvalidItem = () => {
  triggerScrollToInvalidNavItem$.emit(true);
};

/**
 * Look up the specific node in the demo with the specific scroll-item of the invalid form section (nav item) and
 * scrolls it into viewport.
 *
 * This will be triggered by invoking the triggerScrollToInvalidItem method above.
 *
 * Technically, it was not working when directly listening to the internal Signal$, because it was run too early:
 * When the event was triggered, the setForm update was not fully propagated, so it was not in sync with
 * React's state.
 * At this point, React did not yet re-render the UI with the updated form state, so the invalid item was not yet available.
 *
 * To Sync the observable-mechanism and React State, we simply communicate via a semaphore:
 *
 * Solution/Workaround: here, we use a semaphore in a react state, which will get enabled by trigger, then reset after
 * scrolling via effect hook.
 *
 * @param navItems
 */
export function useScrollToFirstInvalidNavItem(navItems: NavItem[]) {
  const [shouldScrollToItem, setShouldScrollToItem] = useState(false);

  useEffect(() => {
    const subscription = triggerScrollToInvalidNavItem$.subscribe(v => {
      if (v) {
        setShouldScrollToItem(true);
      }
    });
    return () => subscription.dispose();
  }, []);

  useEffect(() => {
    if (shouldScrollToItem) {
      setShouldScrollToItem(false);

      const scrollId = navItems.find(isNavItemDataInvalid)?.scrollId;

      if (scrollId) {
        scrollIntoView(document.getElementById(scrollId), { behavior: 'smooth' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldScrollToItem]);

  return [];
}

function isNavItemDataInvalid(navItem: NavItem) {
  return navItem.valid === false;
}
