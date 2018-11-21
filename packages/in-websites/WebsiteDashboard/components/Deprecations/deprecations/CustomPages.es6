import React from 'react';

import Deprecation from 'in-websites/WebsiteDashboard/components/Deprecations/Deprecation';
import Code from 'in-components/Code';

const fallbackCode = `
String page = null;

if (isBlank(page) && isNotBlank(meta.get("edw_page_name"))) {
  page = output.meta.get("edw_page_name");

  if (isNotBlank(meta.get("environment"))) {
    page += "_" + meta.get("environment");
  }
}
`.trim();

const newCodeToUse = `
// This is the old and deprecated way
ineum('meta', 'edw_page_name', 'some page name');

// This is the new way
ineum('page', 'some page name');
`.trim();

export default function CustomPages() {
  return (
    <Deprecation title="Pages Defined Via Fallback" supportedUntil="2019-06-01">
      <p>
        Within the last twelve hours we applied fallback logic for the definition of pages to some of the data which we
        received. This fallback logic is superseded by a first-class API for the definition of pages. Please define
        pages via the intended API instead of relying on the fallback logic. The necessary changes look like this:
      </p>
      <Code code={newCodeToUse} lang="javascript" showLineNumbers={false} />
      <p style={{ margin: '1rem 0 0.4rem' }}>For your reference, the deprecated fallback logic looks like this:</p>
      <Code code={fallbackCode} lang="java" showLineNumbers={false} />
    </Deprecation>
  );
}
