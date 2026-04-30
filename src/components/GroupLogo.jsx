import { useState } from 'react';
import { getFallbackIco } from '../data/groups';

export default function GroupLogo({ groupId, groupName, size = 36, imgClassName = 'alogo-img', fbSize }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const fallback = getFallbackIco(groupId, null, 'active');
  const url = `https://images.ransomware.live/logos/${encodeURIComponent(groupId)}.png`;
  const emojiSize = fbSize || size * 0.55;

  return (
    <>
      {!error && (
        <img
          src={url}
          alt={groupName}
          className={imgClassName}
          style={{ display: loaded ? 'block' : 'none', maxWidth: '90%', maxHeight: '90%' }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
      {(error || !loaded) && (
        <span style={{ fontSize: emojiSize }}>{fallback}</span>
      )}
    </>
  );
}
