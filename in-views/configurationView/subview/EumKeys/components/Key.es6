import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {remove} from 'in-views/configurationView/subview/EumKeys/stores/keys';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import RightAlignment from 'in-components/layout/RightAlignment';
import Button from 'in-components/Button';
import Code from 'in-components/Code';

import './Key.less';

const block = 'in-eum-keys-config-key';

export default function Key({name, apiKey}) {
  const snippet = getEumSnippet(apiKey);

  return (
    <div className={block}>
      <DescriptionList>
        <DescriptionItem title='App name'>
          {name}
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
}


function getEumSnippet(apiKey) {
  return `
<script>
  (function(i,s,o,g,r,a,m){i['InstanaEumObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//eum.instana.io/eum.min.js','ineum');

  ineum('apiKey', '${apiKey}');
</script>`.trim();
}
