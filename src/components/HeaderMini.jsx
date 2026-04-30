export default function HeaderMini({ page }) {
  return (
    <div className="dc-hdr-mini">
      <span className="dc-mini-sigma">Σ</span>
      <div className="dc-mini-sep"></div>
      <span className="dc-mini-name">DECK-CORE</span>
      <span className="dc-mini-page">{page}</span>
      <div className="dc-mini-live">
        <div className="ml-dot"></div>
        <span className="ml-txt">LIVE</span>
      </div>
    </div>
  );
}
