# milo.js
A tiny VDOM rendering framework inspired by Elm

## Background
I'm personally a big fan of the wonderful [Vanilla JS](http://vanilla-js.com) framework,
particularly for its tiny footprint and fast 
[rendering speed](http://www.stefankrause.net/js-frameworks-benchmark7/table.html).
However, I also believe that the declarative style of Elm/React and the frameworks they
have inspired can greatly improve the maintainablity of modern web applications.

milo.js is an attempt to make the smallest useful VDOM based framework. It is heavily
inspired by React, Redux and the Elm architecture. It exists as a proof of concept which
should not be considered appropriate for production use.

## Usage

Milo exposes two functions: `app` and `html`. `html` is used to create VDOM nodes,
while `app` bootstraps an application onto the page.

The functions have the following signature (using the [flowtype](https://flow.org/)
syntax).

```javascript

function html(
    // The tag name
    tag: string,
    // A map of attributes to their values
    attributes: {[string]: string},
    // Children are strings (for text content)
    // or another Milo element (created with `html`)
    children: Array<string|MiloElement>
): MiloElement;

function app<StateType, ActionType>(
    // The root element of the application
    el: HTMLElement,
    // The initial internal state of the application
    initialState: StateType,
    // A function which updates the state based on some action
    update: (action: ActionType, state: StateType) => StateType,
    // A function which returns the UI of the application for a given state
    view: (state: StateType, dispatch: (ActionType) => void) => MiloElement
): MiloApp

type MiloApp<StateType, ActionType> = {
    // Get the current state of the application
    state: () => StateType,
    // Dispatch an action to the application
    dispatch: (ActionType) => void
};

```

## Example

Here is an example of how to build an increment counter app using milo.

```javascript
import milo from './milo.js';

// This is aliased for convenience
const h = milo.html;

// `action` is an action passed to the dispatch function
// `state` represents the current state of the application
// Update acts as the "reducer" for our application, although it need not be a pure function
function update(action, state) {
    if (action === 'increment') {
        return {counter: state.counter + 1};
    } else if (action === 'reset') {
        return {counter: 0};
    }
}

// The view should be a pure function of the application state
// The `dispatch` function can be used in callbacks to update the state
function view(state, dispatch) {
    return [
        // using the milo.html function we create virtual dom nodes
        h('pre', {}, [state.counter]),
        h('button', {onclick: () => dispatch('increment')}, ['increment']),
        h('button', {onclick: () => dispatch('reset')}, ['reset']),
    ];
}

// This function returns the initial state of the application
function state() {
    return {counter: 0}
}

// Here we create the app and everything is wired together
window.app = milo.app(document.body, state(), update, view);
```

## The name

[Milo](https://en.wikipedia.org/wiki/Milo_(drink)) is a kind of malt drink
powder popular in Australia which happens to go well with vanilla ice cream.

## License

MIT

## See also

[The Elm Architecture](https://guide.elm-lang.org/architecture/)
