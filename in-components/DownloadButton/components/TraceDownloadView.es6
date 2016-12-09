import irpt from 'react-immutable-proptypes';
import React from 'react';

import Button from 'in-components/Button';

import './TraceDownloadView.less';


const block = 'in-trace-download-view';

export default React.createClass({

  displayName: 'TraceDownloadView',

  propTypes: {
    trace: irpt.map.isRequired
  },

  render() {
    let trace = this.props.trace;
    return (
      <div className={block}>
        <a ref={link => this.downloadLink = link}
           onClick={stopPropagation} />
        <Button className={`${block}__download-button`}
                kind='secondary'
                size='sm'
                onClick={e => this.onDownloadClick(e, trace)}>
          Download (*.json)
        </Button>
      </div>
    );
  },

  onDownloadClick(e, trace) {
    e.stopPropagation();
    this.downloadLink.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trace.toJS(), null, 4)));
    this.downloadLink.setAttribute('download', `trace-${trace.get('traceId')}.json`);
    this.downloadLink.click();
  }
});

function stopPropagation(e) {
  e.stopPropagation();
}
