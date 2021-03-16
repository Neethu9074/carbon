/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useEffect } from 'react';

const originalbackgroundColor = document.documentElement.style.background;

export default function SetBodyColor({ color }) {
  useEffect(() => {
    document.body.style.background = color;
    return () => {
      document.body.style.background = originalbackgroundColor;
    };
  }, [color]);
  return null;
}
