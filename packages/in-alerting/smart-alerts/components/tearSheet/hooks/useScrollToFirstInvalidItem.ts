/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect, useState } from 'react';

import { create, Subject } from '@instana/observables';

import { scrollIntoView } from 'in-services/util/dom';

export const triggerScrollToInvalidItem$: Subject<boolean> = create<boolean>();

export default function useScrollToFirstInvalidItem(sectionId: string) {
  const [shouldScrollToItem, setShouldScrollToItem] = useState(false);

  useEffect(() => {
    const subscription = triggerScrollToInvalidItem$.subscribe(v => {
      if (v) {
        setShouldScrollToItem(true);
      }
    });
    return () => subscription.dispose();
  }, []);

  useEffect(() => {
    if (shouldScrollToItem) {
      setShouldScrollToItem(false);

      scrollIntoView(document.getElementById(sectionId), { behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldScrollToItem]);

  return [];
}
