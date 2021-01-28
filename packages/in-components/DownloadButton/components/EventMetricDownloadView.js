/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import rpt from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import Button from 'in-new-components/Button';

import locals from './EventMetricDownloadView.mless';

export default class extends React.Component {
  static displayName = 'EventMetricDownloadView';

  static propTypes = {
    getJsonData: rpt.func,
    fileName: rpt.string
  };

  render() {
    const getJsonData = this.props.getJsonData;
    if (!getJsonData) {
      return null;
    }

    return (
      <div className={locals.downloadButtonWrapper}>
        <a ref={link => (this.downloadLink = link)} onClick={stopPropagation} />
        <DownloadButtonJson onClick={fileType => this.downloadFile(getJsonData, fileType)} />
      </div>
    );
  }

  downloadFile = (transformData, fileType) => {
    this.downloadLink.setAttribute(
      'href',
      `data:text/${fileType};charset=utf-8,${encodeURIComponent(transformData(this.props.getJsonData))}`
    );
    this.downloadLink.setAttribute('download', `${this.props.fileName}.${fileType}`);
    this.downloadLink.click();
  };
}

function stopPropagation(e) {
  e.stopPropagation();
}

function DownloadButtonJson({ onClick }) {
  return (
    <DownloadButton
      label={t('in-components:downloadBtn.eventMetricDownloadViewDownloadJsonLabel')}
      onClick={() => onClick('json')}
    />
  );
}

function DownloadButton({ label, onClick }) {
  return (
    <Button key={label} className={locals.button} kind="info" onClick={onClick}>
      {label}
    </Button>
  );
}
