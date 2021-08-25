# @real-estate/core

Great for:

-   Simple applications
-   Complex applications
-   Readable code nerds
-   JavaScript object lovers

#### Step 0: Install real-estate

```bash
npm install @real-estate/core

# If you use React, check out @real-estate/react
```

This is probably the simplest state library you will ever see. But due to the watch function it can do awesome stuff

It is great in MVU and MVVM architecture, which uses a lot of data bindings. This makes it simpler, and probably cleaner too.

#### tl;dr

(you should read the whole readme, but here is the summery)

```typescript
import RState from "@real-estate/core";
const state = new RState(0); // 0 is the initial value. Can be any datatype you want

const value = state.get(); // returns the current state value
state.set(1); // sets new value to state

state.watch((currState) => {
    // Watches the state for changes

    // Both these work
    console.log(currState);
    console.log(state.get());
});
```

#### Step 1: Define a data tree

Can be any structure you want that implement `new RState(initialValue)`

For example a nested object:

```typescript
import RState from "@real-estate/core";

const dt = {
    count: new RState(0),
    data: {
        // Since a JS object can be nested, we support namespaces out of the box
        items: new RState([]),
        folders: new RState<String[]>([]), // For TypeScript users: It's generic, so you can specify an interface. Or not. Up to you
    },
};
```

Or maybe this (any variable, object etc in js that can hold an instance of a class can be used)

```typescript
const myStateCounter = new RState(0);
const myStateData = {
    items: new RState([]),
    folders: new RState<String[]>([]),
};
```

#### Step 2: Sets a new state

```typescript
dt.count.set(2);
```

#### Step 3: Reads the newest state

```typescript
const currNum = dt.count.get();
console.log(currNum);
```

#### Step 4: Watch a state for changes

```typescript
dt.count.watch((state) => {
    console.log(state);
});
```

**Or**

```typescript
dt.count.watch(() => {
    console.log(dt.count.get());
});
```

The watcher returns a watcher id, which can be unregistered later

```typescript
const watcherId = dt.count.watch((state) => {
    console.log(state);
});

dt.count.deleteWatcher(watcherId);
```

#### Get State Id

Each state returns a unique id, so it's easy to organize states in loops etc.

```typescript
const id = dt.count.getStateId();
```

#### Watch multiple states

This function watches multiple states for changes. The first argument is an array of states to watch, and the second is the callback function.

```typescript
import { MultiWatcher } from "@real-estate/core";

MultiWatcher([dt.count], () => {});
```

#### Call watcher on initialization

If you want to call the function you register in state on initialization, here's how:

##### Watcher:

```typescript
dt.count.watch((state) => {}, true);
```

##### Multi Watcher:

```typescript
MultiWatcher([dt.count], () => {}, true);
```

#### Clean code tips

##### Try to not change state from the watch function. Keep state changes to separate functions.

```typescript
// Wrong
const counter = RState(0);
const counter2 = RState(0);

counter.watch((state) => {
    console.log(state);
    counter2.set(state + 1); // avoid .set inside .watch
});

// Right
const increment = () => {
    // Use a function to update both states instead
    counter.set(counter.get() + 1);
    counter2.set(counter2.get() + 1);
};
```

##### Use an object to create nested state. This ensures clean namespacing

```typescript
const stateTree = {
    global: {
        counter: new RState(0),
    },
};
```

##### Export named instead of default. This makes state searchable

```typescript
export { stateTree };
```

There are many state libraries out there. There are full fledged solutions like Redux and MobX. And there are small solutions like this one. So why build a new state library? Well, I didn't find quite a simple solution like this. This library is fully type safe (for TypeScript users), it doesn't rely on strings for indexing state, so it's a lot more security around it. It is also very small, and adds very little code to your bundle. That's always a plus. Even though the library is primary meant for small applications, It will probably scale just as well if used in a major application. But in bigger applications it is important to follow the clean code tips. Those ensures search ability and structure.
