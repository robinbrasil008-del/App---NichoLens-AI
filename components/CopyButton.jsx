export default function CopyButton({ text }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="bg-green-600 text-white px-3 py-1 rounded"
    >
      Copiar
    </button>
  );
}
