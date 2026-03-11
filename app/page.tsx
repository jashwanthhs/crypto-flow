/* eslint-disable react/no-unescaped-entities, react/jsx-key, react-hooks/exhaustive-deps */
'use client';
import { useState, useEffect, useRef, useCallback, ReactNode, CSSProperties } from 'react';

// ─── Tiny helpers ───────────────────────────────────────────────
const fmt = (n: number): string =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

// ─── Chapter definitions ────────────────────────────────────────
interface Chapter {
  id: string;
  title: string;
  icon: string;
}

const CHAPTERS: Chapter[] = [
  { id: 'welcome', title: 'Welcome', icon: '🏠' },
  { id: 'what', title: 'What Is An Exchange?', icon: '🏪' },
  { id: 'pair', title: 'Trading Pairs', icon: '🔄' },
  { id: 'orderbook', title: 'The Order Book', icon: '📖' },
  { id: 'spot', title: 'Spot Trading', icon: '💰' },
  { id: 'futures', title: 'Futures & Leverage', icon: '⚡' },
  { id: 'journey', title: 'Full User Journey', icon: '🗺️' },
  { id: 'live', title: 'Live Trading Sim', icon: '📊' },
  { id: 'architecture', title: 'Code Architecture', icon: '🏗️' },
];

// ─── Shared UI ──────────────────────────────────────────────────
interface PillProps {
  children: ReactNode;
  color?: string;
  active?: boolean;
}

const Pill = ({ children, color = '#6ee7b7', active }: PillProps) => (
  <span
    style={{
      display: 'inline-block',
      padding: '4px 14px',
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 600,
      background: active ? color : 'rgba(255,255,255,.07)',
      color: active ? '#0a0a0a' : '#aaa',
      transition: 'all .3s',
      border: active ? 'none' : '1px solid rgba(255,255,255,.1)',
    }}
  >
    {children}
  </span>
);

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  glow?: string | null;
  onClick?: () => void;
}

const Card = ({ children, style, glow, onClick }: CardProps) => (
  <div
    onClick={onClick}
    style={{
      background: 'rgba(255,255,255,.04)',
      border: '1px solid rgba(255,255,255,.08)',
      borderRadius: 16,
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: glow ? `0 0 40px ${glow}33` : 'none',
      transition: 'box-shadow .4s',
      ...style,
    }}
  >
    {children}
  </div>
);

interface AnimNumProps {
  value: number | string;
  color?: string;
  size?: number;
}

const AnimNum = ({ value, color = '#fff', size = 28 }: AnimNumProps) => {
  const [display, setDisplay] = useState(value);
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);
  useEffect(() => {
    if (value !== prev.current) {
      setFlash(true);
      const t = setTimeout(() => {
        setDisplay(value);
        setFlash(false);
      }, 200);
      prev.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);
  return (
    <span
      style={{
        fontSize: size,
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace",
        color: flash ? '#fbbf24' : color,
        transition: 'color .3s',
        textShadow: flash ? '0 0 20px #fbbf2488' : 'none',
      }}
    >
      {typeof display === 'number' ? fmt(display) : display}
    </span>
  );
};

interface ArrowProps {
  dir?: 'right' | 'left' | 'down' | 'up';
  size?: number;
  color?: string;
}

const Arrow = ({ dir = 'right', size = 32, color = '#6ee7b7' }: ArrowProps) => {
  const arrows: Record<string, string> = { right: '→', left: '←', down: '↓', up: '↑' };
  return <span style={{ fontSize: size, color, lineHeight: 1 }}>{arrows[dir]}</span>;
};

interface BarFillProps {
  pct: number;
  color: string;
  label?: string;
  delay?: number;
}

const BarFill = ({ pct, color, label, delay = 0 }: BarFillProps) => {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 100 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{ marginBottom: 8 }}>
      {label && <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{label}</div>}
      <div
        style={{
          background: 'rgba(255,255,255,.06)',
          borderRadius: 6,
          height: 18,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${w}%`,
            height: '100%',
            background: color,
            borderRadius: 6,
            transition: 'width 1s cubic-bezier(.4,0,.2,1)',
            position: 'relative',
          }}
        >
          <span
            style={{
              position: 'absolute',
              right: 6,
              top: 1,
              fontSize: 10,
              fontWeight: 700,
              color: '#0a0a0a',
            }}
          >
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// CHAPTERS
// ═══════════════════════════════════════════════════════════════

// ─── 0 Welcome ──────────────────────────────────────────────────
interface ChapterProps {
  next: () => void;
}

function ChWelcome({ next }: ChapterProps) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), 200);
  }, []);
  return (
    <div
      style={{
        textAlign: 'center',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all .8s',
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 16 }}>🪙</div>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 800,
          background: 'linear-gradient(135deg,#6ee7b7,#3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 12,
        }}
      >
        Crypko Exchange
      </h1>
      <h2
        style={{
          fontSize: 18,
          color: '#94a3b8',
          fontWeight: 400,
          maxWidth: 480,
          margin: '0 auto 32px',
        }}
      >
        A visual, interactive guide to how a crypto exchange works — explained so simply that a kid
        could understand it.
      </h2>
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 32,
        }}
      >
        {CHAPTERS.slice(1).map((c) => (
          <Pill key={c.id}>
            {c.icon} {c.title}
          </Pill>
        ))}
      </div>
      <button onClick={next} style={btnStyle}>
        Let's Start →
      </button>
    </div>
  );
}

// ─── 1 What is an Exchange ──────────────────────────────────────
function ChWhat({ next }: ChapterProps) {
  const [step, setStep] = useState(0);
  const people = [
    { emoji: '👩', name: 'Alice', has: '💵 Cash', wants: '🪙 Bitcoin' },
    { emoji: '👨', name: 'Bob', has: '🪙 Bitcoin', wants: '💵 Cash' },
  ];
  useEffect(() => {
    if (step < 3) {
      const t = setTimeout(() => setStep((s) => s + 1), 1200);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div>
      <SectionTitle icon="🏪" title="What Is a Crypto Exchange?" />
      <p style={pStyle}>
        Think of a <b>farmers' market</b> — but instead of tomatoes, people trade digital money.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 24,
          justifyContent: 'center',
          alignItems: 'center',
          margin: '32px 0',
          flexWrap: 'wrap',
        }}
      >
        {/* Alice */}
        <Card
          style={{
            textAlign: 'center',
            minWidth: 160,
            opacity: step >= 1 ? 1 : 0,
            transform: step >= 1 ? 'scale(1)' : 'scale(.8)',
            transition: 'all .6s',
          }}
        >
          <div style={{ fontSize: 48 }}>{people[0].emoji}</div>
          <div style={{ fontWeight: 700, marginTop: 8 }}>{people[0].name}</div>
          <div style={{ color: '#6ee7b7', fontSize: 14, marginTop: 4 }}>Has: {people[0].has}</div>
          <div style={{ color: '#f87171', fontSize: 14 }}>Wants: {people[0].wants}</div>
        </Card>

        {/* Exchange */}
        <div style={{ textAlign: 'center', opacity: step >= 2 ? 1 : 0, transition: 'all .6s' }}>
          <Arrow dir="right" />
          <div
            style={{
              background: 'linear-gradient(135deg,#6ee7b744,#3b82f644)',
              border: '2px solid #6ee7b7',
              borderRadius: 16,
              padding: '16px 24px',
              margin: '8px 0',
            }}
          >
            <div style={{ fontSize: 28 }}>🏪</div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#6ee7b7' }}>CRYPKO</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>The Exchange</div>
          </div>
          <Arrow dir="left" />
        </div>

        {/* Bob */}
        <Card
          style={{
            textAlign: 'center',
            minWidth: 160,
            opacity: step >= 1 ? 1 : 0,
            transform: step >= 1 ? 'scale(1)' : 'scale(.8)',
            transition: 'all .6s',
            transitionDelay: '.2s',
          }}
        >
          <div style={{ fontSize: 48 }}>{people[1].emoji}</div>
          <div style={{ fontWeight: 700, marginTop: 8 }}>{people[1].name}</div>
          <div style={{ color: '#6ee7b7', fontSize: 14, marginTop: 4 }}>Has: {people[1].has}</div>
          <div style={{ color: '#f87171', fontSize: 14 }}>Wants: {people[1].wants}</div>
        </Card>
      </div>

      {step >= 3 && (
        <Card
          glow="#6ee7b7"
          style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto', animation: 'fadeUp .5s' }}
        >
          <p style={{ margin: 0, fontSize: 15 }}>
            The exchange <b>matches</b> Alice's buy order with Bob's sell order. <br />
            Alice gets Bitcoin. Bob gets cash. <br />
            <span style={{ color: '#fbbf24' }}>
              Crypko charges a small fee for making this happen.
            </span>
          </p>
        </Card>
      )}

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button onClick={next} style={btnStyle}>
          Next: Trading Pairs →
        </button>
      </div>
    </div>
  );
}

// ─── 2 Trading Pairs ────────────────────────────────────────────
function ChPair({ next }: ChapterProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const pairs = [
    {
      base: 'BTC',
      quote: 'USDT',
      baseIcon: '🪙',
      quoteIcon: '💵',
      price: 67350,
      desc: 'Buy Bitcoin with Tether dollars',
    },
    {
      base: 'ETH',
      quote: 'USDT',
      baseIcon: '💎',
      quoteIcon: '💵',
      price: 3520,
      desc: 'Buy Ethereum with Tether dollars',
    },
    {
      base: 'ETH',
      quote: 'BTC',
      baseIcon: '💎',
      quoteIcon: '🪙',
      price: 0.0523,
      desc: 'Buy Ethereum with Bitcoin',
    },
  ];

  return (
    <div>
      <SectionTitle icon="🔄" title="What Is a Trading Pair?" />
      <p style={pStyle}>
        A trading pair is just: <b>"What do you want?"</b> and <b>"What will you pay with?"</b>
      </p>
      <p style={pStyle}>
        Think of it like a currency exchange at the airport: you give Dollars 💵, you get Euros 💶.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
          margin: '24px 0',
        }}
      >
        {pairs.map((p, i) => (
          <Card
            key={i}
            glow={selected === i ? '#6ee7b7' : null}
            style={{
              cursor: 'pointer',
              minWidth: 200,
              textAlign: 'center',
              border: selected === i ? '1px solid #6ee7b7' : '1px solid rgba(255,255,255,.08)',
              transform: selected === i ? 'scale(1.05)' : 'scale(1)',
              transition: 'all .3s',
            }}
            onClick={() => setSelected(i)}
          >
            <div style={{ fontSize: 32 }}>
              {p.baseIcon} / {p.quoteIcon}
            </div>
            <div style={{ fontWeight: 800, fontSize: 18, marginTop: 8 }}>
              {p.base}/{p.quote}
            </div>
            <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>{p.desc}</div>
            <div
              style={{
                marginTop: 12,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 20,
                color: '#6ee7b7',
              }}
            >
              ${p.price < 1 ? p.price : fmt(p.price)}
            </div>
          </Card>
        ))}
      </div>

      {selected !== null && (
        <Card style={{ maxWidth: 520, margin: '0 auto', animation: 'fadeUp .4s' }} glow={undefined}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36 }}>{pairs[selected].baseIcon}</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{pairs[selected].base}</div>
              <div style={{ fontSize: 11, color: '#6ee7b7' }}>What you GET</div>
            </div>
            <Arrow />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36 }}>{pairs[selected].quoteIcon}</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{pairs[selected].quote}</div>
              <div style={{ fontSize: 11, color: '#f87171' }}>What you PAY</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#94a3b8' }}>
            <b style={{ color: '#fff' }}>In the code:</b>{' '}
            <code style={codeStyle}>baseAsset = "{pairs[selected].base}"</code> ·{' '}
            <code style={codeStyle}>quoteAsset = "{pairs[selected].quote}"</code>
          </div>
        </Card>
      )}
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button onClick={next} style={btnStyle}>
          Next: Order Book →
        </button>
      </div>
    </div>
  );
}

// ─── 3 Order Book ───────────────────────────────────────────────
function ChOrderBook({ next }: ChapterProps) {
  const [bids, setBids] = useState<Array<{ price: number; qty: number }>>([
    { price: 67300, qty: 1.2 },
    { price: 67280, qty: 0.8 },
    { price: 67250, qty: 2.5 },
    { price: 67200, qty: 1.8 },
    { price: 67150, qty: 3.1 },
  ]);
  const [asks, setAsks] = useState<Array<{ price: number; qty: number }>>([
    { price: 67350, qty: 0.9 },
    { price: 67380, qty: 1.5 },
    { price: 67400, qty: 2.0 },
    { price: 67450, qty: 1.3 },
    { price: 67500, qty: 2.8 },
  ]);
  const [highlight, setHighlight] = useState<string | null>(null);

  useEffect(() => {
    const iv = setInterval(() => {
      setBids((b) =>
        b.map((o) => ({ ...o, qty: Math.max(0.1, o.qty + (Math.random() - 0.5) * 0.3) })),
      );
      setAsks((a) =>
        a.map((o) => ({ ...o, qty: Math.max(0.1, o.qty + (Math.random() - 0.5) * 0.3) })),
      );
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  const maxQty = Math.max(...bids.map((b) => b.qty), ...asks.map((a) => a.qty));

  return (
    <div>
      <SectionTitle icon="📖" title="The Order Book — A Live Queue" />
      <p style={pStyle}>
        The order book is a <b>queue of waiting orders</b>. Buyers line up on one side, sellers on
        the other. Watch the numbers change live — this data updates <b>many times per second</b> on
        a real exchange.
      </p>

      <div
        style={{ display: 'flex', gap: 2, maxWidth: 600, margin: '24px auto', flexWrap: 'wrap' }}
      >
        {/* Bids */}
        <div style={{ flex: 1, minWidth: 250 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#6ee7b7',
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            🟢 BIDS (Buyers waiting)
          </div>
          <div
            style={{
              fontSize: 10,
              display: 'flex',
              justifyContent: 'space-between',
              color: '#666',
              padding: '0 8px',
              marginBottom: 4,
            }}
          >
            <span>Price (USDT)</span>
            <span>Amount (BTC)</span>
          </div>
          {bids.map((b, i) => (
            <div
              key={i}
              onMouseEnter={() => setHighlight(`bid-${i}`)}
              onMouseLeave={() => setHighlight(null)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 8px',
                position: 'relative',
                borderRadius: 6,
                cursor: 'pointer',
                background: highlight === `bid-${i}` ? 'rgba(110,231,183,.15)' : 'transparent',
                transition: 'background .2s',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: `${(b.qty / maxQty) * 100}%`,
                  background: 'rgba(110,231,183,.08)',
                  borderRadius: 6,
                  transition: 'width .5s',
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  color: '#6ee7b7',
                  position: 'relative',
                }}
              >
                {fmt(b.price)}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  color: '#ccc',
                  position: 'relative',
                }}
              >
                {b.qty.toFixed(4)}
              </span>
            </div>
          ))}
        </div>

        {/* Asks */}
        <div style={{ flex: 1, minWidth: 250 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#f87171',
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            🔴 ASKS (Sellers waiting)
          </div>
          <div
            style={{
              fontSize: 10,
              display: 'flex',
              justifyContent: 'space-between',
              color: '#666',
              padding: '0 8px',
              marginBottom: 4,
            }}
          >
            <span>Price (USDT)</span>
            <span>Amount (BTC)</span>
          </div>
          {asks.map((a, i) => (
            <div
              key={i}
              onMouseEnter={() => setHighlight(`ask-${i}`)}
              onMouseLeave={() => setHighlight(null)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 8px',
                position: 'relative',
                borderRadius: 6,
                cursor: 'pointer',
                background: highlight === `ask-${i}` ? 'rgba(248,113,113,.15)' : 'transparent',
                transition: 'background .2s',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: `${(a.qty / maxQty) * 100}%`,
                  background: 'rgba(248,113,113,.08)',
                  borderRadius: 6,
                  transition: 'width .5s',
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  color: '#f87171',
                  position: 'relative',
                }}
              >
                {fmt(a.price)}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  color: '#ccc',
                  position: 'relative',
                }}
              >
                {a.qty.toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center' }} glow={undefined}>
        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.8 }}>
          <b style={{ color: '#6ee7b7' }}>Spread</b> = Gap between best bid & best ask ={' '}
          <b style={{ color: '#fbbf24' }}>${fmt(asks[0].price - bids[0].price)}</b>
          <br />
          The spread is the "cost" of trading instantly.
          <br />
          <span style={{ fontSize: 11, color: '#666' }}>
            In code: <code style={codeStyle}>useBids(pair)</code> ·{' '}
            <code style={codeStyle}>useAsks(pair)</code> ·{' '}
            <code style={codeStyle}>useSpread(pair)</code>
          </span>
        </div>
      </Card>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button onClick={next} style={btnStyle}>
          Next: Spot Trading →
        </button>
      </div>
    </div>
  );
}

// ─── 4 Spot Trading ─────────────────────────────────────────────
function ChSpot({ next }: ChapterProps) {
  const [phase, setPhase] = useState(0); // 0=idle, 1=buying, 2=bought, 3=priceUp, 4=sold
  const [wallet, setWallet] = useState<{ usdt: number; btc: number }>({ usdt: 10000, btc: 0 });
  const [price, setPrice] = useState(67000);
  const [log, setLog] = useState<string[]>([]);

  const buy = async () => {
    setPhase(1);
    setLog((l) => [...l, '📤 Placing BUY order: 0.1 BTC at $67,000...']);
    await sleep(1000);
    setWallet({ usdt: 3300, btc: 0.1 });
    setLog((l) => [...l, '✅ Order FILLED! You now own 0.1 BTC']);
    setPhase(2);
    await sleep(1500);
    setPrice(69500);
    setLog((l) => [...l, '📈 Price went UP to $69,500! Unrealized P&L: +$250']);
    setPhase(3);
  };

  const sell = async () => {
    setLog((l) => [...l, '📤 Placing SELL order: 0.1 BTC at $69,500...']);
    await sleep(1000);
    setWallet({ usdt: 10250, btc: 0 });
    setLog((l) => [...l, '✅ SOLD! Realized profit: +$250 🎉']);
    setPhase(4);
  };

  return (
    <div>
      <SectionTitle icon="💰" title="Spot Trading — Buy Now, Own Now" />
      <p style={pStyle}>
        Spot trading is the simplest form. Like buying fruit at a store — you pay, you get it, it's
        yours.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          justifyContent: 'center',
          margin: '24px 0',
        }}
      >
        {/* Wallet */}
        <Card style={{ minWidth: 220 }} glow={undefined}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>
            💼 YOUR WALLET
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#888' }}>USDT (Cash)</div>
            <AnimNum value={wallet.usdt} color="#6ee7b7" size={24} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#888' }}>BTC (Bitcoin)</div>
            <AnimNum value={wallet.btc.toFixed(4)} color="#fbbf24" size={24} />
          </div>
        </Card>

        {/* Price */}
        <Card style={{ minWidth: 200, textAlign: 'center' }} glow={undefined}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>
            📊 BTC/USDT PRICE
          </div>
          <AnimNum value={price} color={price > 67000 ? '#6ee7b7' : '#fff'} size={32} />
          {phase >= 3 && (
            <div style={{ color: '#6ee7b7', fontSize: 14, marginTop: 8, animation: 'fadeUp .4s' }}>
              ▲ +${fmt(price - 67000)} (+{(((price - 67000) / 67000) * 100).toFixed(1)}%)
            </div>
          )}
        </Card>

        {/* Actions */}
        <Card style={{ minWidth: 220, textAlign: 'center' }} glow={undefined}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>
            🎮 ACTIONS
          </div>
          {phase === 0 && (
            <button
              onClick={buy}
              style={{ ...btnStyle, background: '#059669', fontSize: 14, padding: '10px 24px' }}
            >
              Buy 0.1 BTC for $6,700
            </button>
          )}
          {phase === 1 && <div style={{ color: '#fbbf24' }}>⏳ Processing...</div>}
          {phase === 2 && <div style={{ color: '#6ee7b7' }}>✅ Bought! Waiting for price...</div>}
          {phase === 3 && (
            <button
              onClick={sell}
              style={{ ...btnStyle, background: '#dc2626', fontSize: 14, padding: '10px 24px' }}
            >
              Sell 0.1 BTC for $6,950
            </button>
          )}
          {phase === 4 && (
            <div style={{ color: '#6ee7b7', fontSize: 18, fontWeight: 700 }}>🎉 +$250 Profit!</div>
          )}
        </Card>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <Card
          style={{
            maxWidth: 560,
            margin: '0 auto',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
          }}
          glow={undefined}
        >
          {log.map((l, i) => (
            <div
              key={i}
              style={{
                padding: '4px 0',
                color: l.includes('✅') ? '#6ee7b7' : l.includes('📈') ? '#fbbf24' : '#ccc',
                animation: 'fadeUp .3s',
              }}
            >
              {l}
            </div>
          ))}
        </Card>
      )}

      {phase >= 2 && (
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#666' }}>
          In code: <code style={codeStyle}>POST /v1/orders</code> →{' '}
          <code style={codeStyle}>GET /v1/balances</code> →{' '}
          <code style={codeStyle}>tradingDataStore.updateTicker()</code>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button onClick={next} style={btnStyle}>
          Next: Futures & Leverage →
        </button>
      </div>
    </div>
  );
}

// ─── 5 Futures & Leverage ───────────────────────────────────────
function ChFutures({ next }: ChapterProps) {
  const [leverage, setLeverage] = useState(1);
  const [priceChange, setPriceChange] = useState(5);
  const deposit = 1000;
  const position = deposit * leverage;
  const pnl = position * (priceChange / 100);
  const pnlPct = (pnl / deposit) * 100;
  const liquidationPct = (100 / leverage).toFixed(1);
  const isLiquidated = Math.abs(priceChange) >= 100 / leverage && priceChange < 0;

  return (
    <div>
      <SectionTitle icon="⚡" title="Futures & Leverage — Amplified Risk" />
      <p style={pStyle}>
        Imagine using a magnifying glass on your money. Leverage <b>amplifies</b> both gains AND
        losses. Drag the sliders to see how it works.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          justifyContent: 'center',
          margin: '24px 0',
        }}
      >
        {/* Controls */}
        <Card style={{ minWidth: 280 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Leverage</span>
              <span
                style={{
                  fontWeight: 700,
                  color: leverage >= 20 ? '#f87171' : leverage >= 10 ? '#fbbf24' : '#6ee7b7',
                }}
              >
                {leverage}x
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={leverage}
              onChange={(e) => setLeverage(+e.target.value)}
              style={{ width: '100%', accentColor: leverage >= 20 ? '#f87171' : '#6ee7b7' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 10,
                color: '#555',
              }}
            >
              <span>1x (safe)</span>
              <span>10x</span>
              <span>25x</span>
              <span>50x (☠️)</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Price Change</span>
              <span style={{ fontWeight: 700, color: priceChange >= 0 ? '#6ee7b7' : '#f87171' }}>
                {priceChange > 0 ? '+' : ''}
                {priceChange}%
              </span>
            </div>
            <input
              type="range"
              min={-30}
              max={30}
              value={priceChange}
              onChange={(e) => setPriceChange(+e.target.value)}
              style={{ width: '100%', accentColor: priceChange >= 0 ? '#6ee7b7' : '#f87171' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 10,
                color: '#555',
              }}
            >
              <span>-30%</span>
              <span>0%</span>
              <span>+30%</span>
            </div>
          </div>
        </Card>

        {/* Results */}
        <Card
          style={{ minWidth: 280, textAlign: 'center' }}
          glow={isLiquidated ? '#f87171' : pnl > 0 ? '#6ee7b7' : null}
        >
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>YOUR RESULTS</div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              textAlign: 'left',
              marginBottom: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: '#666' }}>Your Money</div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>${fmt(deposit)}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#666' }}>Position Size</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#3b82f6' }}>
                ${fmt(position)}
              </div>
            </div>
          </div>

          {isLiquidated ? (
            <div
              style={{
                padding: 16,
                background: 'rgba(248,113,113,.15)',
                borderRadius: 12,
                animation: 'fadeUp .3s',
              }}
            >
              <div style={{ fontSize: 32 }}>💀</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f87171' }}>LIQUIDATED</div>
              <div style={{ fontSize: 13, color: '#f87171' }}>You lost everything. $0 left.</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                At {leverage}x, a {liquidationPct}% drop wipes you out.
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 10, color: '#666' }}>Profit / Loss</div>
              <div
                style={{ fontSize: 28, fontWeight: 800, color: pnl >= 0 ? '#6ee7b7' : '#f87171' }}
              >
                {pnl >= 0 ? '+' : ''}
                {fmt(pnl)} ({pnlPct >= 0 ? '+' : ''}
                {pnlPct.toFixed(1)}%)
              </div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 8 }}>
                ⚠️ Liquidation at <b style={{ color: '#f87171' }}>-{liquidationPct}%</b> price drop
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Comparison */}
      <Card style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>
          Spot vs Futures in this codebase
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 13 }}>
          <div>
            <div style={{ color: '#6ee7b7', fontWeight: 700, marginBottom: 4 }}>
              Spot /trade/spot/[pair]
            </div>
            <div style={{ color: '#94a3b8', lineHeight: 1.6 }}>
              • Buy & own the asset
              <br />
              • No liquidation risk
              <br />
              • Simpler order form
              <br />• <code style={codeStyle}>SpotTradingSection</code>
            </div>
          </div>
          <div>
            <div style={{ color: '#f87171', fontWeight: 700, marginBottom: 4 }}>
              Futures /trade/futures/[pair]
            </div>
            <div style={{ color: '#94a3b8', lineHeight: 1.6 }}>
              • Trade contracts, not assets
              <br />
              • Leverage = amplified risk
              <br />
              • Shows liquidation price
              <br />• <code style={codeStyle}>FuturesTradingSection</code>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button onClick={next} style={btnStyle}>
          Next: Full User Journey →
        </button>
      </div>
    </div>
  );
}

// ─── 6 User Journey ─────────────────────────────────────────────
function ChJourney({ next }: ChapterProps) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    {
      icon: '🏠',
      title: 'Home Page',
      route: '/home',
      desc: 'User discovers the platform. Sees trending coins, market data, promotions.',
      category: 'Engagement',
      color: '#3b82f6',
    },
    {
      icon: '🔐',
      title: 'Sign Up / Login',
      route: '/auth/signup',
      desc: 'Email + OTP, Google, Apple, or passkey authentication. Multi-step state machine.',
      category: 'Auth',
      color: '#8b5cf6',
    },
    {
      icon: '🪪',
      title: 'KYC Verification',
      route: '/profile → KYC',
      desc: 'Upload ID + selfie. Required by law before trading. SumSub integration.',
      category: 'Compliance',
      color: '#f59e0b',
    },
    {
      icon: '💵',
      title: 'Deposit Funds',
      route: '/deposit/crypto or /fiat',
      desc: 'Get money into the platform. Crypto: get a unique address. Fiat: bank transfer.',
      category: 'Money-In',
      color: '#10b981',
    },
    {
      icon: '📊',
      title: 'Browse Markets',
      route: '/markets',
      desc: 'Explore all tradable pairs. Filter by spot/futures. Find what to trade.',
      category: 'Discovery',
      color: '#6366f1',
    },
    {
      icon: '⚡',
      title: 'Trade!',
      route: '/trade/spot/[pair]',
      desc: 'The CORE screen. Order book + chart + order form. Place buy/sell orders.',
      category: '💰 Revenue',
      color: '#6ee7b7',
    },
    {
      icon: '📋',
      title: 'Track Orders',
      route: '/orderhistory',
      desc: 'View all open and historical orders. Check if orders are filled.',
      category: 'Tracking',
      color: '#94a3b8',
    },
    {
      icon: '📈',
      title: 'Check P&L',
      route: '/pnl',
      desc: 'Profit & Loss dashboard. Calendar view, per-asset breakdown, charts.',
      category: 'Tracking',
      color: '#fbbf24',
    },
    {
      icon: '💸',
      title: 'Withdraw',
      route: '/withdraw/crypto or /fiat',
      desc: 'Take money out. Requires MFA step-up. Highest security flow.',
      category: 'Money-Out',
      color: '#ef4444',
    },
  ];

  useEffect(() => {
    const iv = setInterval(() => setActiveStep((s) => (s + 1) % steps.length), 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div>
      <SectionTitle icon="🗺️" title="The Complete User Journey" />
      <p style={pStyle}>
        Click any step, or watch it auto-advance. This is the path every user follows through the
        app.
      </p>

      {/* Timeline */}
      <div style={{ position: 'relative', maxWidth: 640, margin: '24px auto' }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: 23,
            top: 0,
            bottom: 0,
            width: 2,
            background: 'rgba(255,255,255,.06)',
          }}
        />

        {steps.map((s, i) => (
          <div
            key={i}
            onClick={() => setActiveStep(i)}
            style={{
              display: 'flex',
              gap: 16,
              padding: '12px 0',
              cursor: 'pointer',
              opacity: activeStep === i ? 1 : 0.5,
              transform: activeStep === i ? 'translateX(8px)' : 'translateX(0)',
              transition: 'all .4s',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: activeStep === i ? `${s.color}22` : 'rgba(255,255,255,.04)',
                border: `2px solid ${activeStep === i ? s.color : 'rgba(255,255,255,.1)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
                transition: 'all .3s',
                zIndex: 1,
              }}
            >
              {s.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{s.title}</span>
                <Pill color={s.color} active={activeStep === i}>
                  {s.category}
                </Pill>
              </div>
              {activeStep === i && (
                <div style={{ animation: 'fadeUp .3s' }}>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{s.desc}</div>
                  <code style={{ ...codeStyle, marginTop: 6, display: 'inline-block' }}>
                    {s.route}
                  </code>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button onClick={next} style={btnStyle}>
          Next: Live Trading Sim →
        </button>
      </div>
    </div>
  );
}

// ─── 7 Live Trading Sim ─────────────────────────────────────────
function ChLive({ next }: ChapterProps) {
  const [price, setPrice] = useState(67000);
  const [wallet, setWallet] = useState<{ usdt: number; btc: number }>({ usdt: 10000, btc: 0 });
  const [orders, setOrders] = useState<Array<{ type: string; qty: number; price: string; time: string; cost?: string; revenue?: string }>>([]);
  const [trades, setTrades] = useState<Array<{ id: number; price: string; qty: string; side: string; time: string }>>([]);
  const [buyQty, setBuyQty] = useState('0.05');
  const prevPrice = useRef(67000);
  const tradeId = useRef(0);

  // Simulate live price
  useEffect(() => {
    const iv = setInterval(() => {
      setPrice((p) => {
        prevPrice.current = p;
        const change = (Math.random() - 0.48) * 80;
        return Math.max(60000, Math.min(75000, p + change));
      });
    }, 800);
    return () => clearInterval(iv);
  }, []);

  // Generate fake market trades
  useEffect(() => {
    const iv = setInterval(() => {
      setTrades((t) => {
        const side = Math.random() > 0.5 ? 'buy' : 'sell';
        const qty = (Math.random() * 0.5 + 0.01).toFixed(4);
        return [
          {
            id: tradeId.current++,
            price: price.toFixed(2),
            qty,
            side,
            time: new Date().toLocaleTimeString(),
          },
          ...t,
        ].slice(0, 8);
      });
    }, 1200);
    return () => clearInterval(iv);
  }, [price]);

  const placeBuy = () => {
    const q = parseFloat(buyQty);
    const cost = q * price;
    if (cost > wallet.usdt || q <= 0) return;
    setWallet((w) => ({ usdt: w.usdt - cost, btc: w.btc + q }));
    setOrders((o) => [
      ...o,
      {
        type: 'BUY',
        qty: q,
        price: price.toFixed(2),
        time: new Date().toLocaleTimeString(),
        cost: cost.toFixed(2),
      },
    ]);
  };

  const placeSell = () => {
    const q = parseFloat(buyQty);
    if (q > wallet.btc || q <= 0) return;
    const revenue = q * price;
    setWallet((w) => ({ usdt: w.usdt + revenue, btc: w.btc - q }));
    setOrders((o) => [
      ...o,
      {
        type: 'SELL',
        qty: q,
        price: price.toFixed(2),
        time: new Date().toLocaleTimeString(),
        revenue: revenue.toFixed(2),
      },
    ]);
  };

  const totalValue = wallet.usdt + wallet.btc * price;
  const pnl = totalValue - 10000;
  const direction = price > prevPrice.current ? 'up' : price < prevPrice.current ? 'down' : 'flat';

  return (
    <div>
      <SectionTitle icon="📊" title="Live Trading Simulator" />
      <p style={pStyle}>
        This simulates the actual trading screen. Prices move in real-time. Try buying and selling!
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          margin: '24px 0',
        }}
      >
        {/* Price + Chart feel */}
        <Card glow={direction === 'up' ? '#6ee7b744' : direction === 'down' ? '#f8717144' : null} style={undefined}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>BTC/USDT</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span
              style={{
                fontSize: 32,
                fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace",
                color: direction === 'up' ? '#6ee7b7' : direction === 'down' ? '#f87171' : '#fff',
                transition: 'color .3s',
              }}
            >
              ${fmt(price)}
            </span>
            <span style={{ fontSize: 14, color: direction === 'up' ? '#6ee7b7' : '#f87171' }}>
              {direction === 'up' ? '▲' : '▼'}
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>
            WebSocket: ticker stream updating every 800ms
          </div>

          {/* Mini sparkline effect */}
          <div
            style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 40, marginTop: 12 }}
          >
            {Array.from({ length: 20 }, (_, i) => {
              const h = 10 + Math.random() * 30;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: h,
                    background: `linear-gradient(to top, ${h > 25 ? '#6ee7b744' : '#f8717144'}, transparent)`,
                    borderRadius: 2,
                    transition: 'height .4s',
                  }}
                />
              );
            })}
          </div>
        </Card>

        {/* Wallet */}
        <Card glow={undefined} style={undefined}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>💼 PORTFOLIO</div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: '#666' }}>USDT Balance</div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 20,
                fontWeight: 700,
                color: '#6ee7b7',
              }}
            >
              ${fmt(wallet.usdt)}
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: '#666' }}>BTC Balance</div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 20,
                fontWeight: 700,
                color: '#fbbf24',
              }}
            >
              {wallet.btc.toFixed(6)} BTC
            </div>
            {wallet.btc > 0 && (
              <div style={{ fontSize: 11, color: '#888' }}>≈ ${fmt(wallet.btc * price)}</div>
            )}
          </div>
          <div
            style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 8, marginTop: 4 }}
          >
            <div style={{ fontSize: 10, color: '#666' }}>Total Value / P&L</div>
            <div
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700 }}
            >
              ${fmt(totalValue)}{' '}
              <span style={{ color: pnl >= 0 ? '#6ee7b7' : '#f87171', fontSize: 14 }}>
                ({pnl >= 0 ? '+' : ''}
                {fmt(pnl)})
              </span>
            </div>
          </div>
        </Card>

        {/* Order Form */}
        <Card glow={undefined} style={undefined}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>📝 ORDER FORM</div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: '#666' }}>Quantity (BTC)</label>
            <input
              value={buyQty}
              onChange={(e) => setBuyQty(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(255,255,255,.12)',
                borderRadius: 8,
                color: '#fff',
                fontSize: 16,
                fontFamily: "'JetBrains Mono', monospace",
                outline: 'none',
                marginTop: 4,
                boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>
              Cost: ${fmt(parseFloat(buyQty) * price || 0)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={placeBuy}
              style={{
                ...btnStyle,
                flex: 1,
                background: '#059669',
                padding: '10px 0',
                fontSize: 14,
              }}
            >
              BUY
            </button>
            <button
              onClick={placeSell}
              style={{
                ...btnStyle,
                flex: 1,
                background: '#dc2626',
                padding: '10px 0',
                fontSize: 14,
              }}
            >
              SELL
            </button>
          </div>
        </Card>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {/* Trade Stream */}
        <Card glow={undefined} style={undefined}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
            📡 MARKET TRADES (live stream)
          </div>
          <div
            style={{
              fontSize: 10,
              display: 'flex',
              justifyContent: 'space-between',
              color: '#555',
              marginBottom: 4,
            }}
          >
            <span>Price</span>
            <span>Amount</span>
            <span>Time</span>
          </div>
          {trades.map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                padding: '2px 0',
                animation: 'fadeUp .3s',
              }}
            >
              <span style={{ color: t.side === 'buy' ? '#6ee7b7' : '#f87171' }}>{t.price}</span>
              <span style={{ color: '#aaa' }}>{t.qty}</span>
              <span style={{ color: '#555' }}>{t.time}</span>
            </div>
          ))}
        </Card>

        {/* Your Orders */}
        <Card glow={undefined} style={undefined}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>📋 YOUR ORDERS</div>
          {orders.length === 0 ? (
            <div style={{ color: '#444', fontSize: 13, textAlign: 'center', padding: 20 }}>
              No orders yet. Try buying some BTC!
            </div>
          ) : (
            orders
              .slice(-6)
              .reverse()
              .map((o, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    padding: '4px 0',
                    borderBottom: '1px solid rgba(255,255,255,.04)',
                    animation: 'fadeUp .3s',
                  }}
                >
                  <span
                    style={{ color: o.type === 'BUY' ? '#6ee7b7' : '#f87171', fontWeight: 700 }}
                  >
                    {o.type}
                  </span>
                  <span style={{ color: '#aaa', fontFamily: "'JetBrains Mono', monospace" }}>
                    {o.qty} BTC @ ${o.price}
                  </span>
                  <span style={{ color: '#555' }}>{o.time}</span>
                </div>
              ))
          )}
        </Card>
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button onClick={next} style={btnStyle}>
          Next: Code Architecture →
        </button>
      </div>
    </div>
  );
}

// ─── 8 Architecture ─────────────────────────────────────────────
function ChArchitecture({ next }: ChapterProps) {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const layers = [
    {
      id: 'routes',
      label: 'Routes (Pages)',
      color: '#3b82f6',
      files: '/app/[locale]/trade/spot/[pair]/page.tsx',
      desc: 'Thin wrappers. Just compose components. No business logic here.',
      items: [
        '/home',
        '/trade/spot/[pair]',
        '/trade/futures/[pair]',
        '/markets',
        '/deposit/*',
        '/withdraw/*',
        '/pnl',
        '/orderhistory',
      ],
    },
    {
      id: 'components',
      label: 'UI Components',
      color: '#8b5cf6',
      files: '/components/composite/trading/spot/*',
      desc: 'Feature-level UI. Receives data as props, renders it. Emits events up.',
      items: [
        'SpotTradingSection',
        'OrderBookPanel',
        'TokenHeader',
        'FuturesTradingSection',
        'DepositWizard',
        'PnLCalendar',
      ],
    },
    {
      id: 'hooks',
      label: 'Domain Hooks',
      color: '#f59e0b',
      files: '/lib/domains/trading/hooks/*',
      desc: 'Business logic layer. Validation, data transformation, orchestration. The BRAIN.',
      items: ['useTradingEdge', 'useAuthFlow', 'useSpotOrder', 'useBalances', 'useMarketData'],
    },
    {
      id: 'store',
      label: 'State (Zustand)',
      color: '#ef4444',
      files: '/store/stores/tradingDataStore.ts',
      desc: 'Real-time data from WebSocket. Tickers, order book, trades. High frequency updates.',
      items: ['tradingDataStore', 'authStore', 'activePairStore', 'connectionStore'],
    },
    {
      id: 'api',
      label: 'API Client (Edge)',
      color: '#6ee7b7',
      files: '/lib/api/edge/client.ts',
      desc: 'HTTP client with auth injection, retry, rate-limiting. Typed from OpenAPI spec.',
      items: ['EdgeClient', 'POST /v1/orders', 'GET /v1/balances', 'WebSocket streams'],
    },
  ];

  return (
    <div>
      <SectionTitle icon="🏗️" title="How the Code Is Structured" />
      <p style={pStyle}>
        Click each layer to see what lives there. Data flows DOWN from routes → components → hooks →
        store/API.
      </p>

      <div style={{ maxWidth: 600, margin: '24px auto' }}>
        {layers.map((layer, i) => (
          <div key={layer.id} style={{ marginBottom: 4 }}>
            {/* Connector line */}
            {i > 0 && (
              <div style={{ textAlign: 'center', padding: '2px 0' }}>
                <Arrow dir="down" size={18} color="#333" />
              </div>
            )}

            <div
              onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
              style={{
                background: activeLayer === layer.id ? `${layer.color}15` : 'rgba(255,255,255,.03)',
                border: `1px solid ${activeLayer === layer.id ? layer.color : 'rgba(255,255,255,.08)'}`,
                borderRadius: 12,
                padding: '14px 20px',
                cursor: 'pointer',
                transition: 'all .3s',
                transform: activeLayer === layer.id ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{ width: 12, height: 12, borderRadius: 4, background: layer.color }}
                  />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{layer.label}</span>
                </div>
                <span style={{ color: '#555', fontSize: 20 }}>
                  {activeLayer === layer.id ? '−' : '+'}
                </span>
              </div>

              {activeLayer === layer.id && (
                <div style={{ marginTop: 12, animation: 'fadeUp .3s' }}>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>
                    {layer.desc}
                  </div>
                  <code style={{ ...codeStyle, display: 'block', marginBottom: 8 }}>
                    {layer.files}
                  </code>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        style={{
                          fontSize: 11,
                          padding: '3px 10px',
                          borderRadius: 6,
                          background: `${layer.color}20`,
                          color: layer.color,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Data flow summary */}
      <Card style={{ maxWidth: 600, margin: '24px auto' }} glow={undefined}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>
          ⚡ What Updates in Real-Time vs On-Demand
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#f87171', marginBottom: 8 }}>
            🔴 Real-Time (WebSocket → Zustand)
          </div>
          <BarFill pct={95} color="#f87171" label="Order Book — updates every 500ms" delay={0} />
          <BarFill pct={80} color="#f87171" label="Ticker Prices — every 2s" delay={100} />
          <BarFill pct={70} color="#f87171" label="Trade Stream — random 1-3s" delay={200} />
          <BarFill pct={40} color="#f87171" label="Chart Candles — every 5s" delay={300} />
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', marginBottom: 8 }}>
            🔵 On-Demand (REST → React Query)
          </div>
          <BarFill pct={20} color="#3b82f6" label="Balances — after trades" delay={400} />
          <BarFill pct={15} color="#3b82f6" label="Order History — on page load" delay={500} />
          <BarFill pct={10} color="#3b82f6" label="Profile / Settings — rarely" delay={600} />
        </div>
      </Card>

      {/* Risk zones */}
      <Card style={{ maxWidth: 600, margin: '16px auto' }} glow="#f87171">
        <div style={{ fontSize: 13, fontWeight: 700, color: '#f87171', marginBottom: 12 }}>
          🚨 Where Frontend Bugs = Lost Money
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            fontSize: 13,
            color: '#ccc',
          }}
        >
          <div>
            <div style={{ color: '#f87171', fontWeight: 600 }}>Order Form</div>
            <div style={{ color: '#888', fontSize: 12 }}>
              Wrong price/quantity/side = instant loss. Must validate tickSize, stepSize, minQty.
            </div>
          </div>
          <div>
            <div style={{ color: '#f87171', fontWeight: 600 }}>Withdrawal Address</div>
            <div style={{ color: '#888', fontSize: 12 }}>
              Wrong address or network = funds gone forever. That's why MFA step-up exists.
            </div>
          </div>
          <div>
            <div style={{ color: '#f87171', fontWeight: 600 }}>Balance Display</div>
            <div style={{ color: '#888', fontSize: 12 }}>
              Uses string math, never floats. $0.1 + $0.2 ≠ $0.3 in JavaScript!
            </div>
          </div>
          <div>
            <div style={{ color: '#f87171', fontWeight: 600 }}>Leverage Selector</div>
            <div style={{ color: '#888', fontSize: 12 }}>
              Setting 100x when meaning 10x could wipe the account in minutes.
            </div>
          </div>
        </div>
      </Card>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button onClick={next} style={btnStyle}>
          🔄 Start Over
        </button>
      </div>
    </div>
  );
}

// ─── Shared bits ────────────────────────────────────────────────
interface SectionTitleProps {
  icon: string;
  title: string;
}

const SectionTitle = ({ icon, title }: SectionTitleProps) => (
  <h2
    style={{
      fontSize: 24,
      fontWeight: 800,
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}
  >
    <span style={{ fontSize: 32 }}>{icon}</span> {title}
  </h2>
);

const btnStyle: CSSProperties = {
  padding: '12px 32px',
  borderRadius: 12,
  border: 'none',
  background: 'linear-gradient(135deg,#6ee7b7,#3b82f6)',
  color: '#0a0a0a',
  fontWeight: 700,
  fontSize: 15,
  cursor: 'pointer',
  transition: 'transform .2s, box-shadow .2s',
};

const pStyle: CSSProperties = { fontSize: 15, color: '#b0b8c4', lineHeight: 1.7, maxWidth: 600, marginBottom: 12 };
const codeStyle: CSSProperties = {
  background: 'rgba(255,255,255,.08)',
  padding: '2px 8px',
  borderRadius: 4,
  fontSize: 12,
  fontFamily: "'JetBrains Mono', monospace",
  color: '#94a3b8',
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [chapter, setChapter] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((i: number) => {
    setChapter(i);
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const nextCh = useCallback(() => goTo((chapter + 1) % CHAPTERS.length), [chapter, goTo]);

  const chapters = [
    <ChWelcome next={nextCh} />,
    <ChWhat next={nextCh} />,
    <ChPair next={nextCh} />,
    <ChOrderBook next={nextCh} />,
    <ChSpot next={nextCh} />,
    <ChFutures next={nextCh} />,
    <ChJourney next={nextCh} />,
    <ChLive next={nextCh} />,
    <ChArchitecture next={() => goTo(0)} />,
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#e2e8f0',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=range] { height: 6px; border-radius: 3px; }
        button:hover { transform: scale(1.04) !important; box-shadow: 0 4px 24px rgba(110,231,183,.25) !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>

      {/* Top nav */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: '12px 16px',
          overflowX: 'auto',
          borderBottom: '1px solid rgba(255,255,255,.06)',
          background: 'rgba(10,10,15,.9)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {CHAPTERS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => goTo(i)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              background: chapter === i ? 'rgba(110,231,183,.15)' : 'transparent',
              color: chapter === i ? '#6ee7b7' : '#555',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all .2s',
              fontFamily: "'DM Sans', system-ui",
            }}
          >
            {c.icon} {c.title}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div style={{ height: 2, background: 'rgba(255,255,255,.04)' }}>
        <div
          style={{
            height: '100%',
            width: `${((chapter + 1) / CHAPTERS.length) * 100}%`,
            background: 'linear-gradient(90deg,#6ee7b7,#3b82f6)',
            transition: 'width .5s',
          }}
        />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px 24px',
          maxWidth: 800,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div key={chapter} style={{ animation: 'fadeUp .5s' }}>
          {chapters[chapter]}
        </div>
      </div>
    </div>
  );
}
