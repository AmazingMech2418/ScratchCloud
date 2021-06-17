# ScratchCloud

ScratchCloud is a new, powerful, Scratch cloud data API for Node.js written by AmazingMech2418! 

## Features
- Scratch login session handling
- Cloud data manipulation
- Cloud data reading
- Async/await options (using promises)
- Ability to wait until a target variable is a certain value (async only)

## Examples

### Callbacks
```js
// Require module
const {Session, Cloud} = require('scratchcloud');

// Create user session
const session = new Session(process.env.USERNAME, process.env.PASSWORD, function(user) {
  // Create cloud session
  const cloud = new Cloud(user, 458027255, function(error, c) {
    // On error, throw error
    if(error)throw error;
    // Log that the cloud session has started
    console.log("cloud started ")
    // Repeat every second
    setInterval(()=>{
      // Set cloud variable to random number 1 to 10
      c.set('cloud', ''+Math.round(Math.random()*10));
    }, 1000);

    // On change of cloud variable (not including by your Node program), display change
    c.on('set', function(name, value) {
      console.log(name, value);
    });
  })
});

```

### Async
```js
// Require module
const {Session, Cloud} = require('scratchcloud');

// Async function to enable async/await
(async () => {
  // Create user session
  const user = await Session.createAsync(process.env.USERNAME, process.env.PASSWORD);
  // Create cloud session
  const cloud = await Cloud.createAsync(user, 458027255);
  // Repeat every second
  let interval = setInterval(()=>{
    // Set cloud variable to random number 1 to 10
    cloud.set('cloud', ''+Math.round(Math.random()*10));
  }, 1000);
  // On cloud variable change, log the change
  cloud.on('set', (name, value) => {
    console.log(name, value);
  })

  // Wait until cloud variable is 10
  await cloud.waitUntil('cloud', 10);
  // Clear interval for setting cloud variable
  clearInterval(interval);
})();
```



## Other Information
You can use the `cloud.get(variableName)` to get the value of a cloud variable by name.

Use `cloud.vars` to get all the names and values of all the cloud variables in a project. All returned variables have the cloud symbol in front of them.

Also, note that you can use the cloud symbol in your variable names, but you do not have to.