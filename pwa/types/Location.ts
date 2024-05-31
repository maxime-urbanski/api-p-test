import { Item } from "./item";

export class Location implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public name?: string,
    public city?: string,
    public state?: string,
    public photo?: string,
    public availableUnits?: number,
    public wifi?: boolean,
    public laundry?: boolean
  ) {
    this["@id"] = _id;
  }
}
