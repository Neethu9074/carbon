import React from 'react';

import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import DropDownMock from 'in-custom-dashboards/widgets/Slo/components/DropDownMock';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import { noop } from 'in-services/util/function';

export default function ServicesSelectBox() {
  const timeConfig = useTimeConfig();
  const appNameTag = [{ name: 'application.name', operator: 'EQUALS', value: 'All Services', entity: 'DESTINATION' }];
  /*
  {"name":"application.name","value":"All Services","operator":"EQUALS","entity":"DESTINATION"}
    same as used here:
      <AnalyzeSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="service.name"
        singularLabel="Service"
        pluralLabel="Services"
        itemLabelRenderer={renderApplicationServiceEndpointItem('lib_application_service')}
        withoutTextTransform
      />
   */
  const serviceNameSuggestion$ = getTagSuggestions({
    filter: {
      timeConfig
    },
    tagFilters: getTagFilterListForBackendSubscription(appNameTag),
    tagName: 'service.name'
  }).map(mapSuggestionResult);

  const tagsResponse = useObservable(serviceNameSuggestion$, []);
  /* e.g.
  '{data: Array(64), time: 1597601448068, adjustedWindowSize: null, errors: Array(0), progress: {…}}
adjustedWindowSize: null
data: (64) ["/index.php", "9f47b3f4cb76.ngrok.io", "MySQL@3306 on demo-mysql", "PHP", "SDK", "acceptor", "api.eu.opsgenie.com", "api.mixpanel.com", "appdata-live-aggregator", "appdata-reader", "appdata-writer", "butler", "butlerdb", "cart", "catalogue", "catalogue", "catalogue-demo", "catalogue.robot-shop", "cf-test-app", "chat.om-ziel.de", "cities", "clickhouse", "discount", "discount-svc", "discountdb", "dispatch", "elasticsearch", "email-health-provider", "eum-acceptor", "eum-frontend", "eum-rating", "eum-ratings", "eum-release-fullstack-0-us-west-2.instana.io", "eum-shop", "global_us-east-1", "globalbackend.rainbowstable.instana.rocks", "groundskeeper", "instana-release-appdata-processor", "instana-release-issue-tracker", "instana-release-ui-backend", "jdbc", "js-stack-trace-translator", "localhost", "payment", "qa-instana", "random", "ratings", "ratings", "redis:6379", "release-fullstack-0-us-west-2.instana.io", "release-instana.instana.io", "robot-shop", "robotshop", "s3.amazonaws.com", "serverless-acceptor", "serverless-release-us-west-2.instana.io", "shipping", "tenantdb", "test-java-app", "ui-client", "user", "users", "www.google.com", "www.instana.com"]
errors: []
progress: {percentage: null, loading: false, note: null}
time: 1597601448068
__proto__: Object
   */
  const { progress, errors, data } = tagsResponse ?? pendingResult;

  const suggestions = data?.map(item => ({ value: item, label: item }));

  // TODO: improve error handling/presenting
  return (
    <>
      {!suggestions && !progress?.loading && !errors && (
        <DropDownMock options={[{ value: '', label: '<loading>' }]} disabled />
      )}
      {suggestions && (
        <DropDownMock
          options={[{ value: undefined, label: 'Please select' }, { value: '', label: 'All Services' }, ...suggestions]}
          value={undefined}
          onChange={noop}
        />
      )}
    </>
  );
}

function mapSuggestionResult(result) {
  if (!result.data) {
    return result;
  }
  return { ...result, data: result.data.suggestions };
}
