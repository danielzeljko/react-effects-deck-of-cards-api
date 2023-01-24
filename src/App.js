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
 */

function App() {

  const [game, setGame] = useState({
    data: null,
    isLoading: true
  });

  const [card, setCard] = useState({})

  // fetch game and cards
  useEffect(function fetchCardAndSetCard() {
    // const cards = () => {..}
    // immediate invoked functions
    async function fetchDeckAndCard() {
      const deckResp = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=1`);
      const deck = deckResp.data;
      const cardResp = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/?count=52`);
      const cards = cardResp.data.cards;

      setGame({
        data: cards,
        isLoading: false
      });
      setCard(_.sample(cards))
    }
    fetchDeckAndCard();
  }, []);

  /** Get a random card */

  function pickAndReturnRandomCard(){
    setCard(_.sample(game.data))
  }

  return (
    <div className="App">
      <button onClick={pickAndReturnRandomCard}>Gimmie a card!</button>

      <div className="App-card">
        {card.isLoading && <p>Loading...</p>}
        {!card.isLoading && <img src={card.image} />}
      </div>
    </div>
  );
}

export default App;
