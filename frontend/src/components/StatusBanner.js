export default function StatusBanner({ status }) {
  return (
    <p
      style={{
        padding: "0.5rem",
        background: status.ok ? "#def7ec" : "#fde2e2",
        whiteSpace: "pre-wrap",
      }}
    >
      {status.ok
        ? `✅ Paid $${(status.payment.amount / 100).toFixed(2)}  |  ID: ${status.payment.id}`
        : `❌ ${status.error}`}
    </p>
  );
}