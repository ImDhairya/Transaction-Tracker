import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState("");

  useEffect(() => {
    getTransactions().then(setTransactions);
  });

  async function getTransactions() {
    const url = import.meta.env.VITE_REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = import.meta.env.VITE_REACT_APP_API_URL + "/transaction";
    const nameAndPrice = name.split(" ");
    const price = nameAndPrice[0];
    const nameWithoutPrice = nameAndPrice.slice(1).join(" ");

    if (nameWithoutPrice === "") {
      console.error("Name is required");
      return;
    }
    if (isNaN(price) ) {
      alert('Enter a real value');
      return;
    }
    

    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        price,
        name: nameWithoutPrice,
        description,
        datetime,
      }),
    }).then((response) => {
      response.json().then((json) => {
        setName("");
        setDatetime("");
        setDescription("");
        console.log("result", json);
      });
    });
  }
  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  balance = balance.toFixed(2);
  const franction = balance.split(".")[1];
  balance = balance.split(".")[0];

  function handleDelete(id) {
    const url = import.meta.env.VITE_REACT_APP_API_URL + "/transaction/" + id;
    fetch(url, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        // Remove the transaction from the UI here
        console.log("Transaction deleted successfully ");
      } else {
        console.error("Error deleting transaction");
      }
    });
    {
      console.log(url);
    }
  }

  return (
    <>
      <main>
        <h1>
          ${balance}
          <span>{franction}</span>{" "}
        </h1>
        <form onSubmit={addNewTransaction}>
          <div className="basic">
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              placeholder="+200 new samsung tv"
            />
            <input
              value={datetime}
              onChange={(ev) => setDatetime(ev.target.value)}
              type="datetime-local"
              placeholder=""
            />
          </div>
          <div className="description">
            <input
              type="text"
              placeholder={"description"}
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />
          </div>

          <button type="submit">Add new transaction</button>

          {/* {transactions.length} */}
        </form>

        <div className="transactions ">
          {transactions.length > 0 &&
            transactions.map((transaction) => (
              <div className="transaction">
                <div className="left">
                  {/* {transaction._id} */}
                  <div className="name">{transaction.name}</div>
                  <div className="description">{transaction.description}</div>
                  <button onClick={() => handleDelete(transaction._id)}>
                    Delete
                  </button>
                </div>
                <div className="right">
                  <div
                    className={
                      "price " + (transaction.price > 0 ? "green" : "red")
                    }
                  >
                    {transaction.price}
                  </div>
                  <div className="datetime">{transaction.datetime}</div>
                </div>
              </div>
            ))}
          <div className="transaction"></div>
        </div>
      </main>
    </>
  );
}

export default App;
