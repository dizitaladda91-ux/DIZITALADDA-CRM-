const BrandMark = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    role="img"
    aria-label="Dizitaladda logo"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="dizitaladda-mark" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563eb" />
        <stop offset="1" stopColor="#4338ca" />
      </linearGradient>
    </defs>
    <path d="M9 7h14.2C34 7 40 14.1 40 24s-6 17-16.8 17H9V7Zm10 9v16h4.2c6.1 0 8.8-3.1 8.8-8s-2.7-8-8.8-8H19Z" fill="url(#dizitaladda-mark)" />
    <path d="m28.7 10.3 2.1 4.3 4.7.7-3.4 3.4.8 4.8-4.2-2.2-4.2 2.2.8-4.8-3.4-3.4 4.7-.7 2.1-4.3Z" fill="#f59e0b" />
  </svg>
);

export default BrandMark;
