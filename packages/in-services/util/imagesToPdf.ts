/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import jsPDF, { jsPDFOptions } from 'jspdf';

type ImageType = 'jpeg' | 'png';

export interface ImagesToPdfProps {
  imagesUrls: string[];
  filename?: string;
  format?: ImageType;
  imageScale: number;
  pdfSettings?: jsPDFOptions;
  shouldFitPdf: boolean;
  shouldDownloadAfterGeneration: boolean;
}

interface Props extends Omit<ImagesToPdfProps, 'imagesUrls'> {
  pdf: jsPDF;
  images: HTMLImageElement[];
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

export const imagesToPdf = ({
  filename = defaultFilename,
  format = defaultFormat,
  pdfSettings,
  imagesUrls,
  imageScale,
  shouldFitPdf,
  shouldDownloadAfterGeneration
}: ImagesToPdfProps): Promise<{
  onfulfilled: boolean;
  pdf: jsPDF;
}> =>
  new Promise<{
    onfulfilled: boolean;
    pdf: jsPDF;
  }>(resolve => {
    const pdf = new jsPDF({ ...defaultPdfSettings, ...pdfSettings });

    // Get all urls and create an image for each.
    generateImagesFromUrl(imagesUrls).then(images => {
      const pdfGenerated = generatePdfOnImageLoad({
        pdf,
        images,
        imageScale,
        format,
        filename,
        shouldFitPdf,
        shouldDownloadAfterGeneration
      });
      resolve({
        onfulfilled: true,
        pdf: pdfGenerated
      });
    });
  });

function generatePdfOnImageLoad({
  pdf,
  images,
  imageScale,
  format = defaultFormat,
  filename,
  shouldFitPdf = false,
  shouldDownloadAfterGeneration = true
}: Props) {
  const hasOneImage = images.length === 1;
  const options = {
    format,
    images,
    imageScale,
    pdf
  };

  if (hasOneImage) {
    if (shouldFitPdf) {
      fitContentInPdf(options);
    } else {
      handleMultiplePages(options);
    }
  } else {
    stackItemsInPdf(options);
  }

  if (shouldDownloadAfterGeneration) {
    pdf.save(`${filename}.pdf`);
  }

  return pdf;
}

function loadImage(imageUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from URL: ${imageUrl}`));
    img.src = imageUrl;
    document.getElementById('image')?.appendChild(img);
  });
}

async function generateImagesFromUrl(imagesUrls: string[]): Promise<HTMLImageElement[]> {
  const promises = imagesUrls.map(async (imageUrl: string) => await loadImage(imageUrl));
  return Promise.all(promises);
}

interface FunctionProps {
  format: ImageType;
  images: HTMLImageElement[];
  pdf: jsPDF;
}

export function fitContentInPdf({
  images,
  imageScale,
  format,
  pdf
}: FunctionProps & { imageScale: ImagesToPdfProps['imageScale'] }) {
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const image = images[0];
  const originalImageWidth = image.width / imageScale;
  const originalImageHeight = image.height / imageScale;
  const isImageNotGreaterThanPdf = originalImageWidth < pdfWidth;
  let width = isImageNotGreaterThanPdf ? originalImageWidth : pdfWidth;
  let height = isImageNotGreaterThanPdf ? originalImageHeight : pdfHeight;

  // If the image exceeds the PDF page width or height
  // Calculate scaling factor to adapt image to the pdf size
  if (!isImageNotGreaterThanPdf) {
    if (originalImageWidth > pdfWidth || originalImageHeight > pdfHeight) {
      const widthScaleFactor = pdfWidth / originalImageWidth;
      const heightScaleFactor = pdfHeight / originalImageHeight;
      const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor);
      width = originalImageWidth * scaleFactor;
      height = originalImageHeight * scaleFactor;
    }

    pdf.addImage(image.src, format, 0, 0, width, height, '', 'FAST');
  }
}

export function handleMultiplePages({ images, format, pdf }: FunctionProps) {
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const image = images[0];

  const imgHeight = (image.height * pdfWidth) / image.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(image.src, format, 0, position, pdfWidth, imgHeight, '', 'FAST');
  heightLeft -= pdfHeight;

  // Add pages if needed and move to the next position for new page
  while (heightLeft > 0) {
    position = imgHeight - heightLeft;
    pdf.addPage();
    pdf.addImage(image.src, format, 0, -position, pdfWidth, imgHeight, '', 'FAST');
    heightLeft -= pdfHeight;
  }
}

export function stackItemsInPdf({ images, pdf, format }: FunctionProps) {
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  let position = 0;

  for (const image of images) {
    let imgWidth = image.width;
    let imgHeight = image.height;
    const aspectRatio = imgWidth / imgHeight;

    // Check if the image fits within the page width or height.
    // Scale down to fit width. If height still exceeds, scale down further
    if (imgWidth > pdfWidth || imgHeight > pdfHeight) {
      if (imgWidth > pdfWidth) {
        imgWidth = pdfWidth;
        imgHeight = imgWidth / aspectRatio;
      }
      if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight;
        imgWidth = imgHeight * aspectRatio;
      }
    }

    // Check if the image fits vertically on the current page and add a new page
    if (position + imgHeight > pdfHeight) {
      pdf.addPage();
      position = 0;
    }

    pdf.addImage(image.src, format, 0, position, imgWidth, imgHeight, '', 'FAST');
    position += imgHeight;
  }
}
