### Requirements

To run this project, you will need:

- Node.js >= v8.10.0, use nvm - [install instructions](https://github.com/creationix/nvm#install-script)
- Yarn >= v1.16.0 - [install instructions](https://yarnpkg.com/en/docs/install#alternatives-stable)

## Development

We use the [Storybook](https://storybook.js.org/) as the main way to develop React Vizion.

```sh
yarn
yarn start
```

Go to <http://localhost:6006>.

The applications won't reload on code change. To enable the watch mode, run the following command in another tab.

```sh
yarn watch
```

## Code

The code for React Vizion is located in [packages](packages).

## Test

We have unit tests written with [Jest](https://facebook.github.io/jest):

Single run:

```sh
yarn test
```

Watch mode:

```sh
yarn test:watch
```

## Lint

```sh
yarn lint
```

Files are automatically formatted with Prettier

## Release

```sh
yarn release
```

### Beta release

```sh
yarn release --beta
```

Append `-beta.x` where x is a number to the version for beta, so 1.0.0-beta.2 for example.
