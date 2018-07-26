import React from 'react';

import { showRawData as showRawDataMatrixParameter } from 'in-analyze/navigation/matrix';
import RawDataOverlay from 'in-analyze/Analyze/components/RawDataOverlay/RawDataOverlay';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';

export default class extends React.Component {
  static displayName = 'RawDataOverlayMounter';

  constructor(props) {
    super(props);

    const showRawData = props[showRawDataMatrixParameter];
    if (showRawData) {
      setActiveDialog(<RawDataOverlay {...this.props} filterByGroup={showRawData} />);
    }
  }

  componentWillUpdate(nextProps) {
    const showRawDataPrevious = this.props[showRawDataMatrixParameter];
    const showRawData = nextProps[showRawDataMatrixParameter];
    if (showRawData) {
      setActiveDialog(<RawDataOverlay {...this.props} filterByGroup={showRawData} />);
    } else if (showRawDataPrevious) {
      close();
    }
  }

  componentWillUnmount() {
    close();
  }

  render() {
    return null;
  }
}
