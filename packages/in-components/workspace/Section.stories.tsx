/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

// @ts-expect-error import { ActionSection, Action } from 'in-components/workspace/ActionSection/ActionSection';
import { ActionSection, Action } from 'in-components/workspace/ActionSection/ActionSection';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import HelpAction from 'in-components/workspace/HelpAction';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';

export default {
  title: 'in-components/workspace/Sections/Sections'
};

export const Default = {
  render: () => (
    <Sections>
      <Section
        icon="lib_actions_filter"
        title="Filter"
        actions={
          <Button kind="subtle" icon="lib_openclose_cancel" size="compact">
            Clear
          </Button>
        }
      >
        Lorem ipsum dolor sit amet consectetur!
      </Section>
      <Section
        icon="lib_actions_copy"
        title="Group"
        actions={
          <Button kind="subtle" icon="lib_openclose_cancel" size="compact">
            Clear
          </Button>
        }
      >
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex corrupti nemo modi optio nulla, numquam cupiditate,
        laborum unde ullam culpa facere neque alias! Odit voluptate quae nemo facilis. Dolorem, unde! Lorem ipsum dolor
        sit amet consectetur, adipisicing elit. Ex corrupti nemo modi optio nulla, numquam cupiditate, laborum unde
        ullam culpa facere neque alias! Odit voluptate quae nemo facilis. Dolorem, unde! Lorem ipsum dolor sit amet
        consectetur, adipisicing elit. Ex corrupti nemo modi optio nulla, numquam cupiditate, laborum unde ullam culpa
        facere neque alias! Odit voluptate quae nemo facilis. Dolorem, unde! Lorem ipsum dolor sit amet consectetur,
        adipisicing elit. Ex corrupti nemo modi optio nulla, numquam cupiditate, laborum unde ullam culpa facere neque
        alias! Odit voluptate quae nemo facilis. Dolorem, unde!
      </Section>
      <InputInSection
        id="name"
        label="Name"
        value="foobar"
        actions={<HelpAction>The name your BFF uses.</HelpAction>}
      />
      <InputInSection id="broken" label="No Good Field" value="Come on man…" hasError />
      <SelectInSection id="some-select" label="COVID-19?" value="0">
        <option value="0">Hell to the Nooo!</option>
        <option value="1">Yes</option>
      </SelectInSection>
      <SelectInSection
        id="some-select"
        label="Okay?!"
        value="0"
        useFullWidth
        hasError
        actions={<HelpAction>Wat up?</HelpAction>}
      >
        <option value="">Please Select 😈</option>
        <option value="0">
          Such a <strong>super, super long</strong>content like you wouldn`&apos;`t believe!
        </option>
      </SelectInSection>
      <ActionSection
        left={
          <>
            <Action icon="lib_help_error_help_outline">Add grouping</Action>
            <Action icon="lib_bar_chart">Add Chart</Action>
          </>
        }
        right={<Action icon="lib_views_code">API Query</Action>}
      />
      <ActionSection left={<Action icon="lib_views_code">Only Actions on left side</Action>} />
      <ActionSection right={<Action icon="lib_views_code">Only Actions on right side</Action>} />
    </Sections>
  ),

  name: 'default'
};
