/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { forwardRef, useRef, useState, ReactNode, useEffect } from 'react';
import classNames from 'classnames';

import { loadingSelectors, pdfContent } from 'in-components/DownloadPdf/utils/constants';

import locals from 'in-components/DownloadPdf/components/PdfContent/PdfContent.mless';

interface Props {
  className?: string;
  orientation?: string;
  children?: ReactNode;
  onReady?: () => void;
}

const PdfContent = forwardRef<HTMLDivElement, Props>(({ className, orientation, children, onReady }, ref) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Set as ready only when content is not in loading state
  useEffect(() => {
    const checkLoadingStatus = () => {
      const contentNode = contentRef.current;
      if (!contentNode) return;
      const isLoading = loadingSelectors.some(selector => contentNode.querySelectorAll(`.${selector}`).length > 0);
      if (!isLoading && !hasLoaded) {
        clearInterval(interval);
        setTimeout(() => onReady?.());
        setHasLoaded(true);
      }
    };
    const interval = setInterval(checkLoadingStatus, 200);
    return () => {
      clearInterval(interval);
    };
  }, [hasLoaded, onReady, ref]);

  return (
    <div
      id={pdfContent}
      ref={ref}
      data-testid={pdfContent}
      aria-hidden="true"
      className={classNames(className, {
        [locals.pdfContent]: true,
        [locals.landscape]: Boolean(orientation === 'l')
      })}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
});

export default PdfContent;
