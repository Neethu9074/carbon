/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useMemo, useReducer, useCallback } from 'react';

import { Stack, StackItem, RadioButton, Button, Checkbox } from '@instana/components';

import {
  DOWNLOAD_PDF_DISPLAY,
  DOWNLOAD_PDF_FINISH,
  DOWNLOAD_PDF_GENERATE_PREVIEW,
  DOWNLOAD_PDF_LAYOUT,
  DOWNLOAD_PDF_ORIENTATION
} from 'in-services/tracking/tracking';
import {
  sanitizeNode,
  generateImagesFromNodes,
  getPdfHeader
} from 'in-custom-dashboards/CustomDashboard/DownloadPdfDialog/utils';
import { actions, initialState, pdfReducer } from 'in-custom-dashboards/CustomDashboard/DownloadPdfDialog/reducer';
import IndeterminateLoadingIndicator from 'in-components/LoadingIndicators/IndeterminateLoadingIndicator';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import CancelButton from 'in-components/form/CancelButton';
import { nodeToImage } from 'in-services/util/nodeToImage';
import { imagesToPdf } from 'in-services/util/imagesToPdf';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import Divider from 'in-components/workspace/Divider';
import Header from 'in-components/workspace/Header';
import Actions from 'in-components/Dialog/Actions';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/CustomDashboard/DownloadPdfDialog/DownloadPdfDialog.mless';

interface Props {
  node: HTMLElement;
  header?: HTMLElement;
  customDashboardId: string;
  close: () => void;
}

export default function DownloadPdfDialog({ customDashboardId, close, node, header }: Readonly<Props>) {
  const [state, dispatch] = useReducer(pdfReducer, initialState);
  const { trackCta } = useSegmentTracking();

  const {
    imagesUrls,
    headerUrl,
    isGenerating: { value, text },
    orientation,
    pdf,
    shouldFitPdf,
    stackedWidgets
  } = state;
  const { setIsGenerating, setPdf, setHeaderUrl, setImagesUrls, setStackedWidgets, setOrientation, setShouldFitPdf } =
    actions;
  const pdfBlob = pdf ? URL.createObjectURL(pdf.output('blob')) : '';

  const getImagesUrls = useMemo(
    () => async (node: HTMLElement) =>
      await nodeToImage({
        node,
        options: {
          filter: node => sanitizeNode(node)
        }
      }).then(imageUrl => dispatch({ type: setImagesUrls, payload: [imageUrl] })),
    [setImagesUrls]
  );

  const getImagesFromNodes = useMemo(
    () => async (nodes: HTMLElement[]) =>
      await generateImagesFromNodes(nodes, setIsGenerating, dispatch).then(imageUrl =>
        dispatch({ type: setImagesUrls, payload: imageUrl })
      ),
    [setImagesUrls, setIsGenerating]
  );

  const generateImageFromNode = useCallback(() => {
    dispatch({ type: setPdf, payload: null });
    dispatch({ type: setIsGenerating, payload: { value: true } });

    // Generate pdf header image
    // Header url will be available in headerUrl variable.
    if (header) {
      getPdfHeader({
        node: header,
        dispatch: (headerUrl: string) => dispatch({ type: setHeaderUrl, payload: headerUrl })
      });
    }

    if (stackedWidgets) {
      getImagesFromNodes([...node.childNodes] as HTMLElement[]);
    } else {
      getImagesUrls(node);
    }
  }, [getImagesFromNodes, getImagesUrls, header, node, setHeaderUrl, setIsGenerating, setPdf, stackedWidgets]);

  const createPdf = useCallback(
    (imagesUrls, headerUrl, customDashboardId) =>
      imagesToPdf({
        imageScale: stackedWidgets ? 1 : 2,
        imagesUrls,
        headerUrl,
        filename: customDashboardId,
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
        generateImageFromNode();
      } else {
        createPdf(imagesUrls, headerUrl, customDashboardId);
      }
    }
  }, [value, node, imagesUrls, stackedWidgets, generateImageFromNode, createPdf, customDashboardId, headerUrl]);

  return (
    <Dialog
      title={t('in-custom-dashboards:customDashboard.downloadPdfDialog.downloadPdf')}
      onClose={close}
      className={locals.dialog}
    >
      <Stack gap="large">
        <StackItem>
          <Stack gap="normal">
            <Header>{t('in-custom-dashboards:customDashboard.downloadPdfDialog.settings')}</Header>
            <Sections>
              <Section title={t('in-custom-dashboards:customDashboard.downloadPdfDialog.pdfOrientation')}>
                <div className={locals.row}>
                  <Stack direction="horizontal">
                    <RadioButton
                      key="landscape"
                      label={t('in-custom-dashboards:customDashboard.downloadPdfDialog.landscape')}
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
                      label={t('in-custom-dashboards:customDashboard.downloadPdfDialog.portrait')}
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
              <Section title={t('in-custom-dashboards:customDashboard.downloadPdfDialog.pdfLayout')}>
                <div className={locals.row}>
                  <Stack direction="horizontal">
                    <RadioButton
                      key="single-page"
                      label={t('in-custom-dashboards:customDashboard.downloadPdfDialog.singlePage')}
                      explanation={t('in-custom-dashboards:customDashboard.downloadPdfDialog.singlePageInfo')}
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
                      label={t('in-custom-dashboards:customDashboard.downloadPdfDialog.multiPages')}
                      explanation={t('in-custom-dashboards:customDashboard.downloadPdfDialog.multiPagesInfo')}
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
            <Sections>
              <Section title={t('in-custom-dashboards:customDashboard.downloadPdfDialog.widgetsDisplay')}>
                <div className={locals.row}>
                  <Stack direction="horizontal">
                    <Checkbox
                      key="stack-vertically"
                      label={t('in-custom-dashboards:customDashboard.downloadPdfDialog.stackWidgetsTitle')}
                      checked={stackedWidgets}
                      explanation={t('in-custom-dashboards:customDashboard.downloadPdfDialog.stackWidgetsInfo')}
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
          </Stack>
        </StackItem>
        <Divider />
        <div className={locals.preview}>
          <Stack gap="normal">
            <Header>{t('in-custom-dashboards:customDashboard.widgetEditorDialog.widgetPreview.preview')}</Header>
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
              {pdf && <iframe width="100%" height="600" src={pdfBlob} />}
            </Stack>
          </Stack>
        </div>
      </Stack>
      <Actions>
        <CancelButton onClick={close} />
        <Button
          disabled={!(pdf && pdfBlob)}
          onClick={() => {
            pdf?.save(`${customDashboardId}.pdf`);
            trackCta(DOWNLOAD_PDF_FINISH, { customDashboardId });
            close();
          }}
        >
          {t('in-custom-dashboards:customDashboard.downloadPdfDialog.downloadPdf')}
        </Button>
      </Actions>
    </Dialog>
  );
}
