# Dockerized service for collecting aprs data via mqtt

This container collects json AXUDP packets over MQTT and writes them into an influx time series database.
Configuration parameters (environment variables) are:

- `IDB_HOST` InfluxDB host i.e "172.17.0.1"
- `IDB_PROTOCOL` InfluxDB protocol i.e. "http",
- `IDB_PORT` = InfluxDB port i.e. "8086",
- `IDB_TOKEN` = InfluxDB write access token
- `IDB_ORG` = InfluxDB organization i.e. "hamfog"
- `IDB_BUCKET` = InfluxDB bucket i.e. "dm4tze"
- `MQTT_SERVER` = MQTT host i.e. "172.17.0.1"
- `MQTT_PORT` = MQTT port i.e. "8080"
- `MQTT_KEY` = if emitter.io is used as MQTT Server the access key can be specified here
- `APRS_CALL` = Call sign of receiving station
- `APRS_SSID` = SSID of receiving station

## Build

To build this image you can use the `build.sh`. It will create an image tagged with `registry.hamfog.net:5000/dm4tze/aprs-collector`.

## Start

To start the container you have to adjust the `run.sh`
