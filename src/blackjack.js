const redux = require('redux');

// Store, Actions, Reducers

//Basic BlackJack example

//intiialize - start with a fresh deck
//shuffle - shuffle the deck
//deal -  give two cards to dealer and player
//hit - give one card to player
//finish round - return all cards back to deck

// const storeStructure {
//     deck: [],
//     dealer: [],
//     player: [],
// }

function createDeck() {
    const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    const faces = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

    const deck = []
    for (let suit of suits) {
        for (let face of faces) {
            deck.push({suit, face})
        }
    }
    return deck
}

//create reducer that accepts actions and returns
// a new state depending on the action
const reducer = (state, action) => {
    if (state === undefined) {
        return {
            deck: createDeck(),
            dealer: [],
            player: []
        }
    }

    switch (action.type) {
        case 'DEAL': {
            const copy = [...state.deck]
            return {
                deck: copy,
                dealer: [copy.pop(), copy.pop()],
                player: [copy.pop(), copy.pop()]
            }
        }
        case 'HIT': {
            const copy = [...state.deck]
            return {
                deck: copy,
                dealer: state.dealer,
                player: [...state.player, copy.pop()]
            }
        }

        case 'SHUFFLE': {
            const copy = [...state.deck];
        // shuffle deck with Fisher-Yates algorithm
        // swap every index of array with random index
            for (let index in copy) {
                // pick a random index
                let swapIndex = Math.floor(Math.random() * copy.length);
                // swap 2 cards between current index and random index
                let tempCard = copy[swapIndex];

                copy[swapIndex] = copy[index];
                copy[index] = tempCard;
            }

            return {
                deck: copy,
                dealer: state.dealer,
                player: state.player
            }
        }

        case 'FINISH HAND': {
            return {
                deck: [...state.deck, ...state.dealer, ...state.player],
                dealer: [],
                player: []
            }
        }
        default: {
            return state
        }
    }
};

//all of decks are "stored" here.
const store = redux.createStore(reducer);
store.subscribe(() => {
    const state = store.getState();
    console.log('deck:', state.deck.length);
    console.log('dealer:', state.dealer);
    console.log('player:', state.player);
    console.log();
});


//dispatching the actions is the only way to interact with the store.
// DOES NOT AFFECT THE STATE ABOVE IN THE  ORIGINAL REDUCER
store.dispatch({type: 'SHUFFLE'});
store.dispatch({type: 'DEAL'});
store.dispatch({type: 'HIT'});
store.dispatch({type: 'HIT'});
store.dispatch({type: 'FINISH HAND'});

store.dispatch({type: 'SHUFFLE'});
store.dispatch({type: 'DEAL'});
store.dispatch({type: 'HIT'});
store.dispatch({type: 'FINISH HAND'});