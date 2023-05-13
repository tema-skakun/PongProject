# DebugService

`DebugService` is a utility class for managing debug output in your application. It allows you to register debug functions that print debug information at regular intervals. Use this service to keep track of and print debug information in a consistent and organized manner.

## Overview

The `DebugService` class provides the following method:

- `add(callback: DebugFunction)`: Registers a debug function that will be called to print debug information.

`DebugFunction` is a type alias for a function that returns an array of strings, with the first element being the debug label and the second element being the debug value:

```typescript
type DebugFunction = () => string[];
```

## Using the DebugService

Follow these steps to use the `DebugService` in your application:

1. Import the `DebugService` class where you want to manage debug output:

	```typescript
	import { DebugService } from './path/to/debug-service';
	```

2. Inject the `DebugService` class as a dependency:

	```typescript
	constructor(private debugService: DebugService) {}
	```

3. Define a debug function that returns an array of strings, with the first element being the debug label and the second element being the debug value:

	```typescript
	const myDebugFunction: DebugFunction = () => {
	return ["MyDebugLabel", "MyDebugValue"];
	};
	```

4. Register the debug function using the `add` method:

	```typescript
	this.debugService.add(myDebugFunction);
	```

Now, the registered debug function will be called at regular intervals to print the debug information.

## Example Usage

Let's say you want to print the number of active connections in your application. First, define a debug function that returns the active connections count:

	```typescript
	const activeConnectionsDebugFunction: DebugFunction = () => {
	const activeConnections = getActiveConnections(); // Replace with your actual implementation
	return ["Active Connections", activeConnections.toString()];
	};
	```

Then, register the debug function using the `add` method:

	```typescript
	this.debugService.add(activeConnectionsDebugFunction);
	```

This example will print the active connections count at regular intervals.

---
