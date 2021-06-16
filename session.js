const fetch = require('node-fetch');


const cookie = {
  parse: c => {
    let cookies = {};
    c.split(';').forEach(item => {
      if(['Domain', 'expires', 'Path', 'Max-Age'].includes(item.split('=')[0].trim())) {} else
      if(item.indexOf('=') != -1)
        cookies[item.split('=')[0].trim()] = item.split('=')[1].trim()
    });
    return cookies;
  }
}


class Session {
  constructor(username = process.env.USERNAME, password = process.env.PASSWORD, callback) {
    if(!process.env.TOKEN && !this.token) {
      this.getCSRFToken(() => {
        construct(username, password, callback);
      });
    } else {
      construct(username, password, callback);
    }
  }
  
  construct(username, password, callback) {
    let self = this;
    fetch('https://scratch.mit.edu/accounts/login/', {
      method: "POST",
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'referer': 'https://scratch.mit.edu',
        'X-CSRFToken': self.token || process.env.TOKEN || 'a',
        'Cookie': `scratchcsrftoken=${self.token || process.env.TOKEN || 'a'}; scratchlanguage=en;`,
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        useMessages: true
      }),
      "referrer": "https://scratch.mit.edu/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "mode": "cors",
      "credentials": "include"
    }).then(r=>{
        let arr = Array.from(r.headers.get('set-cookie').split(', '));
        arr = arr.map(cookie.parse);
        let obj = {};
        for (let i of arr)
          for (let j in i)
            obj[j] = i[j];
        self.session = obj.scratchsessionsid;
        self.token = obj.scratchcsrftoken.split('"').join('');
        return r.json()
      }).then(d=>{
        self.username = d[0].username;
        callback(this);
      });
  }
  
  getCSRFToken(callback) {
    const self = this;
    fetch("https://scratch.mit.edu/csrf_token/").then(r=>{
      let arr = Array.from(r.headers.get('set-cookie').split(', '));
      arr = arr.map(cookie.parse);
      let obj = {};
      for (let i of arr)
        for (let j in i)
          obj[j] = i[j];
      self.token = obj.scratchcsrftoken.split('"').join('');
      callback();
    }
  }
}
Session.createAsync = (username = process.env.USERNAME, password = process.env.PASSWORD) => {
  return new Promise((resolve, reject) => {
    const session = new Session(username, password, resolve);
  });
}

module.exports = Session;
