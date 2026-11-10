# Lint review

Original saved run: 1 error and 47 warnings. Rule counts: {'@typescript-eslint/no-unused-vars': 42, 'import/no-anonymous-default-export': 1, '@next/next/no-img-element': 3, '@next/next/no-location-assign-relative-destination': 1}

Current run: 0 errors, 46 warnings: 40 unused variables (mostly preserved reference/template code and older tests), 4 next/no-img-element performance advisories (one native logo plus retained screens), 1 anonymous default export, 1 retained Next navigation advisory. Full per-file diagnostics: lint-final.json. Original 47 log is retained as lint-original-47.log; these are different source states and counts must not be conflated.

Initial migration scan inadvertently included generated native-dist assets. That raw run is retained compressed. The existing generated-output ignore now also excludes native-dist, without disabling any source-code rule. Native set-state-in-effect/ref-access errors and script require-import errors were corrected in code.

Warnings remain open; lint passing is not UI or business acceptance.
