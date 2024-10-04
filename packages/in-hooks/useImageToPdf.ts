/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fromPromise } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  defaultFilename,
  defaultFormat,
  defaultPdfSettings,
  ImageToPdfProps,
  imageToPdf
} from 'in-services/util/imageToPdf';

export default function useImageToPdf({
  filename = defaultFilename,
  format = defaultFormat,
  pdfSettings = defaultPdfSettings,
  imageUrl,
  imageScale,
  shouldFitPdf
}: ImageToPdfProps) {
  return useObservable(() => {
    return fromPromise(imageToPdf({ filename, format, imageUrl, imageScale, pdfSettings, shouldFitPdf }));
  }, []);
}
