/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createContext, useContext, RefObject } from 'react';

interface PdfContextProps {
  pdfHeaderRef: RefObject<HTMLDivElement> | null;
}

const defaultContext = {
  pdfHeaderRef: null
};

export const PdfContext = createContext<PdfContextProps>(defaultContext);

export function usePdfContext() {
  return useContext(PdfContext);
}
