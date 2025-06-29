export default function ConnectClover() {
  const connect = async () => {
    const { url } = await fetch("/api/auth/login").then((r) => r.json());
    window.location.href = url; // redirect to Clover OAuth
  };
  return (
    <button style={{ padding: "0.5rem 1rem" }} onClick={connect}>
      Connect Clover Account
    </button>
  );
}