import { MonitorProvider } from "./MonitorProvider";
import { AbstractConsumer } from "./AbstractConsumer";
import { Counter } from "../circuitBreaker/Counter";
import { Queue } from "../base/Queue";
import { MonitorDTO } from "../dto/monitorDto";

export class MonitorCenter {
  providers: MonitorProvider[] = [];
  consumers: AbstractConsumer[] = [];
  concurrent: number = 5;
  counter: Counter = new Counter();
  queue: Queue<MonitorDTO> = new Queue(100);

  constructor(concurrent: number) {
    this.concurrent = concurrent;
  }

  register(provider: MonitorProvider): string {
    let handler = provider.mounte(this);
    this.providers.push(provider);
    return handler;
  }

  subscribe(consumer: AbstractConsumer): AbstractConsumer {
    return consumer;
  }

  distribute(monitorDto: MonitorDTO): void {
    this.queue.push(monitorDto);
  }

  process() {
    setInterval(() => {
      if (this.counter.get() < this.concurrent) {
        let dto: MonitorDTO | undefined = this.queue.pop();
        if (dto) {
          let tDto: MonitorDTO = dto;
          this.consumers.forEach(item => {
            if (item.checkHandler(tDto.getHandler())) {
              this.counter.increase();
              item.notify(tDto.getParams());
            }
          });
        }
      }
    });
  }
}
