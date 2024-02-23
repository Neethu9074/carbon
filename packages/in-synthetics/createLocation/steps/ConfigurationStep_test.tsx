/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { mount } from 'enzyme';
import React from 'react';

import { Typography } from '@instana/components';

import createNewLocationForm from 'in-synthetics/createLocation/createNewLocationForm';
import { getLocationsBluePrintConfig } from 'in-synthetics/createLocation/bluePrints';
import ConfigurationStep from 'in-synthetics/createLocation/steps/ConfigurationStep';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import PrivateLocation from 'in-synthetics/createLocation/steps/PrivateLocation';
import { t } from 'in-i18n';

describe('Synthetic New Location Configuration Step', () => {
  it('ConfigurationStep renders PrivateLocation component for private location', () => {
    const form = createNewLocationForm(getLocationsBluePrintConfig()[0].type);
    const updateForm = jest.fn();

    const wrapper = mount(
      <ConfigurationStep selectedBlueprint={getLocationsBluePrintConfig()[0]} form={form} updateForm={updateForm} />
    );

    expect(wrapper.containsMatchingElement(<PrivateLocation />)).toBeTruthy();
  });

  it('ConfigurationStep renders ManagedLocation component for managed location', () => {
    const form = createNewLocationForm(getLocationsBluePrintConfig()[1].type);
    const updateForm = jest.fn();

    const wrapper = mount(
      <ConfigurationStep selectedBlueprint={getLocationsBluePrintConfig()[1]} form={form} updateForm={updateForm} />
    );

    expect(
      wrapper.containsMatchingElement(
        <Typography variant="heading-200">
          {t('in-synthetics:dialog.createLocation.managedLocation.managedDatacentersLabel')}
        </Typography>
      )
    ).toBeTruthy();
  });

  it('ConfigurationStep renders NoDataAvailable component for a random location type', () => {
    const randomLocationType = {
      type: 'test',
      name: 'test',
      headline: 'test headline',
      description: [
        {
          headline: 'test headline',
          htmlContent: 'test content'
        }
      ]
    };

    const form = createNewLocationForm(randomLocationType.type);
    const updateForm = jest.fn();

    const wrapper = mount(
      <ConfigurationStep selectedBlueprint={randomLocationType} form={form} updateForm={updateForm} />
    );

    expect(wrapper.containsMatchingElement(<NoDataAvailable />)).toBeTruthy();
  });
});
