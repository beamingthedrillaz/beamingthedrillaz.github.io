


const connectWallet = async () => {
  if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
          try {
              const resp = await window.solana.connect();
              resp.publicKey.toString()
              console.log("My public key", resp.publicKey.toString());
              document.getElementById('connectione').innerHTML = 'Connected' ;

              // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
          } catch (err) {
              // { code: 4001, message: 'User rejected the request.' }
          }
          const isPhantomInstalled = window.solana && window.solana.isPhantom;

          console.log("isPhantomInstalled?", isPhantomInstalled);
          return provider;
      }
  }
  // window.open("https://phantom.app/", "_blank");
};        
const sendRequest = async (transactionData) => {

  const network = "https://api.mainnet-beta.solana.com/";
  const connection = new solanaWeb3.Connection(network);

  try {

      const { signature } = await window.solana.request({

          method: "signAndSendTransaction",
          params: {
               message: transactionData,
          },

      })

      console.log("Signature! signature", signature);

      console.log("Done! You can view the transaction at https://explorer.solana.com/tx/" + signature + ". If you are using devnet, add `?cluster=devnet` to the end of the url.")


      await connection.confirmTransaction(signature).then(data => {
          console.log("Done!", data);
      });

  } catch (error) {

      alert(String(error['message']));

  }

}

const transfer = async () => {

  const resp = await window.solana.connect();

  fetch("https://api.blockchainapi.com/v1/solana/wallet/transfer", {

      method: "POST",
      
      // Do NOT put your keys in a *public* HTML file. This is ONLY for testing purposes.
      headers: {
          'Content-Type': 'application/json',
          'APIKeyId': 'we5jeAGjZXUac6j', // INSERT-API-KEY-ID
          'APISecretKey': 'mLXCeMPaQQbXkfq' // INSERT-API-SECRET-KEY
      },

      body: JSON.stringify({
              'sender_public_key': resp.publicKey.toString(),
              'recipient_address': 'CNVsjQHE2HjhGbtPfEaJWkrsXH7maGJg3jA5XhZq6FMN',
              'return_compiled_transaction': true,
              'token_address': 'C4PgRkf9oLqiyZEFr99gzmW42HXJAceZYJpKjCD4Yi8Z',
              'network': 'mainnet-beta'
          }
      )

  }).then(res => {

      res.json().then(data => {

          console.log("Blockchain API request complete! response:", data, res);

          if (data['b58_compiled_transaction'] === undefined) {

              if (data['error_message'] === undefined) {

                  alert("Unknown error");

              } else {

                  alert("Blockchain API Error: " + String(data['error_message']))

              }

          } else {

              const transactionData = data['b58_compiled_transaction'];
              console.log("Unsigned transaction: ", transactionData);

              sendRequest(transactionData);

          }

      });


  });

}