import axios from "axios";
import _ from "lodash";
import { useEffect, useState } from "react";

const BASE_URL = "https://deckofcardsapi.com/api/deck";

/**
 * Renders the Random Card application.
 *
 * It will only make a fetch request once to get all of the cards.
 *
 * State
 * - card {
      data: [{
        code: 'QC', image: 'https://deckofcardsapi.com/static/img/QC.png',
        images: {…}, value: 'QUEEN', suit: 'CLUBS'}, ...],
      isLoading: false
    }

    TODO:
    - disable button to draw a card or shuffle if shuffling is in progress
    - see if we could somehow reuse fetchCard() when reshuffling.
 */

function App() {

  const [game, setGame] = useState({
    deckId: null,
    cardsRemaining: null,
    isLoading: true
  });

  const [card, setCard] = useState({});

  useEffect(function fetchGame() {

    async function fetchDeckAndCard() {
      const deckResp = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=1`);
      const deckId = deckResp.data.deck_id;
      const cardResp = await axios.get(`${BASE_URL}/${deckId}/draw/?count=1`);
      const card = cardResp.data.cards[0];

      setGame(prevState => ({
        ...prevState,
        deckId,
        cardsRemaining:cardResp.data.remaining,
        isLoading: false
      }));
      setCard(card);
    }
    fetchDeckAndCard();
  }, []);

  async function fetchCard(){
    const resp = await axios.get(`${BASE_URL}/${game.deckId}/draw/?count=1`);
    const card = resp.data.cards[0];
    const remaining = resp.data.remaining;
    setCard(card);
    setGame(prevState=> ({
      ...prevState,
      cardsRemaining: remaining
    }))
  }

  async function shuffleCards(){
    const resp = await axios.get(`${BASE_URL}/${game.deckId}/shuffle/`);

    setGame(prevState => ({
      ...prevState,
      cardsRemaining:resp.data.remaining
    }))
    const resp2 = await axios.get(`${BASE_URL}/${game.deckId}/draw/?count=1`);
    const card = resp2.data.cards[0];
    setCard(card);
  }

  return (
    <div className="App">
      <button onClick={fetchCard}>Gimmie a card!</button>
      <button onClick={shuffleCards}>Return cards and Shuffle deck</button>
      <div className="App-card">
        {game.isLoading && <p>Loading...</p>}
        {!game.isLoading && game.cardsRemaining > 0 && <img src={card.image} />}
        {!game.isLoading && game.cardsRemaining === 0 && <p>Out of cards</p>}
      </div>
    </div>
  );
}

export default App;
