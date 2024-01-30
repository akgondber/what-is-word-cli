# what-is-word-cli [![NPM version][npm-image]][npm-url]

> CLI game where your task is to unscramble words by given definition

## Install

```bash
$ npm install --global what-is-word-cli
```

## CLI

```
$ what-is-word-cli --help

  Usage
    $ what-is-word-cli

  Options
      --category Category to be used in the round
      --topic Topic to be used in the round (some categories have topics others don't have)
      --name Use concrete name for category

  Examples
    $ what-is-word-cli
    $ what-is-word-cli --category literature
    $ what-is-word-cli -c literature
    $ what-is-word-cli --category words
    $ what-is-word-cli --category literature --topic mark-twain
    $ what-is-word-cli --category literature --topic mark-twain --name is-he-living-or-is-he-dead
    $ what-is-word-cli -c literature -t mark-twain --name is-he-living-or-is-he-dead
```

## Demo

![](media/demo.gif)

## Screenshots

![](media/screenshot-1.png)

## License

MIT © [Rushan Alyautdinov](https://github.com/akgondber)

[npm-image]: https://img.shields.io/npm/v/what-is-word-cli.svg?style=flat
[npm-url]: https://npmjs.org/package/what-is-word-cli
