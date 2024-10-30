/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import jsPDF from 'jspdf';

import { t } from 'in-i18n';

export type ActionsTypes =
  | 'IS_GENERATING_PDF'
  | 'SET_ORIENTATION'
  | 'SET_IMAGES_URLS'
  | 'SET_SHOULD_FIT_PDF'
  | 'SET_STACKED_WIDGETS'
  | 'SET_PDF';

type Orientation = 'portrait' | 'landscape';

interface IsGenerating {
  value: boolean;
  text?: string;
}

export type PdfAction = {
  type: ActionsTypes;
  payload: IsGenerating | Orientation | jsPDF | boolean | null | string[] | string;
};

export const actions: Record<string, ActionsTypes> = {
  setIsGenerating: 'IS_GENERATING_PDF',
  setOrientation: 'SET_ORIENTATION',
  setImagesUrls: 'SET_IMAGES_URLS',
  setShouldFitPdf: 'SET_SHOULD_FIT_PDF',
  setStackedWidgets: 'SET_STACKED_WIDGETS',
  setPdf: 'SET_PDF'
};

interface PdfState {
  imagesUrls: string | null;
  isGenerating: IsGenerating;
  orientation: Orientation;
  pdf: jsPDF | null;
  shouldFitPdf: boolean;
  stackedWidgets: boolean;
}

export const initialState: PdfState = {
  imagesUrls: null,
  isGenerating: {
    value: false,
    text: t('in-custom-dashboards:customDashboard.downloadPdfDialog.generatePreview')
  },
  orientation: 'landscape',
  pdf: null,
  shouldFitPdf: true,
  stackedWidgets: false
};

export function pdfReducer(state: PdfState, action: PdfAction): PdfState {
  const { type, payload } = action;

  switch (type) {
    case actions.setIsGenerating: {
      if (payload !== null && typeof payload === 'object') {
        const value = (payload as IsGenerating)?.value;
        const text = getGeneratingText(payload as IsGenerating);
        return {
          ...state,
          isGenerating: {
            ...payload,
            value,
            text
          }
        };
      }
      return state;
    }

    case actions.setOrientation: {
      return { ...state, orientation: payload as PdfState['orientation'] };
    }

    case actions.setShouldFitPdf: {
      return { ...state, shouldFitPdf: payload as PdfState['shouldFitPdf'] };
    }

    case actions.setImagesUrls: {
      return { ...state, imagesUrls: payload as PdfState['imagesUrls'] };
    }

    case actions.setPdf: {
      return { ...state, pdf: payload as PdfState['pdf'] };
    }

    case actions.setStackedWidgets: {
      return { ...state, stackedWidgets: payload as PdfState['stackedWidgets'] };
    }

    default:
      return state;
  }
}

function getGeneratingText(payload: IsGenerating) {
  let text = t('in-custom-dashboards:customDashboard.downloadPdfDialog.generatePreview');

  if (payload.value) {
    text = t('in-custom-dashboards:customDashboard.downloadPdfDialog.generatingPreview');
  }

  if ('text' in payload && payload.text !== undefined) {
    text = (payload as IsGenerating).text ?? '';
  }

  return text;
}
