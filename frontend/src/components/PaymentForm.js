import { useState } from "react";

export default function PaymentForm({ onPay }) {
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onPay({ amount: Math.round(parseFloat(amount) * 100), description: desc });
    setAmount("");
    setDesc("");
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: "1rem" }}>
      <input
        type="number"
        placeholder="Amount (USD)"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <button>Pay</button>
    </form>
  );
}