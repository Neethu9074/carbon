/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Item, MapForm } from 'formalistic';
import React, { ReactNode } from 'react';

import TriggersIncidentRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/TriggersIncidentRow';
import AlertDescriptionRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertDescriptionRow';
import AlertLevelRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertLevelRow';
import Sections from 'in-components/workspace/Sections';

interface AlertPropertiesProps {
  form: MapForm<any>;
  getDescriptionPlaceholder: (form: MapForm<any>) => string;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  renderAlertPropertiesTitleRow: () => ReactNode;
  isTearSheet?: boolean;
  shouldDisplayAlertLevelSelection?: boolean;
  descriptionPlaceholder?: { WARNING?: string; CRITICAL?: string };
}

export default function AlertProperties({
  form,
  getDescriptionPlaceholder,
  onChange,
  renderAlertPropertiesTitleRow,
  isTearSheet,
  shouldDisplayAlertLevelSelection = true,
  descriptionPlaceholder
}: AlertPropertiesProps): JSX.Element {
  return (
    <Sections>
      {renderAlertPropertiesTitleRow()}
      {shouldDisplayAlertLevelSelection && <AlertLevelRow onChange={onChange} form={form} isTearSheet={isTearSheet} />}
      <TriggersIncidentRow form={form} onChange={onChange} isTearSheet={isTearSheet} />
      <AlertDescriptionRow
        form={form}
        getDescriptionPlaceholder={getDescriptionPlaceholder}
        onChange={onChange}
        isTearSheet={isTearSheet}
        descriptionPlaceholder={descriptionPlaceholder?.WARNING ?? descriptionPlaceholder?.CRITICAL}
      />
    </Sections>
  );
}
