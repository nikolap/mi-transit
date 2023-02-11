# MI-Transit

Production: https://mi-transit.vercel.app/

## Goals

Project is time boxed to 3h.

Have a working Swiss transit search app running and integrated with CI/CD using
the [transport.opendata.ch API](https://transport.opendata.ch/docs.html).

## Development Environment

### Requirements

You will require the following to get started:

- [git](https://git-scm.com/)
- [nodejs](https://nodejs.org/), v18 recommend, works with v16

### Setup

Clone the project from Github

    git clone git@github.com:nikolap/mi-transit.git

And run it by first installing dependencies

    npm install

then running the local server

    npm run dev

### Developing

During development you can run the [jest](https://jestjs.io/) test watcher via

    npm run test

This process will watch for changes to your source files or tests and automatically re-run them.

The project has Github branch protection rules enabled on the production branch (`main`). The rules require you create a
pull request and have your changes merged in that form.

This project uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) and enforces them via a
pre-commit hook setup via [Husky](https://github.com/typicode/husky). The pre-commit hook is automatically set up
on `npm install` via `prepare`.

Note: we rely on the timetable.search.ch API (via transport.opendata.ch) which is limited to 1000 route
queries per day. Please be kind when using this API, and be aware if you start hitting rate limits this is the cause.

## Code Base Overview

Our `src` directory contains the following folders

```
|.                  => root folder of src contains shared code used throughout
├── components      => shared UI components
├── interfaces      => contains IO code at the edges of our application
│   └── transport   => logic for interacting with our third-party transport API
├── pages           => pages that Next.js renders
│   └── api         
│       └── v1      => our API endpoints running on Vercel via lambdas
└── styles          => CSS overrides on top of antd styling
```

Tests are contained in our `tests` directory.

## Future work

- Additional validation
    - Add in validation library
- Additional API tests
    - for api/v1/locations
    - expand api/v1/connections to be more comprehensive, i.e. variants
- Integration tests
- Tapedeck responses for API requests to limit requests to transport.opendata.ch
- Expanding api for search (e.g. different search times)
- Caching api requests

## License

Copyright © 2023

Released under the MIT license.
