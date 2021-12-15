import { useState, useEffect } from "react";
import { ZERO_ADDRESS, web3BNToFloatString } from "../utils";
import { getERC20Contract } from "../store/contractStore";
import BigNumber from "bignumber.js";
import BN from "bn.js";
import { useWeb3React } from "@web3-react/core";

export default function useBalance(tokens, decimals) {
  const [balance, setBalance] = useState([]);

  const { account, library } = useWeb3React();

  useEffect(() => {
    let isCancelled = false;

    function getBalance(token) {
      return new Promise((resolve) => {
        if (!library || !token) {
          console.log("token: " + token);
          resolve(new BN("0"));
          return;
        }

        try {
          if (token === ZERO_ADDRESS) {
            library.eth
              .getBalance(account)
              .then((value) => {
                resolve(new BN(value));
              })
              .catch((error) => {
                console.log(error);
                resolve(new BN("0"));
              });
          } else {
            const contract = getERC20Contract(token, library);
            contract?.methods
              .balanceOf(account)
              .call()
              .then((value) => {
                resolve(new BN(value));
              })
              .catch((error) => {
                console.log(error);
                resolve(new BN("0"));
              });
          }
        } catch (error) {
          resolve(new BN("0"));
        }
      });
    }

    async function run() {
      for (let i = 0; i < tokens.length; i++) {
        const http_response = await fetch(
          "https://api.pancakeswap.info/api/v2/tokens/" + tokens[i].address
        );

        const json = await http_response.json();

        const bn = await getBalance(tokens[i].address);
        if (!isCancelled) {
          const pow = new BigNumber("10").pow(new BigNumber(decimals));
          const data = web3BNToFloatString(bn, pow, 4, BigNumber.ROUND_DOWN);
          setBalance((prev) => [
            ...prev,
            { data, token: tokens[i], price: json?.data?.price || 0 },
          ]);
        }
      }
    }

    run();

    return () => {
      isCancelled = true;
    };
  }, [tokens.address, library, decimals, account]);

  return [balance];
}
