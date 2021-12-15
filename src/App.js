import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";
import './styles/main.css'
import { Home } from "./pages/Home";


function getLibrary(provider) {
  return new Web3(provider);
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Home />
    </Web3ReactProvider>
  );
}

export default App;
