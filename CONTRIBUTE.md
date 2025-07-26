# Commands

## Initial install

Make sure to have the proper version of Node.js and pnpm (you can use [Volta](https://volta.sh/) for this)

And then, run `pnpm i`

## Build

`pnpm build`: will build all files

## Test

`pnpm test`: will run all unit tests
`pnpm lint:check`: will check that the whole codebase is properly formatted

> [!Note]
> You can use `pnpm lint:fix` to fix the formatting

## Deploy

`pnpm run deploy [--tag next] [--access public|private] --version x.y.z`: will update all package.json with the version `x.y.z`, and apply a git tag to the same version. Then build & test all, and then deploy them to npm under the provided tag (if provided).
