import React from 'react';

import HelpParagraph from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Config/HelpParagraph';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getEumSnippet } from 'in-services/eum';
import Code from 'in-components/Code';

export default function TrackingScript({ snapshot }) {
  return (
    <DashboardTile title="Tracking Script">
      <HelpParagraph>
        The following tracking script is all you need to get started with website monitoring. Copy this script to the
        HTML {`document's`} <code>{'<head>'}</code>. information about page monitoring and the full capabilities of the
        tracking script are located{' '}
        <a href="https://docs.instana.io/products/website_monitoring/" rel="noopener noreferrer" target="_blank">
          within our docs
        </a>.
      </HelpParagraph>
      <Code code={getEumSnippet({ key: snapshot.getIn(['data', 'eumKey']) })} lang="html" showLineNumbers={false} />
    </DashboardTile>
  );
}
