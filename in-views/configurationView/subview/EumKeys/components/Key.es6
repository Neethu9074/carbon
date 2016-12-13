import {create} from 'reactive-observables';
import React from 'react';

import {rename, remove} from 'in-views/configurationView/subview/EumKeys/stores/keys';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import RightAlignment from 'in-components/layout/RightAlignment';
import Button from 'in-components/Button';
import Code from 'in-components/Code';

import './Key.less';


const block = 'in-eum-keys-config-key';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'Key',

  propTypes: {
    apiKey: rpt.string.isRequired,
    name: rpt.string.isRequired
  },

  getInitialState() {
    return {
      appName: this.props.name,
      isSuccess: false
    };
  },

  componentWillMount() {
    this.onSuccess$ = create();

    this.subscription = this.onSuccess$
      .filter(val => val != null)
      .debounce(1000)
      .subscribe(() => this.onSuccess$.emit(null));

    this.subscription2 = this.onSuccess$.subscribe(e => this.setState({isSuccess: e}));
  },

  componentWillUnmount() {
    this.subscription.dispose();
    this.subscription = null;

    this.subscription2.dispose();
    this.subscription2 = null;
  },

  render() {
    const isSuccess = this.state.isSuccess;
    const apiKey = this.props.apiKey;
    const name = this.state.appName;

    const snippet = getEumSnippet(apiKey);

    return (
      <div className={block}>
        <DescriptionList>
          <DescriptionItem title='App name'>
            <div className={`${block}__eum-name-panel`}>
              <input type='text'
                     className={`in-input ${block}__eum-name`}
                     value={name}
                     onChange={e => this.setState({appName: e.target.value})} />
              <Button size='sm'
                      className={`${block}__save-button`}
                      kind={isSuccess ? 'success' : 'secondary'}
                      onClick={() => this.saveName(apiKey, name, () => this.onSuccess$.emit(true))}>
                {isSuccess ? 'Saved' : 'Save'}
              </Button>
            </div>
          </DescriptionItem>
          <DescriptionItem title='API key'>
            {apiKey}
          </DescriptionItem>
          <DescriptionItem title='Tracking code'>
            <Code code={snippet}
                  lang='html'
                  showLineNumbers={false}
                  wrapperClassName={`${block}__tracking-code`} />
          </DescriptionItem>
        </DescriptionList>

        <RightAlignment>
          <CopyToClipboardButton getText={() => snippet}>
            Copy tracking code to clipboard
          </CopyToClipboardButton>
          <Button size='sm'
                  kind='danger'
                  className={`${block}__remove`}
                  onClick={() => remove(apiKey)}>
            Remove
          </Button>
        </RightAlignment>
      </div>
    );
  },

  saveName(apiKey, appName, onSuccess) {
    if (apiKey && appName && appName.length > 0) {
      rename(apiKey, appName, onSuccess);
    }
  }
});

function getEumSnippet(apiKey) {
  return `
<script>
  (function(i,s,o,g,r,a,m){i['InstanaEumObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//eum.instana.io/eum.min.js','ineum');

  ineum('apiKey', '${apiKey}');

  // Backend trace ID to facilitate correlation of frontend/backend traces.
  // Trace ID is available in backend to user code.
  // User is himself responsible for embedding this trace ID in this snippet.
  // ineum('traceId', '<backend trace id>');

  // free form key/value pairs for advanced end-user tracking
  ineum('meta', 'user', 'tom.mason@example.com');
</script>`.trim();
}
