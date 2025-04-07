/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ReactNode, useRef, useMemo } from 'react';

import { PdfContext } from 'in-components/DownloadPdfDialog/context/PdfContext';

export const PdfProvider = ({ children }: { children: ReactNode }) => {
  const pdfHeaderRef = useRef(null);
  const values = useMemo(() => ({ pdfHeaderRef }), []);
  return <PdfContext.Provider value={values}>{children}</PdfContext.Provider>;
};
