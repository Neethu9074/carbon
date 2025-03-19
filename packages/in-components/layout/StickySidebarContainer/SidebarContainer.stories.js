/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { SideNavigation, SideNavigationItem } from 'in-components/SideNavigation/SideNavigation';
import SidebarContainer from 'in-components/layout/SidebarContainer/SidebarContainer';
import { scrollToTopSmoothly } from 'in-services/util/dom';

export default {
  component: SidebarContainer,
  args: {
    sidebarWidth: 2
  }
};
export function SidebarTaller(props) {
  return (
    <SidebarContainer {...props} sidebar={<SidebarContent navigationTree={navigationTree.concat(navigationTree)} />}>
      <h1>When The Sidebar Is Taller Than The Viewport</h1>
      <TallContent />
    </SidebarContainer>
  );
}

export function SidebarShorter(props) {
  return (
    <SidebarContainer {...props} sidebar={<SidebarContent navigationTree={navigationTree.slice(0, 1)} />}>
      <h1>When Sidebar Is Shorter Than The Viewport</h1>
      <TallContent />
    </SidebarContainer>
  );
}

export function SidebarTallerContentShort(props) {
  return (
    <SidebarContainer {...props} sidebar={<SidebarContent navigationTree={navigationTree.concat(navigationTree)} />}>
      <h1>When The Sidebar Is Taller Than The Viewport</h1>
      <ShortContent />
    </SidebarContainer>
  );
}

export function SidebarShorterContentShort(props) {
  return (
    <SidebarContainer {...props} sidebar={<SidebarContent navigationTree={navigationTree.slice(0, 1)} />}>
      <h1>When The Content And The Sidebar Are Both Shorter Than The Viewport</h1>
      Note that this example does not render representatively in Storybook, as Storybook adds a div around everything
      that is larger as the viewport. In our app, this would render without any vertical scrollbar, thus no scrolling at
      all would happen.
      <ShortContent />
    </SidebarContainer>
  );
}

const navigationTree = [
  {
    title: 'Access Control',
    pages: [
      {
        label: 'Users',
        component: TallContent
      },
      {
        label: 'Pending Invitations',
        component: TallContent
      },
      {
        label: 'Roles',
        component: TallContent
      },
      {
        label: 'API Tokens',
        component: TallContent
      }
    ]
  },
  {
    title: 'Knowledge',
    pages: [
      {
        label: 'Built-in Rules',
        component: TallContent
      },
      {
        label: 'Custom Rules',
        component: TallContent
      },
      {
        label: 'Custom Issues',
        component: TallContent
      }
    ]
  },
  {
    title: 'Alerting',
    pages: [
      {
        label: 'Configurations',
        component: TallContent
      },
      {
        label: 'Integrations',
        component: TallContent
      },
      {
        label: 'Maintenance Windows',
        component: TallContent
      }
    ]
  },
  {
    title: 'Audit',
    pages: [
      {
        label: 'Audit Log',
        component: TallContent
      }
    ]
  }
];

function SidebarContent({ navigationTree }) {
  return (
    <Fragment>
      {navigationTree.map((subTree, idx) => (
        <SideNavigation title={subTree.title} key={idx}>
          {subTree.pages.map((page, idx2) => (
            <SideNavigationItem onClick={scrollToTopSmoothly} key={idx2} omitEmptyIcon label={page.label} />
          ))}
        </SideNavigation>
      ))}
    </Fragment>
  );
}

function TallContent() {
  return (
    <Fragment>
      <SomeContent />
      <SomeContent />
      <SomeContent />
      <SomeContent />
    </Fragment>
  );
}

function ShortContent() {
  return (
    <Fragment>
      <h2>Some Random Content</h2>
      <pre>
        <span>Some of those that work forces, are the same that burn crosses</span>
        <br />
        <span>Some of those that work forces, are the same that burn crosses</span>
        <br />
        <span>Some of those that work forces, are the same that burn crosses</span>
        <br />
        <span>Some of those that work forces, are the same that burn crosses</span>
      </pre>
    </Fragment>
  );
}

function SomeContent() {
  return (
    <Fragment>
      <h2>Some Random Content</h2>

      <p style={{ fontSize: 'larger' }}>
        This time the bullet cold rocked ya
        <br />A yellow ribbon instead of a swastika
        <br />
        Nothin&apos; proper about ya propaganda
        <br />
        Fools follow rules when the set commands ya
        <br />
        Said it was blue
        <br />
        When ya blood was red
        <br />
        That&apos;s how ya got a bullet blasted through ya head
        <br />
        <br />
        Blasted through ya head
        <br />
        Blasted through ya head
        <br />
        <br />I give a shout out to the living dead
        <br />
        Who stood and watched as the feds cold centralized
        <br />
        So serene on the screen
        <br />
        You were mesmerised
        <br />
        Cellular phones soundin&apos; a death tone
        <br />
        Corporations cold
        <br />
        Turn ya to stone before ya realise
        <br />
        They load the clip in omnicolour
        <br />
        Said they pack the 9, they fire it at prime time
        <br />
        Sleeping gas, every home was like Alcatraz
        <br />
        And mutha fuckas lost their minds
        <br />
        <br />
        Just victims of the in-house drive-by
        <br />
        They say jump, you say how high
        <br />
        Just victims of the in-house drive-by
        <br />
        They say jump, you say how high
        <br />
        <br />
        Run it!
        <br />
        <br />
        Just victims of the in-house drive-by
        <br />
        They say jump, you say how high
        <br />
        Just victims of the in-house drive-by
        <br />
        They say jump, you say how high
        <br />
        <br />
        Checka, checka, check it out
        <br />
        They load the clip in omnicolour
        <br />
        Said they pack the 9, they fire it at prime time
        <br />
        Sleeping gas, every home was like Alcatraz
        <br />
        And mutha fuckas lost their minds
        <br />
        <br />
        No escape from the mass mind rape
        <br />
        Play it again jack and then rewind the tape
        <br />
        And then play it again and again and again
        <br />
        Until ya mind is locked in
        <br />
        Believin&apos; all the lies that they&apos;re tellin&apos; ya
        <br />
        Buyin&apos; all the products that they&apos;re sellin&apos; ya
        <br />
        They say jump and ya say how high
        <br />
        Ya brain-dead
        <br />
        Ya gotta fuckin&apos; bullet in ya head
        <br />
        <br />
        Just victims of the in-house drive-by
        <br />
        They say jump, you say how high
        <br />
        Just victims of the in-house drive-by
        <br />
        They say jump, you say how high
        <br />
        <br />
        Uggh! Yeah! Yea!
        <br />
        <br />
        Ya standin&apos; in line
        <br />
        Believin&apos; the lies
        <br />
        Ya bowin&apos; down to the flag
        <br />
        Ya gotta bullet in ya head
        <br />
        <br />
        Ya standin&apos; in line
        <br />
        Believin&apos; the lies
        <br />
        Ya bowin&apos; down to the flag
        <br />
        Ya gotta bullet in ya head
        <br />
        <br />A bullet in ya head
        <br />A bullet in ya head
        <br />A bullet in ya head
        <br />A bullet in ya head
        <br />A bullet in ya head
        <br />A bullet in ya head
        <br />A bullet in ya head
        <br />A bullet in ya head
        <br />A bullet in ya head!
        <br />A bullet in ya head!
        <br />A bullet in ya head!
        <br />A bullet in ya head!
        <br />A bullet in ya head!
        <br />A bullet in ya head!
        <br />A bullet in ya head!
        <br />
        Ya gotta bullet in ya fuckin&apos; head!
        <br />
        <br />
        Yeah!
        <br />
        <br />
        Yeah!
      </p>
    </Fragment>
  );
}
