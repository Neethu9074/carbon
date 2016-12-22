import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';
import Button from 'in-components/Button';

import './DownloadView.less';


const block = 'in-metric-chart-download-view';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'DownloadView',

  propTypes: {
    jsonLink: rpt.string,
    getJsonData: rpt.func,
    getCsvData: rpt.func,
    fileName: rpt.string,
    data: rpt.any
  },

  render() {
    const data = this.props.data;
    if (!data) {
      return (
        <LoadingIndicator type='dark'
                          inline />
      );
    }

    return (
      <div>
        <a ref={link => this.downloadLink = link}
           onClick={stopPropagation} />
        <div className={block}>
          {this.props.getCsvData ?
            <DownloadButtonCsv onClick={(fileType) => this.downloadFile(this.props.getCsvData, fileType)} />
          : null}
          {this.props.getJsonData ?
            <DownloadButtonJson onClick={(fileType) => this.downloadFile(this.props.getJsonData, fileType)} />
          : null}
          {this.props.jsonLink ?
            <DownloadLink label='Download (*.json)'
                          href={this.props.jsonLink} />
          : null}
        </div>
      </div>
    );
  },

  downloadFile(transformData, fileType) {
    this.downloadLink.setAttribute('href', `data:text/${fileType};charset=utf-8,${encodeURIComponent(transformData(this.props.data))}`);
    this.downloadLink.setAttribute('download', `${this.props.fileName}.${fileType}`);
    this.downloadLink.click();
  }
});

function stopPropagation(e) {
  e.stopPropagation();
}

function DownloadButtonCsv({onClick}) {
  return (
    <DownloadButton label={'Download (*.csv)'}
                    onClick={() => onClick('csv')} />
  );
}

function DownloadButtonJson({onClick}) {
  return (
    <DownloadButton label={'Download (*.json)'}
                    onClick={() => onClick('json')} />
  );
}

function DownloadButton({label, onClick}) {
  return (
    <Button key={label}
            className={`${block}__button`}
            kind='secondary'
            size='sm'
            onClick={onClick}>
      {label}
    </Button>
  );
}

function DownloadLink({label, href}) {
  return (
    <Button key={label}
            className={`${block}__button`}
            kind='secondary'
            size='sm'
            target='_blank'
            href={href}>
      {label}
    </Button>
  );
}
