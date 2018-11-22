import React from 'react';

import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/HelpParagraph';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { getEumSnippet } from 'in-services/eum';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';
import Code from 'in-components/Code';

export default function TrackingScript({ websiteId }) {
  const eumSnippet = getEumSnippet({ key: websiteId });

  return (
    <Card
      title="Tracking Script"
      header={
        <CopyToClipboard getText={() => eumSnippet}>
          {refSetter => (
            <Button kind="primaryv2" refSetter={refSetter}>
              Copy to clipboard
            </Button>
          )}
        </CopyToClipboard>
      }
    >
      <HelpParagraph>
        The following tracking script is all you need to get started with website monitoring. Copy this script to the
        HTML {`document's`} <code>{'<head>'}</code>. Information about page monitoring and the full capabilities of the
        tracking script are located{' '}
        <a href="https://docs.instana.io/products/website_monitoring/" rel="noopener noreferrer" target="_blank">
          within our docs
        </a>
        .
      </HelpParagraph>

      <Code code={eumSnippet} lang="html" showLineNumbers={false} />
    </Card>
  );
}
