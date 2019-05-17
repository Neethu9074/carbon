import React, { Fragment } from 'react';

import Deprecation from 'in-websites/WebsiteDashboard/components/Deprecations/Deprecation';
import Code from 'in-components/Code';

const fallbackCode = `
if (isBlank(page) && isNotBlank(meta.edw_page_name)) {
  page = meta.edw_page_name;
  if (isNotBlank(meta.environment)) {
    page += "_" + meta.environment;
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
  const firstParagraph = (
    <Fragment>
      Within the last twelve hours we received data that had to be processed with fallback logic, which is now
      deprecated in favor of a first-class API for the definition of pages. To define pages via the intended API, the
      necessary changes look like this:
    </Fragment>
  );
  return (
    <Deprecation title="Deprecated Page Definition" preview={firstParagraph} supportedUntil="2019-06-01">
      <p>{firstParagraph}</p>
      <Code code={newCodeToUse} lang="javascript" showLineNumbers={false} />
      <p style={{ margin: '1.3rem 0 1rem' }}>For your reference, the deprecated fallback logic looks like this:</p>
      <Code code={fallbackCode} lang="java" showLineNumbers={false} />
    </Deprecation>
  );
}
