# Old Pines Hotel & Restaurant website

This repository is the source code for the current release of the [Old Pines Hotel & Restaurant website](https://www.oldpines.co.uk/).

This is a static site built using [Publican](https://publican.dev/) and [esbuild](https://esbuild.github.io/). `publican.config.js` defines the configuration which constructs the site in the `./build/` directory.


## Development build

Build in development mode and watch for file changes with style hot reloading:

```bash
npm start
```


## Production build

Build minified files for production deployment:

```bash
npm run build
```
