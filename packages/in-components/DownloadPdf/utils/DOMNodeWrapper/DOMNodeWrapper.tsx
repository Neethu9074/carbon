/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useRef } from 'react';

import locals from 'in-components/DownloadPdf/utils/DOMNodeWrapper/DOMNodeWrapper.mless';

export default function DOMNodeWrapper({ node }: Readonly<{ node: HTMLElement }>) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !node) return;
    container.innerHTML = '';
    container.appendChild(node);
  }, [node]);

  return <div className={locals.wrapper} ref={containerRef} />;
}
