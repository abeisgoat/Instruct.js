#Instruct.js

Realtime client-to-client function sync.

## Example


    // Include Instruct.js and intiialize it with your Firebase URL
    instruct = require('./instruct.js')('https://brilliant-fire-67.firebaseio.com/');

    // Create a new instruction by passing a function to "instruct"
    sayHello = instruct(function (message) {
        console.log("Say:", message);
    });
    
    // Call the instruction to log your message locally and on all other clients.
    sayHello("Ellollo!");

## About

Instruct.js provides a layer of abstraction on top of realtime data synchronization (powered by Firebase) which allows you to build realtime, collaborative applications faster by leveraging function call level syncronization between clients. In other words, Instruct.js allows you to call a function on your client (in the Browser or in NodeJS) and have that same function invoked in the same way on all other clients. You never deal with the realtime communication or the syncronization of data, you just know that your function will be called in the same way on every active client.

### Why?

Because you don't care about data (even though you may think you do). Don't get me wrong, I love data, data is great, and it is the life-blood of every application. However, handling the data of your application is like handling raw iron ore when all you want is the final suit of armor. If we can avoid it, we might as well do so. When building realtime applications, I often end up writing code to glue the source of my data to my application. This code looks at new data, determines why the new data exists, then calls the right functions which update the actual state of my application. This is dumb. We can cut out a step by sending our incoming data straight into the methods who need it most. Instruct.js exists to do exactly this.

### Is this secure?

Yes, very. You must understand that Instrust.js is inheritly based around the idea of a "whitelist" of availible methods and as such does not allow arbirary execution of code. A client can only execute functions which it has created instructions for. In other words, a malicious user could create their own instruction on their client and attempt to call it. This call would be sent out to all the clients and every other client would look at that call dumbfounded with no idea how to execute it, then just ignore it and go about it's day.

## Advanced Instructing

Instruct.js allows you to have a many-to-many function call relationship between clients, but this is only the highest level use of Instrust.js. At it's core, Instruct.js provides a realtime syncronized eventing system. Lets take a look at using two scripts (a client and a server) using Instruct.js to do syncronized eventing. First the client:

    // Create a new instruction event callback by passing a function to "instruct" along with a unique ID
    instruct("say", function (message) {
        console.log("Say:", message);
    });
    
Then the server:

    // Create a new instruction with the same unique ID as the client
    var say = instruct("say");
    
    // Call the instruction to log your message on all other clients.
    say("I am the server, worship me!");
    
As you can see, this provides us with a one-to-many eventing system. 