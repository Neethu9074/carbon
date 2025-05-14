/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useEffect, useCallback, useState, useRef } from 'react';

/**
 * Handler to deal with clicks outside or inside the component
 * Can handle problems with stoppropagation and still
 * close the popover on clicks outside also fixes issues with clicking Icons inside a button

 * @returns {{open: boolean, toggle: Callback, ref: HTMLDivElement}}
 */
export default function usePopoverClickHandler() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const isOpen = open;
    setOpen(!isOpen);
  };

  const callbackToggle = useCallback(toggle, [open]);

  const clickOutside = (event: Event) => {
    if (open) {
      // if click outside - close
      const inside = ref.current?.contains(event?.target as Node);
      if (!inside) callbackToggle();
    }
  };

  const callbackClickOutside = useCallback(clickOutside, [ref, callbackToggle, open]);

  useEffect(() => {
    const handler = (event: Event) => {
      callbackClickOutside(event);
    };

    window.addEventListener?.('click', handler, true);

    return () => {
      window.removeEventListener?.('click', handler);
    };
  }, [callbackClickOutside]);

  return { open, toggle, ref };
}
