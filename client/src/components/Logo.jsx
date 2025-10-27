export default function Logo({ size = 24, color = "#0d6efd" }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 48 48" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    >
      {/* Кольцо (намёк на колесо) */}
      <circle cx="24" cy="24" r="16" stroke={color} strokeWidth="3" />
      {/* Ключ */}
      <path
        d="M30 18l-8 8 3 3 8-8a5 5 0 10-3-3z"
        fill={color}
      />
      {/* Небольшая «спица» для читаемости */}
      <circle cx="24" cy="24" r="3" fill={color}/>
    </svg>
  );
}
