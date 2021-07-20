/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */
import { HighLightTerm } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/HighLightTerm';

describe('in-alerting/smart-alerts/applications/chart/ChartEntitySelector/HighLightTerm', () => {
  it('should only render the text when no term was specified', () => {
    let sampleText = 'This is an example text.';
    expect(HighLightTerm({ text: sampleText })).toMatchInlineSnapshot(`
      <div>
        This is an example text.
      </div>
    `);
  });
  it('should surround the specified term with <strong/>', () => {
    let sampleText = 'This is an example text.';
    expect(HighLightTerm({ text: sampleText, term: 'x' })).toMatchInlineSnapshot(`
      <div>
        <span>
          This is an e
        </span>
        <strong>
          x
        </strong>
        <span>
          ample te
        </span>
        <strong>
          x
        </strong>
        <span>
          t.
        </span>
      </div>
    `);
  });
});
