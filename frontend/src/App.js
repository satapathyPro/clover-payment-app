import { useState, useEffect } from "react";
import ConnectClover from "./components/ConnectClover";
import PaymentForm from "./components/PaymentForm";
import StatusBanner from "./components/StatusBanner";

export default function App() {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((d) => setConnected(d.connected));
  }, []);

  const onPay = async (payload) => {
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) setStatus({ ok: true, payment: data });
      else throw new Error(data.error || "Unknown error");
    } catch (e) {
      setStatus({ ok: false, error: e.message });
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h2>Clover Demo</h2>
      {!connected ? (
        <ConnectClover />
      ) : (
        <>
          <PaymentForm onPay={onPay} />
          {status && <StatusBanner status={status} />}
        </>
      )}
    </div>
  );
}
