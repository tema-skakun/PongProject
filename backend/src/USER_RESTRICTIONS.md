# UserRestriction Class

The `UserRestriction` class is a utility to manage user interactions with the server.
It allows you to define, activate, and restrict user actions throughout the application.
To ensure consistent and flexible user interaction management, please use this class when defining user actions that interact with the server.

## Overview
The `UserRestriction` class provides the following methods:

- switch(on: boolean, userId: string, action: string, props: any = undefined): Toggles the state of a user action.
- attachStateSwitch(userId: string, action: string, stateSwitch: SwitchFunction, initalState: boolean = true): Attaches a state switch function to a user action.

## Defining User Actions
To define a new user action, add a static property to the `UserRestriction` class with a unique name, like this:

```typescript
static your_new_action_name: string = "your_new_action_name";
```
Replace your_new_action_name with a descriptive name for the user action you're defining.

## Using the UserRestriction Class
Follow these steps to use the `UserRestriction` class in your application:

Import the `UserRestriction` class where you want to manage user interactions:

```typescript
import { UserRestriction } from './path/to/user-restriction';
Inject the UserRestriction class as a dependency:
```

```typescript
constructor(private userRestriction: UserRestriction) {}
```

Attach a state switch function to a user action using the `attachStateSwitch` method:

```typescript
Copy code
this.userRestriction.attachStateSwitch(userId, UserRestriction.your_new_action_name, yourStateSwitchFunction, initialState);
```

Replace `userId` with the user's ID, `UserRestriction.your_new_action_name` with the action you've defined, `yourStateSwitchFunction` with the function that will be called when the state changes, and `initialState` with the initial state of the action (defaults to true).

Toggle the state of a user action using the `switch` method:

```typescript
this.userRestriction.switch(on, userId, UserRestriction.your_new_action_name, props);
```
Replace `on` with a boolean indicating the desired state,
`userId` with the user's ID,
`UserRestriction.your_new_action_name` with the action you've defined,
and `props` with any additional properties required by the state switch function.

## Example Usage

Let's say you want to manage whether a user can submit a form. First, define a new user action in the `UserRestriction` class:

```typescript
static user_can_submit_form: string = "user_can_submit_form";
```

Then, in your service, attach a state switch function to the user action:

```typescript
this.userRestriction.attachStateSwitch(userId, UserRestriction.user_can_submit_form, this.submitFormStateSwitch, true);
```

Finally, use the `switch` method to toggle the state of the user action:

```typescript
this.userRestriction.switch(false, userId, UserRestriction.user_can_submit_form);
```

This example disables the `user_can_submit_form` action for the specified user.
