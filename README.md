```
@author - Munkhtulga Borgil
@since - Apr 05, 2024
@contact - munkhtulga@mirai.mn
```

## Getting Started

After cloning the project, first run `yarn` (recommended) or `npm install` then start your dev server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Project Structure

"app" folder -> This folder contains the all development related files including `layouts`, `page`, `components`, `providers`, and much more. Folders names starting with an underscore `_` are not for routing purposes but the ones without are for pure routing purposes only.

> > - `_api` -> The folder containing all the http request config and controllers

> > - `_components` -> The folder containing all the components used in the project

> > - `_enums` -> The folder containing all the enums used in the project

> > - `_lottie` -> The folder containing all the lottie files for the animation

> > - `_provider` -> The folder containing the provider component (wrapper component for the whole app)

> > - `_store` -> The folder containing the config and stores of Zustand (state management library for React)

> > - `_utils` -> The folder containing all the helper functions used in the project (e.g. `getFullName()`, `nullSafety()`)

".github" folder -> This folder contains the config for github CI/CD

"public" folder -> This folder contains all the assets including icons and vectors used in the project

## Making a http request with Fetch API

First import `$api` to your component or page:

```
import $api from "@/app/_api/index";
```

After importing the object, access to your corresponding controller. For example:

```
const response = await $api.global.auth.login();
```

The response returns `isOk` (boolean), `status` (number), and `data` (any) of the request. `isOk` is for checking if the request was succesful or not, `status` is the status code returned from the request, and `data` is the data received from the request.

## Creating a new http request controller

To create a new http request controller and register it in the `$api`, create a new file inside the corresponding folder (For example: `BranchController.js` file inside the `member` folder)

Then import the `fetchData` method from the `_api/config.js` to the newly created controller file. After that, declare your http request function as shown below:

`BranchController.js`

```
import fetchData from "../config";

export const getMany = () => {
  return fetchData("studios", "GET");
};

export const getOne = (id) => {
  return fetchData(`studios/${id}`, "GET");
};
```

The `fetchData` method takes three arguments `endpoint`: string, `request method`: string, and `request body`: any.

After creating the controller file, import and register the file under the `index.js` file located in `app/_api/index.js`

## Modifying UI components (Ant Design React)

Most of the UI components used in the project are from the `Ant Design` library. System colors and design tokens are declared inside the config provider component (`app/_provider/AppProvider.js`) from the ant design. For more information, please refer to the `Ant Design`'s official documentation: https://ant.design/
