/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode, useEffect, useState } from 'react';

export interface Props {
  id: string;
  duration: number;
  onHide?: () => void;
  children: ReactNode;
}

export default function TemporaryPresenter({ id, duration, onHide, children }: Props) {
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    let timeout: any;

    setShowChildren(true);
    if (duration) {
      timeout = setTimeout(() => setShowChildren(false), duration);
    }

    return () => {
      clearTimeout(timeout);
      setShowChildren(false);
      onHide?.();
    };
  }, [id, duration, onHide]);

  if (showChildren && children) {
    return <>{children}</>;
  }
  return null;
}
