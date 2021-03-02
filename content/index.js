import InfluxDB from "influxdb-v2"
import emitter from "emitter-io"

import flat from "flat"

const IDB_HOST = process.env.IDB_HOST || "172.17.0.1",
  IDB_PROTOCOL = process.env.IDB_PROTOCOL || "http",
  IDB_PORT = process.env.IDB_PORT || "8086",
  IDB_TOKEN = process.env.IDB_TOKEN || "db",
  IDB_ORG = process.env.IDB_ORG || "hamfog",
  IDB_BUCKET = process.env.IDB_BUCKET || "dm4tze",
  MQTT_SERVER = process.env.MQTT_SERVER || "172.17.0.1",
  MQTT_PORT = process.env.MQTT_PORT || "8080",
  MQTT_KEY = process.env.MQTT_KEY || "",
  APRS_CALL = process.env.APRS_CALL || "NOCALL",
  APRS_SSID = process.env.APRS_SSID || "10"

const MQTT_TOPIC = process.env.MQTT_TOPIC || `aprs/point/+/+/+/`

const emitterClient = emitter.connect({
  host: `mqtt://${MQTT_SERVER}`,
  port: MQTT_PORT,
})

;(async () => {
  console.log(IDB_TOKEN)
  const idb = new InfluxDB({
    host: IDB_HOST,
    protocol: IDB_PROTOCOL,
    port: IDB_PORT,
    token: IDB_TOKEN,
  })
  emitterClient.on("message", async function (msg) {
    let aprsMsg = msg.asObject()
    console.log(msg.asString())
    //TODO nicht alles loggen, nur bestimmte Regionen?
    let [sourceCallsign, sourceSSID] = aprsMsg.from.split("-")
    sourceSSID = sourceSSID || "0"
    let rxCallsign = APRS_CALL
    let rxSSID = APRS_SSID
    let objectName = aprsMsg.object_name || aprsMsg.from

    //TODO fix Error in influx
    aprsMsg.symbol_table = aprsMsg.symbol_table == "/" ? "P" : "S"
    aprsMsg.raw = aprsMsg.raw.replace("\\", "_")

    aprsMsg.path = aprsMsg.path.join(",")
    console.log(flat(aprsMsg))

    await idb.write(
      {
        org: IDB_ORG,
        bucket: IDB_BUCKET,
      },
      [
        {
          measurement: "aprs-message",
          tags: {
            objectName,
            sourceCallsign,
            sourceSSID,
            rxCallsign,
            rxSSID,
            longitude: Math.floor(aprsMsg.longitude).toString(),
            latitude: Math.floor(aprsMsg.latitude).toString(),
          },
          fields: flat(aprsMsg),
        },
      ]
    )
  })
})().catch((error) => {
  console.error("\n🐞 An error occurred!", error)
  process.exit(1)
})
emitterClient.on("connect", function () {
  console.log("connected")
  console.log("subscribe topic: " + MQTT_TOPIC)
  emitterClient.subscribe({
    key: MQTT_KEY,
    channel: MQTT_TOPIC,
  })
  emitterClient.on("message", function (msg) {
    console.log(msg.asString())
  })
})

emitterClient.on("error", function (error) {
  console.error("emitter error: " + error)
})
