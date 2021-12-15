import { useWeb3React } from "@web3-react/core";
import { injected } from "../components/wallet";
import TokenListRinkeby from "../assets/token-list-rinkeby.json";
import { useEffect} from "react";
import useBalance from "../actions/useBalance.js";

export function Home() {
  const { activate, account } = useWeb3React();

  const [balances] = useBalance(TokenListRinkeby, 18);

  function copy(text) {
    var input = document.createElement("input");
    document.body.append(input);
    input.value = text;
    input.select();
    document.execCommand("copy");
    input.remove();
    alert("Foi copiado: " + text);
  }

  useEffect(() => {
    fetch("http://economia.awesomeapi.com.br/json/last/USD-BRL").then(
      (response) =>
        response.json().then((json) => {
          const div = document.getElementById("dol");
          div.innerText = json.USDBRL.low;
        })
    );
  }, [balances]);
  return (
    <div>
      <header>
        <div className="container ">
          <div className="d-flex justify-content-around align-items-center">
            <div>
              <img
                src={process.env.PUBLIC_URL + "/assets/scam128.png"}
                alt="Scam"
                className="align-content-center"
              />
            </div>
            <div>
              <button
                className="btn btn-primary limit"
                onClick={() =>activate(injected)}
              >
                Assinatura
              </button>
            </div>
          </div>
        </div>
        <hr />
      </header>
      <main>
        <div className="d-flex justify-content-center ">
          <div className="">
            <p className="dolar">
              BRL $ <span id="dol">1</span> = USD $ 1
            </p>
          </div>
        </div>
        <div className="container">
          <table className="table table-dark table-hover table-striped table-sm">
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Crypto</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Preço</th>
                <th scope="col">Acesso</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((balance, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td
                      className="select"
                      onClick={(event) => copy(event.currentTarget.innerText)}
                      value={index}
                    >
                      {balance.token.name}
                    </td>
                    <td value={index}>{balance.data}</td>
                    <td value={index}>
                      {" "}
                      USD $ {Number(balance.price).toFixed(4)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
      <footer>
        <div className="container-fluid">
          <div className="text-center d-flex justify-content-center">
            <a
              className=" btn btn-primary"
              href="https://poocoin.app"
              target="_blank"
            >
              PooCoin
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
