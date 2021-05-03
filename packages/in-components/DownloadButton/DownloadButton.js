/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import './DownloadButton.less';

const block = 'in-download-button';

export default class extends React.Component {
  static displayName = 'DownloadButton';

  static propTypes = {
    className: rpt.string,
    children: rpt.any
  };

  state = {
    isExpanded: false
  };

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
          type="lib_actions_download"
          color="#6b8088"
          onClick={() => this.setState({ isExpanded: !isExpanded })}
        />
        {isExpanded ? <div className={`${block}__popup`}>{this.props.children}</div> : null}
      </div>
    );
  }
}
