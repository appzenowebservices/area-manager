// src/components/dashboard/WelcomeBanner.jsx
import useAuthStore from "../../store/authStore";

/**
 * WelcomeBanner
 * Top greeting strip with live indicator and today's date.
 */
export default function WelcomeBanner() {
  const { user } = useAuthStore();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" :
    hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <style>{css}</style>
      <div className="wb-root">
        {/* Left */}
        <div className="wb-left">
          <div className="wb-greeting">
            {greeting}, {user?.name || "Area Manager"} 👋
          </div>
          <p className="wb-sub">
            Here's what's happening in your area today.
          </p>
        </div>

        {/* Right chips */}
        <div className="wb-right">
          <div className="wb-date-chip">
            📅 {today}
          </div>
          <div className="wb-live-chip">
            <span className="wb-dot" />
            Live Dashboard
          </div>
        </div>
      </div>
    </>
  );
}

const css = `
  .wb-root {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    background: linear-gradient(130deg, #ae2012 0%, #2d241e 100%);
    border-radius: 18px;
    padding: 1.3rem 1.75rem;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
  }
  .wb-root::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    pointer-events: none;
  }
  .wb-root::after {
    content: '';
    position: absolute;
    bottom: -50px; left: 30%;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    pointer-events: none;
  }
  .wb-left { position: relative; z-index: 1; }
  .wb-greeting {
    font-family: 'Sora', sans-serif;
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.01em;
  }
  .wb-sub {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.72);
    margin-top: 4px;
  }
  .wb-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }
  .wb-date-chip {
    background: rgba(255,255,255,0.14);
    border: 1px solid rgba(255,255,255,0.22);
    border-radius: 99px;
    padding: 0.38rem 1rem;
    color: rgba(255,255,255,0.9);
    font-size: 0.77rem;
    font-weight: 600;
    backdrop-filter: blur(6px);
    white-space: nowrap;
  }
  .wb-live-chip {
    display: flex;
    align-items: center;
    gap: 7px;
    background: rgba(255,255,255,0.14);
    border: 1px solid rgba(255,255,255,0.22);
    border-radius: 99px;
    padding: 0.38rem 1rem;
    color: #fff;
    font-size: 0.77rem;
    font-weight: 600;
    backdrop-filter: blur(6px);
  }
  .wb-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #4fbf6e;
    box-shadow: 0 0 0 3px rgba(12, 131, 31,0.3);
    animation: wb-pulse 1.6s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes wb-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.55; transform: scale(1.25); }
  }
  @media (max-width: 520px) {
    .wb-root { padding: 1rem 1.1rem; }
    .wb-date-chip { display: none; }
  }
`;
