import rpt from 'prop-types';
import React from 'react';

import { rename, remove } from 'in-views/configurationView/subview/EumKeys/stores/keys';
import EditableTextInput from 'in-components/EditableTextInput/EditableTextInput';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import RightAlignment from 'in-components/layout/RightAlignment';
import { isOnPremise } from 'in-services/config';
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
    const apiKey = this.props.apiKey;
    const name = this.state.appName;

    const snippet = getEumSnippet(apiKey);

    return (
      <div className={block}>
        <DescriptionList>
          <DescriptionItem title="App name">
            <EditableTextInput text={name} onSave={this.saveName} />
          </DescriptionItem>
          <DescriptionItem title="API key">
            {apiKey}
          </DescriptionItem>
          <DescriptionItem title="Tracking code">
            <Code code={snippet} lang="html" showLineNumbers={false} wrapperClassName={`${block}__tracking-code`} />
          </DescriptionItem>
        </DescriptionList>

        <RightAlignment>
          <CopyToClipboardButton getText={() => snippet}>
            Copy tracking code to clipboard
          </CopyToClipboardButton>
          <Button size="sm" kind="danger" className={`${block}__remove`} onClick={() => remove(apiKey, name)}>
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

function getEumSnippet(apiKey) {
  if (isOnPremise()) {
    return `
<script>
  // Note: Replace the <trackingBaseUrl> with the base URL under which you proxy
  // the Instana eumtracer (note that this needs to be replaced two times in this snippet).

  (function(i,s,o,g,r,a,m){i['InstanaEumObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','<trackingBaseUrl>/eum.min.js','ineum');

  ineum('apiKey', '${apiKey}');
  ineum('reportingUrl', '<trackingBaseUrl>');

  // set the name of a page on which this load/errors/calls happened
  // ineum('page', 'product-details');

  // Backend trace ID to facilitate correlation of frontend/backend traces.
  // Trace ID is available in backend to user code.
  // User is himself responsible for embedding this trace ID in this snippet.
  // ineum('traceId', '<backend trace id>');

  // free form key/value pairs for advanced end-user tracking
  // ineum('meta', 'user', 'tom.mason@example.com');
</script>`.trim();
  }

  return `
<script>
  (function(i,s,o,g,r,a,m){i['InstanaEumObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//eum.instana.io/eum.min.js','ineum');

  ineum('apiKey', '${apiKey}');

  // set the name of a page on which this load/errors/calls happened
  // ineum('page', 'product-details');

  // Backend trace ID to facilitate correlation of frontend/backend traces.
  // Trace ID is available in backend to user code.
  // User is himself responsible for embedding this trace ID in this snippet.
  // ineum('traceId', '<backend trace id>');

  // free form key/value pairs for advanced end-user tracking
  // ineum('meta', 'user', 'tom.mason@example.com');
</script>`.trim();
}
