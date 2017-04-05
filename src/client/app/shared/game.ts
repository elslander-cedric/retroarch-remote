export class Game {
  private _id: number;
  private _name: string;
  private _summary : string;
  private _description: string;
  private _image: string;
  private _platform: number;
  private _platforms: string;
  private _rating : number;
  private _releasedate : string;
  private _running : boolean;

  get id() : number {
    return this._id;
  }

  set id(id : number) {
    this._id = id;
  }

  get name() : string {
    return this._name;
  }

  set name(name : string) {
    this._name = name;
  }

  get summary() : string {
    return this._summary;
  }

  set summary(summary : string) {
    this._summary = summary;
  }

  get description() : string {
    return this._description;
  }

  set description(description : string) {
    this._description = description;
  }

  get image() : string {
    return this._image;
  }

  set image(image : string) {
    this._image = image;
  }

  get platform() : number {
    return this.platform;
  }

  set platform(platform : number) {
    this._platform = platform;
  }

  get platforms() : string {
    return this.platforms;
  }

  set platforms(platforms : string) {
    this._platforms = platforms;
  }

  get rating() : number {
    return this._rating;
  }

  set rating(rating : number) {
    this._rating = rating;
  }

  get releasedate() : string {
    return this._releasedate;
  }

  set releasedate(releasedate : string) {
    this._releasedate = releasedate;
  }

  get running() : boolean {
    return this._running;
  }

  set running(running : boolean) {
    this._running = running;
  }
}
