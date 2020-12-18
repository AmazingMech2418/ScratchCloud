const WebSocket = require('ws');
const events = require('events');

class Cloud {
  constructor(user, id, callback) {
    this.waits = [];
    this.user = user;
    this.project = ''+id;
    this.vars = {};
    this.attempts = [];
    this.eventEmitter = new events.EventEmitter();
    this._connect(err => {
      if(err)throw err;
      callback(null, this);
    });
  }
  on(event, callback) {
    this.eventEmitter.on(event, callback);
  }
  _connect(callback) {
    const self = this;
    this.conn = new WebSocket("wss://clouddata.scratch.mit.edu/", [], {headers:{cookie:`scratchsessionsid=${self.user.session};`,origin:'scratch.mit.edu'}});
    this.conn.on('close',()=>{self._connect();});
    this.conn.on('open', ()=>{
      self._send('handshake', {});
      for(let i of self.attempts) {
        self._send(i);
      }
      self.attempts = [];
      callback();
    });

    let stream = '';
    this.conn.on('message', chunk => {
      stream += chunk;
      let packets = stream.split('\n');
      let last = packets.pop();
      for(let line of packets) {
        try {
        const packet = JSON.parse(line);
        if(packet.method == 'set') {
          self.vars[packet.name] = packet.value;
          self.eventEmitter.emit('set', packet.name, packet.value);
        }
        } catch(e){return;}
      }
      stream = last;
    });

    this.on('set', (name, value) => {
      for(let j in self.waits) {
        let i = self.waits[j];
        if(name == i[0] && +value == +i[1]) {
          i[2]();
          self.waits.splice(j, 1);
        }
      }
    });
  }
  _send(method, options) {
    const data = JSON.stringify(Object.assign({user:this.user.username,project_id:this.project,method:method}, options)) + '\n';
    if(this.conn.readyState == WebSocket.OPEN) {
      this.conn.send(data);
    } else {
      this.attempts.push(data);
    }
  }
  endConnection() {
    this.conn.close();
  }
  set(name, val) {
    this.eventEmitter.emit("setByServer", name, val);
    this._send('set', {name:name,value:val});
    this.vars[name] = val;
  }
  get(name) {
    return this.vars[name];
  }
  waitUntil(target, targetVal) {
    return new Promise((resolve, reject) => {
      this.waits.push([target, targetVal, resolve]);
    });
  }
}

Cloud.createAsync = (user, id) => {
  return new Promise((resolve, reject) => {
    const cloud = new Cloud(user, id, (err, data) => {
      if(err)reject(err);
      else resolve(data);
    });
  });
}

module.exports = Cloud;