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
}

interface Props extends Omit<ImageToPdfProps, 'imageUrl'> {
  pdf: jsPDF;
  image: HTMLImageElement;
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
  imageUrl,
  imageScale,
  pdfSettings = defaultPdfSettings
}: ImageToPdfProps): Promise<boolean> =>
  new Promise<boolean>((resolve, reject) => {
    const pdf = new jsPDF(pdfSettings);
    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      generatePdfOnImageLoad({ pdf, image, imageScale, format, filename });
      resolve(true);
    };
    image.onerror = () => {
      reject(new Error(`Failed to load image from URL: ${imageUrl}`));
    };
  });

function generatePdfOnImageLoad({ pdf, image, imageScale, format = defaultFormat, filename }: Props) {
  const imgProps = pdf.getImageProperties(image);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  const originalImageWidth = image.width / imageScale;
  const originalImageHeight = image.height / imageScale;
  const isImageNotGreaterThanPdf = originalImageWidth < pdfWidth;

  const width = isImageNotGreaterThanPdf ? originalImageWidth : pdfWidth;
  const height = isImageNotGreaterThanPdf ? originalImageHeight : pdfHeight;

  pdf.addImage(image.src, format, 0, 0, width, height);
  pdf.save(`${filename}.pdf`);
}
