import rpt from 'prop-types';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import './DownloadButton.less';

const block = 'in-download-button';

export default React.createClass({
  displayName: 'DownloadLink',

  propTypes: {
    className: rpt.string,
    children: rpt.any
  },

  getInitialState() {
    return {
      isExpanded: false
    };
  },

  render() {
    const isExpanded = this.state.isExpanded;
    const className = this.props.className;

    let buttonClass = block;
    if (className) {
      buttonClass += ` ${className}`;
    }

    return (
      <div className={buttonClass}>
        <SvgIcon
          className={`${block}__icon`}
          type="download"
          width={14}
          height={14}
          color="#6b8088"
          onClick={() => this.setState({ isExpanded: !isExpanded })}
        />
        {isExpanded
          ? <div className={`${block}__popup`}>
              {this.props.children}
            </div>
          : null}
      </div>
    );
  }
});
