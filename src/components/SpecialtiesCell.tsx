export default function SpecialtiesCell({ items }: { items: string[] }) {
  return (
    <>
      {items.map((spec, i) => (
        <span key={i} style={{ display: "inline" }}>
          <span
            style={{
              display: "inline-block",
              background: "#f3f4f6",
              padding: "2px 6px",
              borderRadius: "4px",
              marginRight: "4px",
              fontSize: "12px",
            }}
          >
            {spec}
          </span>
        </span>
      ))}
    </>
  );
}