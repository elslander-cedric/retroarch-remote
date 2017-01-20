export class Game {
  private _id: number;
  private _name: string;
  private _summary : string;
  private _description: string;
  private _downloadUrl: string;
  private _image: string;
  private _platforms: string;
  private _rating : string;
  private _releasedate : string;

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
  get downloadUrl() : string {
    return this._downloadUrl;
  }

  set downloadUrl(downloadUrl : string) {
    this._downloadUrl = downloadUrl;
  }

  get image() : string {
    return this._image;
  }

  set image(image : string) {
    this._image = image;
  }

  get platforms() : string {
    return this.platforms;
  }

  set platforms(platforms : string) {
    this._platforms = platforms;
  }

  get rating() : string {
    return this._rating;
  }

  set rating(rating : string) {
    this._rating = rating;
  }

  get releasedate() : string {
    return this._releasedate;
  }

  set releasedate(releasedate : string) {
    this._releasedate = releasedate;
  }
}
