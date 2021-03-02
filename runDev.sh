docker run \
  -v `pwd`/content:/workspace \
  -it --rm \
  -e SITE_ID=1615dc6e-b947-4d6a-a188-9081427b3e20\
  -e MQTT_SERVER=buildserver.hamfog.net \
  -e MQTT_PORT=44004 \
  -e MQTT_KEY=1j-el29PQiOu_wCpBBkPDcSSHQ5L5D3v\
  -e IDB_SERVER=172.17.0.1\
  -e IDB_DATABASE=dm4tze\
  -e IDB_TOKEN=D0pI-ipM6dkiaLWkyYEaabjKbfemlPIQHNMenA5Qeu30L9m03Zjerc0fa3_scTuUYpujEHSWdB-hSAS2j1WySw==\
  registry.hamfog.net:5000/dm4tze/aprs-collector \
  /bin/bash
#channel: aprs/#/
#key    : 1j-el29PQiOu_wCpBBkPDcSSHQ5L5D3v
#read
