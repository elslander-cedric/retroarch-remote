

export class Config {

  private configMap = {
    // TODO-FIXME: get from file
    giantbombAPIKey: '85bdb63ad0b12e6b73bced553f5f6eddcf9792e6&format',
    giantbompBaseUrl: 'http://www.giantbomb.com/api/'
  };

  constructor() {}

  public get(name : string) : any {
    return this.configMap[name];
  }

}
