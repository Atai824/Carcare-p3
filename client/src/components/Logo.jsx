// client/src/components/Logo.jsx
import logoUrl from "../assets/Carcare.png";

export default function Logo({ size = 36, className = "" }) {
  return (
    <img
      src={logoUrl}
      alt="CarCare logo"
      width={size}
      height={size}
      draggable="false"
      className={`d-inline-block align-text-top ${className}`}
      style={{
        borderRadius: "50%",     // круг
        objectFit: "cover",      // обрезать до круга без искажений
        objectPosition: "center",
        backgroundColor: "#fff", // подложка на случай прозрачных краёв
        userSelect: "none",
      }}
    />
  );
}