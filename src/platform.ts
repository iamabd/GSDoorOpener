import { Service, PlatformAccessory, Characteristic, API } from 'homebridge';
import { MyDoorOpenerAccessory } from './accessories/MyDoorOpenerAccessory';

class GSDoorOpenerPlatform {
  // ... (existing code)

  initializePlugin() {
    const accessory = new MyDoorOpenerAccessory(this.log, this.config, {
      Service: this.Service,
      Characteristic: this.Characteristic
    });

    const accessoryInfo = new this.api.platformAccessory('Your Door', accessory.UUID);
    accessoryInfo.context.device = accessory;

    this.accessories.push(accessoryInfo);
  }

  // ... (existing code)
}

module.exports = (api: API) => {
  Service = api.hap.Service;
  Characteristic = api.hap.Characteristic;

  api.registerPlatform('GSDoorOpener', 'GSDoorOpenerPlatform', GSDoorOpenerPlatform);
};
