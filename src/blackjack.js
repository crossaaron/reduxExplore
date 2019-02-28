const redux = require('redux');

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
            if (state.deck.length < 4) {
                return state
            }
            const copy = [...state.deck];
            return {
                deck: copy,
                dealer: [copy.pop(), copy.pop()],
                player: [copy.pop(), copy.pop()]
            }
        }
        case 'HIT': {
            if (state.deck.length < 4) {
                return state
            }
            if (handValue(state.player) >= 21) {
                return state
            }
            const copy = [...state.deck];
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

function cardValue(card) {
    if (card.face ==='A') {
        return 11
    } if ('JQK'.indexOf(card.face) >= 0) {
        return 10
    } else {
        return card.face
    }
}

function handValue(hand) {
    return hand.map(cardValue).reduce((a,b) => a + b, 0)
}
//all of decks are "stored" here.
const store = redux.createStore(reducer);
store.subscribe(() => {
    const state = store.getState();
    const dealerScore = handValue(state.dealer);
    const playerScore = handValue(state.player);

    console.log('deck:', state.deck.length);
    console.log(dealerScore, 'dealer:', state.dealer);
    console.log(playerScore, 'player:', state.player);
    console.log();
});


//dispatching the actions is the only way to interact with the store.
// DOES NOT AFFECT THE STATE ABOVE IN THE  ORIGINAL REDUCER
store.dispatch({type: 'SHUFFLE'});
store.dispatch({type: 'DEAL'});
store.dispatch({type: 'HIT'});
store.dispatch({type: 'HIT'});
store.dispatch({type: 'FINISH HAND'});



const keypress = require('keypress');
keypress(process.stdin);

const MENU = '(r) shuffle (d) deal (h) hit (f) finish hand (x) quit'
console.log(MENU);

process.stdin.on('keypress', (ch, key) => {
    if (key.name === 'x') {
        process.stdin.pause()
    } else if (key.name === 'r') {
        store.dispatch({type: 'SHUFFLE'});
    } else if (key.name === 'd') {
        store.dispatch({type: 'DEAL'});
    } else if (key.name === 'h') {
        store.dispatch({type: 'HIT'});
    } else if (key.name === 'f') {
        store.dispatch({type: 'FINISH HAND'});
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();