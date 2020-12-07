const Session = require('./session.js');
const Cloud = require('./cloud.js');

(async () => {
  const user = await Session.createAsync(process.env.USERNAME, process.env.PASSWORD);
  const cloud = await Cloud.createAsync(user, 458027255);
  let interval = setInterval(()=>{
    cloud.set('☁ cloud', ''+Math.round(Math.random()*10));
  }, 1000);
  cloud.on('set', (name, value) => {
    console.log(name, value);
  })
  await cloud.waitUntil('☁ cloud', 10);
  clearInterval(interval);
})();

/*
const session = new Session(process.env.USERNAME, process.env.PASSWORD, function(user) {
  const cloud = new Cloud(user, 458027255, function(error, c) {
    if(error)throw error;
    console.log("cloud started ")
    setInterval(()=>{
    c.set('☁ cloud', ''+Math.round(Math.random()*10));
    }, 1000);
    c.on('set', function(name, value) {
      console.log(name, value);
    });
  })
});
*/
/*


const session = new Session(process.env.USERNAME, process.env.PASSWORD, function(user) {
  const cloud = new Cloud(user, 12778537, function(error, c) {
    if(error)throw error;
    console.log("cloud started ")
    setInterval(()=>{
    c.set('☁ high score', ''+10000000000000000000);
    }, 1000);
    c.on('set', function(name, value) {
      console.log(name, value);
    });
  })
});*/