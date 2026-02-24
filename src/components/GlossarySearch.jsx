import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { modules } from '../pages/Modules';

/* ─── tiny style block injected once ─── */
const CSS = `
  .gs-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  /* the pill that expands */
  .gs-bar {
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: 999px;
    background: #fff;
    border: 2px solid transparent;
    transition: width 0.35s cubic-bezier(.4,0,.2,1),
                border-color 0.25s ease,
                box-shadow 0.25s ease;
    width: 0;
  }
  .gs-bar.open {
    width: min(320px, 72vw);
    border-color: #c5a0b0;
    box-shadow: 0 4px 20px rgba(120,60,80,.12);
  }

  .gs-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.875rem;
    color: #3b1f2b;
    padding: 6px 0 6px 14px;
    min-width: 0;
    font-family: inherit;
  }
  .gs-input::placeholder { color: #b09aa4; }

  .gs-clear {
    background: none;
    border: none;
    padding: 0 10px;
    color: #b09aa4;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    transition: color 0.15s;
  }
  .gs-clear:hover { color: #7a3a50; }

  /* magnifier button */
  .gs-icon-btn {
    background: none;
    border: none;
    padding: 6px;
    cursor: pointer;
    color: #6b4c57;
    border-radius: 50%;
    transition: background 0.2s, color 0.2s, transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    z-index: 1;
  }
  .gs-icon-btn:hover { background: #f3e8ec; color: #4a1e2e; }
  .gs-icon-btn.active {
    color: #4a1e2e;
    transform: rotate(-15deg) scale(1.1);
  }

  /* dropdown */
  .gs-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: min(360px, 90vw);
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 40px rgba(80,30,50,.18), 0 1px 4px rgba(80,30,50,.08);
    border: 1px solid #ecd9e0;
    overflow: hidden;
    z-index: 1050;
    animation: gsSlideIn 0.22s cubic-bezier(.4,0,.2,1);
    max-height: 420px;
    overflow-y: auto;
  }
  @keyframes gsSlideIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }

  .gs-section-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #b09aa4;
    padding: 10px 16px 4px;
  }

  .gs-result {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 10px 16px;
    cursor: pointer;
    transition: background 0.15s;
    text-decoration: none;
    border-bottom: 1px solid #f7f0f2;
  }
  .gs-result:last-child { border-bottom: none; }
  .gs-result:hover, .gs-result:focus { background: #fdf0f3; outline: none; }

  .gs-term {
    font-size: 0.875rem;
    font-weight: 600;
    color: #3b1f2b;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .gs-def {
    font-size: 0.75rem;
    color: #9a7a87;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .gs-module-tag {
    display: inline-block;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: #f3e8ec;
    color: #7a3a50;
    border-radius: 999px;
    padding: 1px 7px;
    margin-top: 4px;
  }

  .gs-empty {
    padding: 20px 16px;
    text-align: center;
    color: #b09aa4;
    font-size: 0.85rem;
  }

  .gs-highlight {
    background: #ffd6e0;
    border-radius: 3px;
    padding: 0 1px;
    color: #5a1e34;
  }

  /* loading dots */
  .gs-loading {
    padding: 18px 16px;
    text-align: center;
    color: #c5a0b0;
    font-size: 0.82rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  .gs-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #c5a0b0;
    animation: gsBounce 1.2s ease-in-out infinite;
  }
  .gs-dot:nth-child(2) { animation-delay: 0.2s; }
  .gs-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes gsBounce {
    0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
    40%           { transform: scale(1);   opacity: 1; }
  }
`;

function injectStyles() {
  if (document.getElementById('gs-styles')) return;
  const tag = document.createElement('style');
  tag.id = 'gs-styles';
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

/* highlight matched substring */
function Highlight({ text, query }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="gs-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

/* map module title → id for URL */
function moduleIdFromTitle(title) {
  const m = modules.find((mod) => mod.title === title);
  return m ? m.id : null;
}

export default function GlossarySearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [allCards, setAllCards] = useState(null); // null = not loaded yet
  const [fetching, setFetching] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  injectStyles();

  /* load all flashcards once on first open */
  useEffect(() => {
    if (!open || allCards !== null) return;
    setFetching(true);
    getDocs(collection(db, 'flashcards'))
      .then((snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAllCards(data);
      })
      .catch(() => setAllCards([]))
      .finally(() => setFetching(false));
  }, [open, allCards]);

  /* filter on query change */
  useEffect(() => {
    if (!allCards || !query.trim()) {
      setResults([]);
      return;
    }
    const q = query.trim().toLowerCase();
    const matched = allCards
      .filter((c) => {
        const term = (c.front ?? c.term ?? c.question ?? '').toLowerCase();
        const def  = (c.back  ?? c.definition ?? c.answer ?? '').toLowerCase();
        return term.includes(q) || def.includes(q);
      })
      .slice(0, 8);
    setResults(matched);
  }, [query, allCards]);

  /* open bar and focus input */
  const toggleOpen = () => {
    setOpen((o) => {
      const next = !o;
      if (next) {
        setTimeout(() => inputRef.current?.focus(), 50);
      } else {
        setQuery('');
        setResults([]);
      }
      return next;
    });
  };

  /* close on outside click or Escape */
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') { setOpen(false); setQuery(''); setResults([]); } };
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false); setQuery(''); setResults([]);
      }
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const handleResultClick = useCallback((card) => {
    const term   = card.front ?? card.term ?? card.question ?? '';
    const modId  = moduleIdFromTitle(card.module);
    const path   = modId ? `/flashcards/${modId}` : '/flashcards';
    setOpen(false);
    setQuery('');
    setResults([]);
    navigate(path, { state: { highlightTerm: term } });
  }, [navigate]);

  const showDropdown = open && (fetching || query.trim().length > 0);

  return (
    <div className="gs-wrapper" ref={wrapperRef}>
      {/* animated pill */}
      <div className={`gs-bar ${open ? 'open' : ''}`}>
        <input
          ref={inputRef}
          className="gs-input"
          placeholder="Search flashcards…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search flashcards"
        />
        {query && (
          <button
            className="gs-clear"
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* magnifier icon */}
      <button
        className={`gs-icon-btn ${open ? 'active' : ''}`}
        onClick={toggleOpen}
        aria-label={open ? 'Close search' : 'Open search'}
        title="Search flashcards"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </button>

      {/* dropdown */}
      {showDropdown && (
        <div className="gs-dropdown" role="listbox" aria-label="Search results">
          {fetching ? (
            <div className="gs-loading">
              <span className="gs-dot" /><span className="gs-dot" /><span className="gs-dot" />
            </div>
          ) : results.length === 0 && query.trim() ? (
            <div className="gs-empty">No flashcards match <strong>"{query}"</strong></div>
          ) : results.length > 0 ? (
            <>
              <div className="gs-section-label">Flashcards</div>
              {results.map((card) => {
                const term = card.front ?? card.term ?? card.question ?? '';
                const def  = card.back  ?? card.definition ?? card.answer ?? '';
                return (
                  <button
                    key={card.id}
                    className="gs-result"
                    role="option"
                    onClick={() => handleResultClick(card)}
                  >
                    <div className="gs-term">
                      <Highlight text={term} query={query} />
                    </div>
                    <div className="gs-def">
                      <Highlight text={def} query={query} />
                    </div>
                    {card.module && (
                      <span className="gs-module-tag">{card.module}</span>
                    )}
                  </button>
                );
              })}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}