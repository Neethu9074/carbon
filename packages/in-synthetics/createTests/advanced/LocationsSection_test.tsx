/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import { createMapForm } from 'formalistic';
import { mount } from 'enzyme';
import React from 'react';

import { SyntheticLocation } from '@instana/types';
import { just } from '@instana/observables';

import {
  locationTestSelectionTableActions,
  noLocationsDataAvailable,
  selectLocationButtonElement
} from 'in-synthetics/createTests/advanced/ConfigureLocations';
import { createAdvancedActionConfigurationForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import LocationsSection from 'in-synthetics/createTests/advanced/LocationsSection';

describe('LocationsSection', () => {
  const form = createMapForm().put('configuration', createAdvancedActionConfigurationForm());
  const updateForm = jest.fn();
  const setSliderState = jest.fn();
  const locations = () => just([]);
  it('Renders the Create Test > LocationsSection correctly initially', () => {
    const { container } = render(
      <LocationsSection
        setTitle={false}
        loadEntities={locations}
        renderNoDataAvailable={() => noLocationsDataAvailable()}
        tableActions={locationTestSelectionTableActions(form, updateForm)}
        rightHeader={selectLocationButtonElement({ form, updateForm, locations, setSliderState })}
      />
    );
    expect(screen.getByText('Location(s)')).toBeInTheDocument();

    expect(screen.getByText('Select location')).toBeInTheDocument();

    expect(container.getElementsByTagName('th').length).toBe(4);
    expect(container.getElementsByTagName('th')[0]).toHaveTextContent('Location name');
    expect(container.getElementsByTagName('th')[1]).toHaveTextContent('Display name');
    expect(container.getElementsByTagName('th')[2]).toHaveTextContent('Status');
  });

  it('renders NoDataAvailable component if no locations are present', () => {
    const wrapper = mount(
      <LocationsSection
        setTitle={false}
        loadEntities={locations}
        renderNoDataAvailable={() => noLocationsDataAvailable()}
        tableActions={locationTestSelectionTableActions(form, updateForm)}
        rightHeader={selectLocationButtonElement({ form, updateForm, locations, setSliderState })}
      />
    );
    expect(wrapper.containsMatchingElement(noLocationsDataAvailable())).toBeTruthy();
  });

  test('renders the LocationsSection content correctly if location item is present', () => {
    const { container } = render(
      <LocationsSection
        setTitle={false}
        loadEntities={() =>
          just([
            {
              id: 'PO5ohuEwWYiThK0GRCiD',
              label: 'CWC-pink',
              status: 'Online',
              displayLabel: 'displayCWC'
            }
          ] as SyntheticLocation[])
        }
        renderNoDataAvailable={() => noLocationsDataAvailable()}
        tableActions={locationTestSelectionTableActions(form, updateForm)}
        rightHeader={selectLocationButtonElement({ form, updateForm, locations, setSliderState })}
      />
    );

    expect(screen.getByText('Location(s) (1)')).toBeInTheDocument();

    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
    const trElements = tbody?.getElementsByTagName('tr')!;
    expect(trElements?.length).toEqual(1);

    const tdElements = tbody?.getElementsByTagName('td')!;
    expect(tdElements?.length).toEqual(4);

    expect(tdElements[0]).toHaveTextContent('CWC-pink');
    expect(tdElements[1]).toHaveTextContent('displayCWC');
    expect(tdElements[2]).toHaveTextContent('Online');
  });
});
