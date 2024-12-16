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
  ImagesToPdfProps,
  imagesToPdf
} from 'in-services/util/imagesToPdf';

export default function useImagesToPdf({
  filename = defaultFilename,
  format = defaultFormat,
  pdfSettings = defaultPdfSettings,
  imagesUrls,
  imageScale,
  shouldFitPdf,
  shouldDownloadAfterGeneration
}: ImagesToPdfProps) {
  return useObservable(() => {
    return fromPromise(
      imagesToPdf({
        filename,
        format,
        imagesUrls,
        imageScale,
        pdfSettings,
        shouldFitPdf,
        shouldDownloadAfterGeneration
      })
    );
  }, []);
}
