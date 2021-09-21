import {
  WSController,
  OnWSMessage,
  Provide,
  OnWSConnection,
  Inject,
  WSEmit,
} from '@midwayjs/decorator';
import { SocketRequestEvent, SocketResponseEvent } from '../interface';
import { Context } from '@midwayjs/socketio';
import { MessageStoreService } from '../service/messageStore';
import { parseSocket } from '../utils/jwtUtils';

@Provide()
@WSController('/test')
export class HelloSocketController {
  @Inject()
  ctx: Context;

  @Inject()
  messageStoreService: MessageStoreService;

  @OnWSConnection()
  async onConnectionMethod() {
    console.log(this.ctx.id);
    this.ctx['user'] = await parseSocket(this.ctx.request);
  }

  @OnWSMessage(SocketRequestEvent.GREET)
  @WSEmit(SocketResponseEvent.GREET)
  async gotMessage(data1) {
    console.log('this.ctx', this.ctx['user'].alias);
    this.messageStoreService.test(data1);
    this.ctx.nsp.emit(data1.name, `${this.ctx.id}：${data1.value}`);
    return '';
  }
}
