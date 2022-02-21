/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

export interface ScrollIntoViewProps {
  renderChildren: (
    ref: React.ForwardedRef<HTMLElement>
  ) => React.ForwardRefExoticComponent<React.RefAttributes<HTMLElement>>;
}

export function ScrollIntoView(props: ScrollIntoViewProps) {
  const [domNode, setDomNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (domNode) {
      domNode.scrollIntoView({ block: 'center' });
    }
  }, [domNode]);

  return props.renderChildren(node => setDomNode(node));
}
