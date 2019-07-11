export class MonitorDTO {
  handler: string = "";
  params: object = {};

  public getHandler(): string {
    return this.handler;
  }

  public setHandler(handler: string): void {
    this.handler = handler;
  }

  public getParams(): object {
    return this.params;
  }

  public setParams(params: object): void {
    this.params = params;
  }
}
