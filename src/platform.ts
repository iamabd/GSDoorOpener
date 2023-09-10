import { Service, PlatformAccessory, Characteristic, API } from 'homebridge';
import { MyDoorOpenerAccessory } from './accessories/MyDoorOpenerAccessory';

class GSDoorOpenerPlatform {
  private readonly accessories: PlatformAccessory[] = [];

  constructor(
    private readonly log: any,
    private readonly config: any,
    private readonly api: API,
  ) {
    this.log = log;
    this.config = config;
    this.api = api;

    // Initialize your plugin here
    this.initializePlugin();
  }

  initializePlugin() {
    const accessory = new MyDoorOpenerAccessory(this.log, this.config);

    const accessoryInfo = new this.api.platformAccessory('Your Door', accessory.UUID);
    accessoryInfo.context.device = accessory;

    this.accessories.push(accessoryInfo);

    this.api.publishExternalAccessories('GSDoorOpener', this.accessories);
  }
}

module.exports = (api: API) => {
  api.registerPlatform('GSDoorOpener', 'GSDoorOpenerPlatform', GSDoorOpenerPlatform);
};

