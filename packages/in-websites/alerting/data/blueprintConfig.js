import { availableFilterTags, commonFilterTags } from 'in-websites/tags';

export const alertTypes = Object.freeze({
  specificJsError: 'specificJsError',
  slowness: 'slowness',
  specificStatusCode: 'statusCode'
});

export const blueprintConfig = Object.freeze([
  {
    type: alertTypes.slowness,
    name: 'Slowness',
    headline: 'Automatic Alerts for onLoad Time',
    text: `
      <p>
      OnLoad Time measures the time passed in between the user navigating to a website and being able to interact with the website.
      </p>
      <ul>
        <li>Getting all markup, replaced element content and embeds from server</li>
        <li>Parsing the markup</li>
        <li>Applying CSS cascade</li>
        <li>Rendering the page</li>
        <li>Running all scripts that need to run on page load</li>
      <ul>
    `
  },
  {
    type: alertTypes.specificJsError,
    name: 'JS Errors',
    headline: 'Automatic Alerts for JS Errors',
    text: 'Receive an alert every time when matching JS Error messages occur more often than usual.'
  },
  {
    type: alertTypes.specificStatusCode,
    name: 'HTTP Status Codes',
    headline: 'Automatic Alerts for HTTP Status Codes',
    text: 'Receive an alert every time when matching HTTP Status Codes occur more often than usual.'
  }
]);

export const availableTagFiltersPerAlertType = {
  [alertTypes.specificJsError]: commonFilterTags,
  [alertTypes.slowness]: availableFilterTags.pageLoad,
  [alertTypes.specificStatusCode]: availableFilterTags.httpRequest
};
