<p align="center">
  <img alt="ikota" src="public/ikota.svg" width="200" />
</p>

# Overview

Ikota (Russian word for "hiccups", pronounced `/ikóta/`) is a CLI
automation tool for working with React. It offers an automated
component generator tool & more soon.

# Install

```bash
$ npm i -g ikota
$ ikota component # or
$ npx ikota component
```

# Usage

CLI offers a single command - `component` as for now.

With this command you can single-handedly generate
essentially useful component folders with:
- `index.ts/js` - Export file
- `config.ts/js` - Configuration file
- `component.tsx/jsx` - Main component file
- `styles.module.ext` - Styling file

But first of all you'd wanna initialize the configuration
file for `ikota`: `ikota.config.js`. To do that either
use the `ikota config` command or run `ikota component`
that will take you through the options that you
can provide.

> **Note**: `ikota config` will take an entire survey over
all of the options, `ikota component` on the other hand only
initializes essential options.

## Example

<img alt="Config & Component" src="public/component.png" width="100%" />

# Documentation

All the available documentation regarding the usage of the CLI
is displayed in a help command:

```bash
$ ikota # or
$ ikota help
```

# Contributing

Pull requests are welcome. For major changes, please open an issue
first to discuss what you would like to change.

# License

This project is under [MIT](https://choosealicense.com/licenses/mit/)
license. You can freely use it for your own purposes.
