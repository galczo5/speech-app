export class BoxId {

  constructor(private readonly guid: string) {
  }

  toString(): string {
    return this.guid;
  }

  equals(boxId: BoxId): boolean {
    return this.toString() === boxId.toString();
  }

}
