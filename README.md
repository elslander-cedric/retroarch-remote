# RetroArch Remote

RetroArch Remote makes it possible to start your favorite games just from your phone. This comes particularly handy if you're running RetroArch on a system like a media center with no attached keyboard.

With RetroArch Remote you can look up any games registered on Giant Bomb [www.giantbomb.com](Giant Bomb), add them to your favorites and easily download them from the Internet Archive [https://archive.org/](Internet Archive).

RetroArch Remote has been set up to run as a daemon service aside Kodi.

## Prerequisites

* Node.js v7.7.1
* RetroArch
* Giant Bomb API key

## Table of Contents

* [Project Status](#project-status)
* [Supported Devices](#supported-devices)
* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
* [Documentation](#documentation)
* [License](#license)

## Project Status

This is still playground, so you've been warned ...

## Supported Devices

* Server: Ubuntu 14.04
* Client: Chrome

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)
```bash
npm install retroarch-remote
```

## Configuration

### Giant Bomb API Key

Get one from http://www.giantbomb.com/api/

Make a config.json in retroarch-remote folder with:

```javascript
{
  "giantbombAPIKey": "",
  "downloadDir": "/path/to/my/downloads",
  "port": 1337,
  "kodi": true,
  "kodiRPCPort": 8084,
  "kodiRPCUser": "KODY USER",
  "kodiRPCPassword": "KODY PASSWORD"
}
```

## Usage

Navigate to `http://[hostname]:1337/`

## Documentation

### Screenshots

![alt text][dashboard]
![alt text][search]
![alt text][running]
![alt text][description]

## License

MIT

[dashboard]: /doc/img/dashboard.png "Dashboard"
[search]: /doc/img/search.png "Search"
[running]: /doc/img/running.png "Running"
[description]: /doc/img/description.png "Description"
