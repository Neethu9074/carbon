/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */

import { expect } from 'chai';

import { toHtml } from 'in-services/formatters/markdown';

describe('in-services.formatters.markdown', () => {
  it('should not fail on bad markdown types', () => {
    expect(toHtml(undefined)).to.equal('');
    expect(toHtml(null)).to.equal('');
    expect(toHtml(false)).to.equal('');
    expect(toHtml(true)).to.equal('');
    expect(toHtml(/yoMan/i)).to.equal('');
    expect(toHtml(new Date(42))).to.equal('');
  });

  it('should not fail on empty string', () => {
    expect(toHtml('')).to.equal('');
  });

  it('should turn markdown into html', () => {
    const markdown = `# This is a test

 - first important point
 - second important point

and a paragraph of text`;

    const html = `<h1>This is a test</h1>
<ul>
<li>first important point</li>
<li>second important point</li>
</ul>
<p>and a paragraph of text</p>
`;
    expect(toHtml(markdown)).to.equal(html);
  });

  it('should escape HTML', () => {
    const markdown = `# Escape test

<a href="you-no-escape">Rick James, bitch</a>`;

    const html = `<h1>Escape test</h1>
<p>&lt;a href=&quot;you-no-escape&quot;&gt;Rick James, bitch&lt;/a&gt;</p>
`;

    expect(toHtml(markdown)).to.equal(html);
  });

  it('should set link target to _blank', () => {
    const markdown = `[foo](/bar)`;
    const html = `<p><a href="/bar" target="_blank">foo</a></p>\n`;
    expect(toHtml(markdown)).to.equal(html);
  });
});
