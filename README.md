# Console

## Overview

Console is a web-based UI for managing resources within Kyma. It consists of separate front-end applications. Each project is responsible for providing a user interface for particular resource management.

### Components
The Console project consists of the following UI projects:
- [`Core`](./core) - The main frame of Kyma UI
- [`Instances`](./instances) - The view for displaying Service Instances
- [`Catalog`](./catalog) - The UI layer for Service Catalog
- [`Lambda`](./lambda) - The view for lambda functions
- [`Content`](./content) - The documentation view
- [`Tests`](./tests) - Acceptance and end-to-end tests

Console also includes the libraries with components for the React and Angular front-end frameworks:
- [`React components`](./components/react)
- [`Generic list for Angular`](./components/angular/generic-list)

## Usage
This repository uses Lerna for managing local dependencies.

To install all dependencies for all UI projects and prepare symlinks for local packages within this repository, run the following commands:
```
npm install
npm run bootstrap
```

To clear dependencies and remove symlinks, run this command:
```
npm run clean
```

### Run with Kyma
Follow these steps to test the Console locally with running Kyma:
1. Edit `{module}/src/commons/api-url.js` and change **graphqlApiUrl** to `https://ui-api.kyma.local/graphql`.
2. Edit the **core-ui-api** Deployment using the `kc edit deployment -n kyma-system core-ui-api` command, edit **APP_ALLOWED_ORIGINS** environment, and add `http://localhost:*` there.
3. Add authorization bearer token as a header with your ID token generated by Dex.