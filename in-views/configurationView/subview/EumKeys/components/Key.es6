import rpt from 'prop-types';
import React from 'react';

import { rename, remove } from 'in-views/configurationView/subview/EumKeys/stores/keys';
import EditableTextInput from 'in-components/EditableTextInput/EditableTextInput';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import RightAlignment from 'in-components/layout/RightAlignment';
import { getEumSnippet } from 'in-services/eum';
import Button from 'in-components/Button';
import Code from 'in-components/Code';

import './Key.less';

const block = 'in-eum-keys-config-key';

export default class extends React.Component {
  static displayName = 'Key';

  static propTypes = {
    apiKey: rpt.string.isRequired,
    name: rpt.string.isRequired
  };

  state = {
    appName: this.props.name
  };

  render() {
    const key = this.props.apiKey;
    const name = this.state.appName;

    const snippet = getEumSnippet({
      key,
      additionalScript: `
// set the name of a page on which this load/errors/calls happened
// ineum('page', 'product-details');

// Backend trace ID to facilitate correlation of frontend/backend traces.
// Trace ID is available in backend to user code.
// User is himself responsible for embedding this trace ID in this snippet.
// ineum('traceId', '<backend trace id>');

// free form key/value pairs for advanced end-user tracking
// ineum('meta', 'user', 'tom.mason@example.com');`
    });

    return (
      <div className={block}>
        <DescriptionList>
          <DescriptionItem title="App name">
            <EditableTextInput text={name} onSave={this.saveName} />
          </DescriptionItem>
          <DescriptionItem title="API key">{key}</DescriptionItem>
          <DescriptionItem title="Tracking code">
            <Code code={snippet} lang="html" showLineNumbers={false} wrapperClassName={`${block}__tracking-code`} />
          </DescriptionItem>
        </DescriptionList>

        <RightAlignment>
          <CopyToClipboardButton getText={() => snippet}>Copy tracking code to clipboard</CopyToClipboardButton>
          <Button size="sm" kind="danger" className={`${block}__remove`} onClick={() => remove(key, name)}>
            Remove
          </Button>
        </RightAlignment>
      </div>
    );
  }

  saveName = appName => {
    const apiKey = this.props.apiKey;

    if (apiKey && appName && appName.length > 0) {
      rename(apiKey, appName, () => this.setState({ appName }));
    }
  };
}
