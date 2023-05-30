import { useState } from "react";

import "./App.css";
import Wallet from "./Components/Wallet/Wallet";
import AddToCreditSystem from "./Components/AddToCreditSystem/AddToCreditSystem";
import Transfer from "./Components/Transfer/Transfer";
import ExtraToken from "./Components/ExtraToken/ExtraToken";

function App() {
  const [state, setState] = useState({
    signer: null,
    contract: null,
  });

  const [balance, setBalance] = useState(0);

  const saveState = (newState) => {
    setState(newState);
  };

  const saveBalance = (newBal) => {
    setBalance(newBal);
  };

  return (
    <div className="App">
      <Wallet saveState={saveState} saveBalance={saveBalance} />
      <div className="display-balance">
        <span>User Balance:</span> {balance} <span>TT</span>
      </div>
      <Transfer state={state} saveBalance={saveBalance} />

      <h1>Only Owner accessible functionalities:</h1>

      <h4>To add a user to credit system</h4>
      <AddToCreditSystem state={state} />

      <h4>To mint extra token to a user</h4>
      <ExtraToken state={state} />
    </div>
  );
}

export default App;
