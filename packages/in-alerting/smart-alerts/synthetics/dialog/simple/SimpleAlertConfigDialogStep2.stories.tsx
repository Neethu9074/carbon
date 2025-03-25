/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo, useState } from 'react';

import { TagCatalog } from '@instana/types';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import SimpleAlertConfigDialogStep2 from 'in-alerting/smart-alerts/synthetics/dialog/simple/SimpleAlertConfigDialogStep2';
import { createBoundedAlertQueryBuilderFactory } from 'in-alerting/smart-alerts/synthetics/components/AlertQueryBuilder';
import { Default as AlertConfigValue } from 'in-alerting/smart-alerts/synthetics/details/AlertConfiguration.stories';
import { tagSuggestionTimeConfig } from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialogWithThreshold';
import alertFormDefinition from 'in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition';
import * as TestDataCatalog from 'in-alerting/smart-alerts/synthetics/api/tagCatalog_test.json';
import { successObservableFactory } from 'in-services/util/result';

const getTagCatalogTest = successObservableFactory(TestDataCatalog as unknown as TagCatalog);

export default { component: SimpleAlertConfigDialogStep2 };

const alertConfig = AlertConfigValue.args.alertConfig;
const failureAlertConfig = Object.freeze(alertConfig);

export const Default = (args: AlertConfigDialogPresenterProps & MainDialogControl) => {
  const [form, updateForm] = useState(alertFormDefinition(failureAlertConfig));
  const { QueryBuilder } = useMemo(
    () => createBoundedAlertQueryBuilderFactory(getTagCatalogTest, tagSuggestionTimeConfig),
    []
  );

  return (
    <SimpleAlertConfigDialogStep2 {...args} form={form} updateForm={updateForm} QueryBuilderComponent={QueryBuilder} />
  );
};
