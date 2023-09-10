import { Service, Characteristic } from 'homebridge';
const https = require('https');
const xml2js = require('xml2js');
const crypto = require('crypto');

export class MyDoorOpenerAccessory {
  private readonly Service: Service;
  private readonly Characteristic: Characteristic;

  constructor(
    private readonly log: any,
    private readonly config: any,
  ) {
    this.Service = config.Service;
    this.Characteristic = config.Characteristic;

    this.Service.getCharacteristic(this.Characteristic.TargetDoorState)
      .on('set', this.setDoorState.bind(this));
  }

  setDoorState(value: any, callback: any) {
    const doorServerName = this.config.doorServerName;
    const doorUser = this.config.doorUser;
    const Pass = this.config.pass;
    const remotePIN = this.config.remotePIN;

    const options = {
      hostname: doorServerName,
      rejectUnauthorized: false,
    };

    const getRequest = https.request(`https://${doorServerName}/goform/apicmd?cmd=0&user=admin`, options, (res: any) => {
      let data = '';
      res.on('data', (chunk: any) => {
        data += chunk;
      });

      res.on('end', () => {
        xml2js.parseString(data, (err: any, result: any) => {
          if (err) {
            console.error(err);
            return;
          }

          const ChallengeCode = result.Configuration.ChallengeCode[0];
          const IDCode = result.Configuration.IDCode[0];

          const authcodestring = `${ChallengeCode}:${remotePIN}:${Pass}`;
          const md5auth = crypto.createHash('md5').update(authcodestring).digest('hex');

          const openDoorRequest = https.request(`https://${doorServerName}/goform/apicmd?cmd=1&user=${doorUser}&authcode=${md5auth}&idcode=${IDCode}&type=1`, options, (res: any) => {
            this.log('Door opened');
            callback(null);
          });

          openDoorRequest.end();
        });
      });
    });

    getRequest.end();
  }

  getServices() {
    const informationService = new this.Service.AccessoryInformation()
      .setCharacteristic(this.Characteristic.Manufacturer, 'GrandStream')
      .setCharacteristic(this.Characteristic.Model, 'GDS3710')
      .setCharacteristic(this.Characteristic.SerialNumber, '123-456-789');

    const doorService = new this.Service.GarageDoorOpener('Your Door')
      .setCharacteristic(this.Characteristic.TargetDoorState, this.Characteristic.TargetDoorState.CLOSED)
      .setCharacteristic(this.Characteristic.CurrentDoorState, this.Characteristic.CurrentDoorState.CLOSED);

    return [informationService, doorService];
  }
}
