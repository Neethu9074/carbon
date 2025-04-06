/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { handleMultiplePages, stackItemsInPdf, fitContentInPdf } from 'in-services/util/imagesToPdf';

jest.mock('jspdf');
jest.mock('dom-to-image', () => ({
  toPng: jest.fn()
}));

const format = 'png';
const pdfWidth = 841.89;
const pdfHeigth = 595.28;
const headerImage = new Image();
headerImage.src = 'headerImage';

const pdf: any = {
  addImage: jest.fn(),
  addPage: jest.fn(),
  save: jest.fn(),
  internal: {
    pageSize: {
      width: pdfWidth,
      height: pdfHeigth,
      getWidth: () => pdfWidth,
      getHeight: () => pdfHeigth
    }
  }
};

describe('handleMultiplePages', () => {
  it('should generate pdf with multiple pages', async () => {
    const images = generateImages(1, 3720, 6000);
    headerImage.onload = jest.fn(() => {
      headerImage.height = 50;

      handleMultiplePages({ images, format, pdf, headerImage });

      // It should have three pages generated.
      // One is added by default and two calls performed for addPage.
      expect(pdf.addPage).toHaveBeenCalledTimes(2);
      expect(pdf.addImage).toHaveBeenCalledTimes(3);
    });
  });
});

describe('fitContentInPdf', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate pdf with content in one page', async () => {
    const images = generateImages(1, 3720, 6000);
    fitContentInPdf({ images, imageScale: 2, format, pdf });

    // It should have one page only and a page is displayed by default, meaning that the addPage function should not be called.
    expect(pdf.addPage).toHaveBeenCalledTimes(0);
    expect(pdf.addImage).toHaveBeenCalledTimes(1);
  });
});

describe('stackItemsInPdf', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should stack items in pdf', async () => {
    const images = generateImages(3, 3696, 3720);

    // Call function with huge image sizes
    stackItemsInPdf({ images, pdf, format });

    expect(pdf.addPage).toHaveBeenCalledTimes(2);
    expect(pdf.addImage).toHaveBeenCalledTimes(3);
  });

  it('should stack items in pdf with many images', async () => {
    // Provide images that are less than the pdf dimensions.
    // The items should be one below the other and in the same page, if it fits.
    const images = generateImages(8, 596, 312);
    stackItemsInPdf({ images, pdf, format });
    expect(pdf.addPage).toHaveBeenCalledTimes(7);
    expect(pdf.addImage).toHaveBeenCalledTimes(8);
  });
});

function generateImages(numberOfImages: number, imageWidth: number, imageHeight: number) {
  const img = new Image();
  img.src = 'mockedImage';

  let images = [];
  for (let i = 0; i < numberOfImages; i++) {
    images.push(img);
  }

  images.forEach(image => {
    image.width = imageWidth;
    image.height = imageHeight;
    image.onload = jest.fn(() => {
      image.width = imageWidth;
      image.height = imageHeight;
    });
  });

  return images;
}
