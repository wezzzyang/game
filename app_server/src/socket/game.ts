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

let room = [];

let checkerBoard = [];

for (let i = 0; i < 10; i++) {
  room.push([null, null]);
  checkerBoard[i] = checkerBoard[i] ? checkerBoard[i] : [];
  for (let j = 0; j < 441; j++) {
    checkerBoard[i][j] = null;
  }
}
 
@Provide()
@WSController('/game')
export class GameSocketController {
  @Inject()
  ctx: Context;

  @Inject()
  messageStoreService: MessageStoreService;



  @OnWSConnection()
  async onConnectionMethod() {
    this.ctx['user'] = await parseSocket(this.ctx.request);
  }
  
  @OnWSMessage('down')
  async downCheck(body) {
    if (typeof body === 'string') {
      let room = body.split('+')[1];
      let index = +body.split('+')[0];
      for (let i = 0; i < 441; i++) {
        checkerBoard[room][i] = null;
      }
      this.ctx.to("room" + room).emit('down', `${index == 0 ? '黑子' : '白子'}胜`);
      this.ctx.emit('down', `${index == 0 ? '黑子' : '白子'}胜`);
      return;
    }
    let { index, checkBoard, room } = body;
    checkerBoard[room] = checkBoard;
    this.ctx.to("room" + room).emit('down', {
      index: !index,
      checkerBoard:checkerBoard[room]
    });
    this.ctx.emit('down', {
      index: !index,
      checkerBoard:checkerBoard[room]
    });  
  }
  
  @OnWSMessage('leave')
  async leveRoom(index) {
    room[index][0] === this.ctx.id && (room[index][0] = null) ;
    room[index][1] === this.ctx.id && (room[index][1] = null);
    
    if (room[index].includes(null)) {
      this.ctx.to("room" + index).emit('start', false);
      this.ctx.to("room" + index).emit('down', `${room[index].indexOf(null) == 0 ? '黑子' : '白子'}跑`);
      this.ctx.emit('down', `${room[index].indexOf(null) == 0 ? '黑子' : '白子'}跑`); 
      this.ctx.nsp.emit('inRoom', room); 
      this.ctx.leave("room" + index);
    }
  }

  @OnWSMessage('room')
  @WSEmit('room')
  async setRoom(index) {
    let socketName = "room" + index;
    this.ctx.join("room" + index);

    this.ctx.on('disconnect', () => {
      room[index][0] === this.ctx.id && (room[index][0] = null) ;
      room[index][1] === this.ctx.id && (room[index][1] = null);
      if (room[index].includes(null)) {
        this.ctx.to(socketName).emit('start', false);
        this.ctx.leave("room" + index);
        this.ctx.to(socketName).emit('down', `${room[index].indexOf(null) == 0 ? '黑子' : '白子'}跑`);
        this.ctx.emit('down', `${room[index].indexOf(null) == 0 ? '黑子' : '白子'}跑`); 
        this.ctx.nsp.emit('inRoom', room); 
      }
    })

    if (room[index].includes(null)) {
      if (room[index][0] === null) {
        room[index][0] = this.ctx.id;
        this.ctx.nsp.emit('inRoom', room);
        this.ctx.emit(socketName, {
          color: 0,
          data: JSON.stringify(room[index])
        });
        if (!room[index].includes(null)) {
          this.ctx.to(socketName).emit('start', true);
          this.ctx.emit('start', true);
        } else {
          this.ctx.to(socketName).emit('start', false);
          this.ctx.emit('start', false);
        };
        return;
      };
      if (room[index][1] === null) {
        room[index][1] = this.ctx.id;
        this.ctx.nsp.emit('inRoom', room);
        this.ctx.emit(socketName, {
          color: 1,
          data: JSON.stringify(room[index])
        });
        if (!room[index].includes(null)) {
          this.ctx.to(socketName).emit('start', true);
          this.ctx.emit('start', true);
        } else {
          this.ctx.to(socketName).emit('start', false);
          this.ctx.emit('start', false);
        };
        return;
      };
    } 
    this.ctx.nsp.emit('inRoom', room);
    this.ctx.emit(socketName, false);
    if (!room[index].includes(null)) {
      this.ctx.to(socketName).emit('start', true);
      this.ctx.emit('start', true);
    } else {
      this.ctx.to(socketName).emit('start', false);
      this.ctx.emit('start', false);
    };
    return;

  }

  @OnWSMessage(SocketRequestEvent.GREET)
  @WSEmit(SocketResponseEvent.GREET)
  async gotMessage(data1) {
    this.messageStoreService.test(data1);
    this.ctx.nsp.emit(data1.name, `${this.ctx.id}：${data1.value}`);
    return '';
  }
}
