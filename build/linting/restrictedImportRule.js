/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/**
 * Use this function to configure an extension to the import restriction rule.
 * This is useful to enforce/restrict package-dependencies which may then lead
 * to a cleaner package architecture and an easier transition path/architecture
 * evolution.
 */
exports.createImportRestrictionRule = ({
  paths = [],
  patterns = [],
  allowedInPackages,
  enforceAbsoluteImportPaths
} = {}) => ({
  'no-restricted-imports': [
    'error',

    {
      paths: [
        // Please use our wrapper by importing from the in-i18n package.
        'react-i18next',
        'i18next',

        // forbidden libraries because of complicated update paths
        'fbjs',

        // Some editor/IDE auto imports incorrectly import the commonJS variant of the packages.
        // This ensures that the ESM variant is used.
        '@instana/observables/lib',
        '@instana/components/lib',
        '@instana/hooks/lib',
        '@instana/logger/lib',
        '@instana/roemitter/lib',
        // We are migrating moment usage to respective date-fns implementation
        // The only usage of moment-timezone is used in timezone widget for now.
        'in-services/moment-timezone',
        'moment-timezone',

        // we want to avoid mixing different versions of carbon, and
        // have carbon components only in ui-foundation repository
        '@carbon/grid',
        '@carbon/styles',
        '@carbon/react',
        '@carbon/ibm-products',

        {
          name: 'react-router',
          importNames: ['useLocation'],
          message:
            'Please import navigation support from in-stores/navigation instead to ensure clean matrix parameter support'
        },

        ...paths
      ],
      patterns: [
        '@carbon/colors',
        '@material-ui/core/*',
        // Forbid relative JavaScript imports
        ...(enforceAbsoluteImportPaths
          ? ['./**/*', '../**/*', '!./**/*.mless', '!../**/*.mless', '!./**/*.less', '!../**/*.less']
          : []),

        // Allow architecture enforcement rules, i.e., restrict cross-package imports.
        allowedInPackages != null ? 'in-*/*' : null,
        ...(allowedInPackages || []).map(pckg => `!${pckg}/*`),

        ...patterns
      ].filter(Boolean)
    }
  ]
});
