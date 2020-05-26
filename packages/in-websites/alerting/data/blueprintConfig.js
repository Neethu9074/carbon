import { availableFilterTags, commonFilterTags } from 'in-websites/tags';

const slowness = 'slowness';
const specificStatusCode = 'statusCode';
const specificJsError = 'specificJsError';

export const alertTypes = Object.freeze({ specificJsError, slowness, specificStatusCode });

export const blueprintConfig = Object.freeze([
  {
    type: slowness,
    name: 'Slowness',
    blacklistedTagFilters: ['beacon.duration'],
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
    type: specificJsError,
    name: 'JS Errors',
    blacklistedTagFilters: ['beacon.error.message'],
    headline: 'Automatic Alerts for JS Errors',
    text: 'Receive an alert every time when matching JS Error messages occur more often than usual.'
  },
  {
    type: specificStatusCode,
    name: 'HTTP Status Codes',
    blacklistedTagFilters: ['beacon.http.status'],
    headline: 'Automatic Alerts for HTTP Status Codes',
    text: 'Receive an alert every time when matching HTTP Status Codes occur more often than usual.'
  }
]);

export const availableTagFiltersPerAlertType = {
  [specificJsError]: commonFilterTags,
  [slowness]: availableFilterTags.pageLoad,
  [specificStatusCode]: availableFilterTags.httpRequest
};

export function blacklistedTagFiltersOfAlertType(type) {
  const config = blueprintConfig.find(blueprint => blueprint.type === type);
  if (config) {
    return [...config.blacklistedTagFilters];
  }
  return [];
}
