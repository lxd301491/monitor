import { MonitorProvider } from './MonitorProvider';
import { AbstractConsumer} from './AbstractConsumer';

export class MonitorCenter {
  providers: MonitorProvider[] = [];
  consumers: AbstractConsumer[] = [];

  registerProvier(provider: MonitorProvider): string {
    let handler = provider.mounte(this);
    this.providers.push(provider);
    return handler;
  }

  subscribe(consumer: AbstractConsumer): AbstractConsumer {
    return consumer;
  }
}