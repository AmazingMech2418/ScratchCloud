# ScratchCloud

ScratchCloud is a new, powerful, Scratch cloud data API for Node.js written by AmazingMech2418! 

## Features
- Scratch login session handling (no logouts)
- Cloud data manipulation
- Cloud data reading
- Async/await options (using promises)
- Ability to wait until a target variable is less than, greater than, not equal, or equal to a value
- Onload function to wait for a cloud variable to be loaded, for stability
- Built in functions to mimic Scratch's cloud variable functions
- Shows cloud changes that are NOT from your node program

## Examples

### Callbacks
```js
// Require module
const { Session, Cloud } = require('scratchcloud');

// Create user session
const project = 458027255 // Project ID
const session = new Session(process.env.USERNAME, process.env.PASSWORD, function(user) {
  // Create cloud session
  const cloud = new Cloud(user, project, function(error, cloud) {
    // On error, throw error
    if(error) throw error;
    
    // Wait until cloud variables have been loaded
    cloud.onload("cloud");
    cloud.onload("cloud2");
    
    // Log that the cloud session has started
    console.log("cloud started");
    // Repeat every second
    setInterval(()=>{
      // Set cloud variable to random number 1 to 10
      cloud.set('cloud', ''+Math.round(Math.random()*10));
    }, 1000);

    // On change of cloud variable (not including by your Node program), display change
    cloud.on('set', function(name, value) {
      console.log(name, value);
    });
    
    // Wait until a cloud variable is a specific value
    cloud.waitUntil("cloud", val => val > 4); // Cloud variable is greater than 4
    cloud.waitUntil("cloud", val => val !== 6); // Cloud variable isn't set to 6
    cloud.waitUntil("cloud", 5); // Cloud variable is set to 5
    
    // Change cloud variable by 5
    cloud.changeBy("cloud2", 5);
    cloud.changeBy("cloud", cloud.get("cloud2"));
  });
});

```

### Async
```js
// Require module
const { Session, Cloud } = require('scratchcloud');

// Async function to enable async/await
(async () => {
  // Create user session
  const user = await Session.createAsync(process.env.USERNAME, process.env.PASSWORD);
  const project = 458027255 // Project ID
  
  // Create cloud session
  const cloud = await Cloud.createAsync(user, project);
  
  // Wait until cloud variables have been loaded
  await cloud.onload("cloud")
  
  // Repeat every second
  let interval = setInterval(()=>{
    // Set cloud variable to random number 1 to 10
    cloud.set('cloud', ''+Math.round(Math.random()*10));
  }, 1000);
  // On cloud variable change, log the change
  cloud.on('set', (name, value) => {
    console.log(name, value);
  })
    
  // Wait until a cloud variable is a specific value
  await cloud.waitUntil('cloud', 10);  // Wait until cloud variable is 10
  await cloud.waitUntil("cloud", val => val > 4); // Cloud variable is greater than 4
  await cloud.waitUntil("cloud", val => val !== 6); // Cloud variable isn't set to 6
  
  // Change cloud variable by 5
  await cloud.changeBy("cloud", 5);
  
  // Clear interval for setting cloud variable
  clearInterval(interval);
})();
```



## Other Information

Use `cloud.vars` to get all the names and values of all the cloud variables in a project. All returned variables have the cloud symbol in front of them.

Note that you can use the cloud symbol in your variable names, but you do not have to. For example, you can use "☁ cloud" or just "cloud".
