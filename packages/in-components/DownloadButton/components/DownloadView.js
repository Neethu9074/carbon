/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import rpt from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import Button from 'in-new-components/Button';

import './DownloadView.less';

const block = 'in-metric-chart-download-view';

export default class extends React.Component {
  static displayName = 'DownloadView';

  static propTypes = {
    jsonLink: rpt.string,
    getJsonData: rpt.func,
    getCsvData: rpt.func,
    fileName: rpt.string,
    queryParams: rpt.object,
    data: rpt.any
  };

  render() {
    const data = this.props.data;
    if (!data) {
      return <LoadingIndicator inline />;
    }

    return (
      <div>
        <a ref={link => (this.downloadLink = link)} onClick={stopPropagation} />
        <div className={block}>
          {this.props.getCsvData ? (
            <DownloadButtonCsv onClick={fileType => this.downloadFile(this.props.getCsvData, fileType)} />
          ) : null}
          {this.props.getJsonData ? (
            <DownloadButtonJson onClick={fileType => this.downloadFile(this.props.getJsonData, fileType)} />
          ) : null}
          {this.props.jsonLink ? (
            <DownloadLink
              label={t('in-components:downloadBtn.downloadViewDownloadAsJsonLabel')}
              href={formatUrl(this.props.jsonLink, this.props.queryParams)}
            />
          ) : null}
        </div>
      </div>
    );
  }

  downloadFile = (transformData, fileType) => {
    this.downloadLink.setAttribute(
      'href',
      `data:text/${fileType};charset=utf-8,${encodeURIComponent(transformData(this.props.data))}`
    );
    this.downloadLink.setAttribute('download', `${this.props.fileName}.${fileType}`);
    this.downloadLink.click();
  };
}

function formatUrl(url, queryParams = {}) {
  let query = Object.keys(queryParams)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(queryParams[k]))
    .join('&');

  if (query.length > 0) {
    query = '?' + query;
  }

  return url + query;
}

function stopPropagation(e) {
  e.stopPropagation();
}

function DownloadButtonCsv({ onClick }) {
  return (
    <DownloadButton
      label={t('in-components:downloadBtn.downloadViewDownloadCSVLabel')}
      onClick={() => onClick('csv')}
    />
  );
}

function DownloadButtonJson({ onClick }) {
  return (
    <DownloadButton
      label={t('in-components:downloadBtn.downloadViewDownloadJsonLabel')}
      onClick={() => onClick('json')}
    />
  );
}

function DownloadButton({ label, onClick }) {
  return (
    <Button key={label} className={`${block}__button`} kind="info" onClick={onClick}>
      {label}
    </Button>
  );
}

function DownloadLink({ label, href }) {
  return (
    <Button key={label} className={`${block}__button`} kind="info" target="_blank" href={href}>
      {label}
    </Button>
  );
}
