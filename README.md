![](http://res.cloudinary.com/jollen/image/upload/h_110/v1455862763/devify-logo_rh63vl.png)

# devify-cli

[![Build Status](https://travis-ci.org/DevifyPlatform/devify-cli.svg?branch=master)](https://travis-ci.org/DevifyPlatform/devify-cli)
[![npm version](https://img.shields.io/npm/v/devify-cli.svg?style=flat)](https://www.npmjs.com/package/devify-cli)

*devify* is an IoT server boilerplate. It is extremely light weight and simple to use. To get to speed up, a cli tools is provided.

## Usage

```
  Usage: devify [options] [command]


  Commands:

    new <dir>     Create a new devify-server project in the directory
    update <dir>  Update your project libraries
    ui <name>     Install one ui package
    serve <dir>   Start ui package server

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -V, --version  output the version number
```

## Quickstart

*devify-cli* is a cli tool for getting started with [devify](https://github.com/DevifyPlatform/devify-server)
```
npm install -g devify-cli
```

Create a new project with ```new``` command
```
devify new esp8266-iot
```

Install dependencies
```
cd esp8266-iot && npm install
```

Start the server
```
node esp8266-coap-server.js
```

By default, the IoT server is listening at ```coap://localhost:8000``` to accept CoAP requests. Please use an IP address to listen from requests. Use ```HOST``` environment to achieve this.

```
$ export HOST=192.168.0.100
$ node esp8266-coap-server.js 
WoT.City/CoAP server is listening at coap://192.168.0.100:8000
```
The message shows that the server is listening at ```coap://192.168.0.100:8000```.

## Update Project

Devify project is developing and will be continous integrated into [devify-server](https://github.com/DevifyPlatform/devify-server). You can update your project library code with ```update``` command.

```
$ devify <your_dir>
```

## Manually

If you would likt to update your project by ```git``` manually. You can just upgrade the ```libs/``` folder of your own project by the following commands.

```
$ cd <your-dir>
$ git remote add devify https://github.com/DevifyPlatform/devify-server
$ git fetch devify
$ git checkout devify/master libs
$ git remote remove devify
```

Since all the changes of upstream will only be in ```libs```, you can just checkout ```libs/``` from upstream master.

## ESP8266 Howto

The server is listening at ```coap://192.168.0.100:8000``` to accept CoAP requests. Use NodeMCU and Lua to send message.

```
-- Configure the ESP as a station (client)
wifi.setmode(wifi.STATION)  
wifi.sta.config("<SSID>", "<PASSWORD>")  
wifi.sta.autoconnect(1)

-- Create a CoAP client
cc = coap.Client()

-- Make a POST request
uri="coap://127.0.0.1:8000/object/12345678/send"

tmr.alarm(0, 1000, 1, function() 
    cc:post(uri, "{\"temp\":20}\r\n")
end)
```

## URI Style

```
coap://127.0.0.1:8000/object/<ObjectID>/send
```

* *object* is the resource name
* *&lt;ObjectID&gt;* is the unique ID of the resource. Please assign a string for your device.
* *send* is the action which means "sending data to the server*

## Tutorial

Please refer to [devify-server](https://github.com/DevifyPlatform/devify-server/blob/master/README.md) for more detailed.

## License

devify-cli is released under the [MIT License](http://www.opensource.org/licenses/MIT).
