/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import jsPDF, { jsPDFOptions } from 'jspdf';

type ImageType = 'jpeg' | 'png';

export interface ImageToPdfProps {
  imageUrl: string;
  filename?: string;
  format?: ImageType;
  imageScale: number;
  pdfSettings?: jsPDFOptions;
  shouldFitPdf: boolean;
}

interface Props extends Omit<ImageToPdfProps, 'imageUrl'> {
  pdf: jsPDF;
  image: HTMLImageElement;
  shouldFitPdf: boolean;
}

export const defaultPdfSettings: jsPDFOptions = {
  orientation: 'p',
  unit: 'pt',
  format: 'a4',
  compress: true
};

export const defaultFilename = 'dashboard-widget-export';
export const defaultFormat = 'png';

export const imageToPdf = ({
  filename = defaultFilename,
  format = defaultFormat,
  pdfSettings,
  imageUrl,
  imageScale,
  shouldFitPdf
}: ImageToPdfProps): Promise<boolean> =>
  new Promise<boolean>((resolve, reject) => {
    const pdf = new jsPDF({ ...defaultPdfSettings, ...pdfSettings });

    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      generatePdfOnImageLoad({ pdf, image, imageScale, format, filename, shouldFitPdf });
      resolve(true);
    };

    image.onerror = () => {
      reject(new Error(`Failed to load image from URL: ${imageUrl}`));
    };
  });

function generatePdfOnImageLoad({
  pdf,
  image,
  imageScale,
  format = defaultFormat,
  filename,
  shouldFitPdf = false
}: Props) {
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const originalImageWidth = image.width / imageScale;
  const originalImageHeight = image.height / imageScale;
  const isImageNotGreaterThanPdf = originalImageWidth < pdfWidth;

  let width = isImageNotGreaterThanPdf ? originalImageWidth : pdfWidth;
  let height = isImageNotGreaterThanPdf ? originalImageHeight : pdfHeight;

  if (shouldFitPdf && !isImageNotGreaterThanPdf) {
    // If the image exceeds the PDF page width or height
    if (originalImageWidth > pdfWidth || originalImageHeight > pdfHeight) {
      // Calculate scaling factor to adapt image to the pdf size
      const widthScaleFactor = pdfWidth / originalImageWidth;
      const heightScaleFactor = pdfHeight / originalImageHeight;
      const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor);

      width = originalImageWidth * scaleFactor;
      height = originalImageHeight * scaleFactor;
    }
  }

  pdf.addImage(image.src, format, 0, 0, width, height, '', 'FAST');
  pdf.save(`${filename}.pdf`);
}
