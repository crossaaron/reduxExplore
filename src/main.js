const createStore = require('redux').createStore;

// creating a 'reducer' function
const counter = (state = 0, action) => {
    switch(action.type) {
        case 'increment':
            return state + 1;
        case 'decrement':
            return state - 1;
        default:
            return state
    }
};

const store = createStore(counter);
store.subscribe(() => console.log(store));

store.dispatch({type: 'increment'});
store.dispatch({type: 'increment'});
store.dispatch({type: 'decrement'});