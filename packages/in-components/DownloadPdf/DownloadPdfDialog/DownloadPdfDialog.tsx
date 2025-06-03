/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useReducer, useCallback } from 'react';

import { Stack, StackItem, RadioButton, Button, Checkbox } from '@instana/components';

import {
  DOWNLOAD_PDF_DISPLAY,
  DOWNLOAD_PDF_FINISH,
  DOWNLOAD_PDF_GENERATE_PREVIEW,
  DOWNLOAD_PDF_LAYOUT,
  DOWNLOAD_PDF_ORIENTATION
} from 'in-services/tracking/tracking';
import IndeterminateLoadingIndicator from 'in-components/LoadingIndicators/IndeterminateLoadingIndicator';
import { actions, initialState, pdfReducer } from 'in-components/DownloadPdf/DownloadPdfDialog/reducer';
import { generateImagesFromNodes } from 'in-components/DownloadPdf/utils/generateImagesFromNodes';
import { generateImageFromNode } from 'in-components/DownloadPdf/utils/generateImageFromNode';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import CancelButton from 'in-components/form/CancelButton';
import { imagesToPdf } from 'in-services/util/imagesToPdf';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import Divider from 'in-components/workspace/Divider';
import Header from 'in-components/workspace/Header';
import Actions from 'in-components/Dialog/Actions';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from 'in-components/DownloadPdf/DownloadPdfDialog/DownloadPdfDialog.mless';

interface Props {
  node: HTMLElement;
  id: string;
  filename?: string;
  headerUrl?: string;
  sanitize?: (node: Node) => boolean;
  close: () => void;
  isStackWidgets?: boolean;
}

export default function DownloadPdfDialog({
  id,
  filename,
  close,
  node,
  headerUrl,
  sanitize,
  isStackWidgets = true
}: Readonly<Props>) {
  const [state, dispatch] = useReducer(pdfReducer, initialState);
  const { trackCta } = useSegmentTracking();

  const {
    pdf,
    imagesUrls,
    orientation,
    shouldFitPdf,
    stackedWidgets,
    isGenerating: { value, text }
  } = state;
  const pdfBlob = pdf ? URL.createObjectURL(pdf.output('blob')) : '';
  const { setIsGenerating, setPdf, setImagesUrls, setStackedWidgets, setOrientation, setShouldFitPdf } = actions;

  // Function that will dispatch the generation of the images to be added in the pdf.
  const dispatchGenerateImagesFromNodes = useCallback(async () => {
    dispatch({ type: setPdf, payload: null });
    dispatch({ type: setIsGenerating, payload: { value: true } });

    // If stacked, generates an image for each node.
    if (stackedWidgets) {
      generateImagesFromNodes([...node.childNodes] as HTMLElement[], setIsGenerating, dispatch, sanitize).then(
        imageUrl => dispatch({ type: setImagesUrls, payload: imageUrl })
      );
    } else {
      // It generates one single image from the node.
      generateImageFromNode({ node }).then(imageUrl => dispatch({ type: setImagesUrls, payload: [imageUrl] }));
    }
  }, [node, sanitize, setImagesUrls, setIsGenerating, setPdf, stackedWidgets]);

  const createPdf = useCallback(
    (imagesUrls, headerUrl, id) =>
      imagesToPdf({
        imageScale: stackedWidgets ? 1 : 2,
        imagesUrls,
        headerUrl,
        filename: id,
        shouldFitPdf,
        shouldDownloadAfterGeneration: false,
        pdfSettings: {
          orientation
        }
      }).then(({ onfulfilled, pdf }) => {
        if (onfulfilled) {
          dispatch({ type: setPdf, payload: pdf });
          dispatch({ type: setIsGenerating, payload: { value: false } });
        }
      }),
    [stackedWidgets, shouldFitPdf, orientation, setPdf, setIsGenerating]
  );

  useEffect(() => {
    if (value && node) {
      if (!imagesUrls || imagesUrls.length === 0) {
        dispatchGenerateImagesFromNodes();
      } else {
        createPdf(imagesUrls, headerUrl, id);
      }
    }
  }, [id, value, node, imagesUrls, stackedWidgets, headerUrl, createPdf, dispatchGenerateImagesFromNodes]);

  return (
    <Dialog title={t('in-components:downloadPdf.downloadPdfFile')} onClose={close} className={locals.dialog}>
      <Stack gap="large">
        <StackItem>
          <Stack gap="normal">
            <Header>{t('in-components:downloadPdf.settings')}</Header>
            <Sections>
              <Section title={t('in-components:downloadPdf.pdfOrientation')}>
                <div className={locals.row}>
                  <Stack direction="horizontal">
                    <RadioButton
                      key="landscape"
                      label={t('in-components:downloadPdf.landscape')}
                      checked={orientation === 'landscape'}
                      onChange={() => {
                        dispatch({ type: setPdf, payload: null });
                        dispatch({ type: setIsGenerating, payload: { value: false } });
                        dispatch({ type: setOrientation, payload: 'landscape' });
                        trackCta(DOWNLOAD_PDF_ORIENTATION, { orientation: 'landscape' });
                      }}
                    />
                    <RadioButton
                      key="portrait"
                      label={t('in-components:downloadPdf.portrait')}
                      checked={orientation === 'portrait'}
                      onChange={() => {
                        dispatch({ type: setPdf, payload: null });
                        dispatch({ type: setIsGenerating, payload: { value: false } });
                        dispatch({ type: setOrientation, payload: 'portrait' });
                        trackCta(DOWNLOAD_PDF_ORIENTATION, { orientation: 'portrait' });
                      }}
                    />
                  </Stack>
                </div>
              </Section>
            </Sections>
            <Sections>
              <Section title={t('in-components:downloadPdf.pdfLayout')}>
                <div className={locals.row}>
                  <Stack direction="horizontal">
                    <RadioButton
                      key="single-page"
                      label={t('in-components:downloadPdf.singlePage')}
                      explanation={t('in-components:downloadPdf.singlePageInfo')}
                      checked={shouldFitPdf}
                      onChange={() => {
                        dispatch({ type: setPdf, payload: null });
                        dispatch({ type: setShouldFitPdf, payload: true });
                        dispatch({ type: setIsGenerating, payload: { value: false } });
                        dispatch({ type: setStackedWidgets, payload: false });
                        dispatch({ type: setImagesUrls, payload: null });
                        trackCta(DOWNLOAD_PDF_LAYOUT, { shouldFitPdf: true });
                      }}
                    />
                    <RadioButton
                      key="multiple-pages"
                      label={t('in-components:downloadPdf.multiPages')}
                      explanation={t('in-components:downloadPdf.multiPagesInfo')}
                      checked={!shouldFitPdf}
                      onChange={() => {
                        dispatch({ type: setPdf, payload: null });
                        dispatch({ type: setShouldFitPdf, payload: false });
                        trackCta(DOWNLOAD_PDF_LAYOUT, { shouldFitPdf: false, multiplePages: true });
                      }}
                    />
                  </Stack>
                </div>
              </Section>
            </Sections>
            {isStackWidgets && (
              <Sections>
                <Section title={t('in-components:downloadPdf.widgetsDisplay')}>
                  <div className={locals.row}>
                    <Stack direction="horizontal">
                      <Checkbox
                        key="stack-vertically"
                        label={t('in-components:downloadPdf.stackWidgetsTitle')}
                        checked={stackedWidgets}
                        explanation={t('in-components:downloadPdf.stackWidgetsInfo')}
                        onChange={() => {
                          dispatch({ type: setIsGenerating, payload: { value: false } });
                          dispatch({ type: setPdf, payload: null });
                          dispatch({ type: setShouldFitPdf, payload: stackedWidgets });
                          dispatch({ type: setImagesUrls, payload: null });
                          dispatch({ type: setStackedWidgets, payload: !stackedWidgets });
                          trackCta(DOWNLOAD_PDF_DISPLAY, { stackedWidgets: !stackedWidgets });
                        }}
                      />
                    </Stack>
                  </div>
                </Section>
              </Sections>
            )}
          </Stack>
        </StackItem>
        <Divider />
        <div className={locals.preview}>
          <Stack gap="normal">
            <Header>{t('in-components:downloadPdf.preview')}</Header>
            <Stack gap="normal" align="center">
              <Button
                kind="secondary"
                disabled={value}
                icon={value ? 'lib_actions_loading' : undefined}
                iconSpinning={value}
                onClick={() => {
                  dispatch({ type: setIsGenerating, payload: { value: true } });
                  trackCta(DOWNLOAD_PDF_GENERATE_PREVIEW, { isGenerating: true });
                }}
              >
                {text}
              </Button>
              {value && <IndeterminateLoadingIndicator />}
              {pdf && <iframe width="100%" height="600" src={pdfBlob} title={id || filename} />}
            </Stack>
          </Stack>
        </div>
      </Stack>
      <Actions>
        <CancelButton onClick={close} />
        <Button
          disabled={!(pdf && pdfBlob)}
          onClick={() => {
            pdf?.save(`${filename ?? id}.pdf`);
            trackCta(DOWNLOAD_PDF_FINISH, { id });
            close();
          }}
        >
          {t('in-components:downloadPdf.downloadPdfFile')}
        </Button>
      </Actions>
    </Dialog>
  );
}
