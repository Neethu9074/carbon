/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { IconButton } from '@instana/components';

import './DownloadButton.less';

const block = 'in-download-button';
interface Props {
  className: string;
  children: ReactNode[];
}
export default class extends React.Component<Props> {
  static displayName = 'DownloadButton';

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
        <IconButton
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
