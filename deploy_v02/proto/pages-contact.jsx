// proto/pages-contact.jsx — contact page with resume download slot.

function ContactPage() {
  const [form, setForm] = React.useState({ name: '', email: '', project: '' });
  const [sent, setSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState('');
  const submitting = React.useRef(false);
  const isPreview = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  const bp = useBP();
  const sendCursor = useCursorLabel('send', 'link');

  const submit = async (e) => {
    e.preventDefault();
    if (submitting.current || !e.currentTarget.reportValidity()) return;
    if (isPreview) { setError('This preview cannot send messages. Please use the live contact form.'); return; }
    submitting.current = true;
    setSending(true);
    setError('');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const data = new URLSearchParams({ 'form-name': 'contact', name: form.name.trim(), email: form.email.trim(), project: form.project.trim() });
      const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data.toString(), signal: controller.signal });
      if (!response.ok) throw new Error('Submission rejected');
      setSent(true);
    } catch {
      setError('We could not confirm your message was sent. Please try again, or email me directly.');
    } finally {
      clearTimeout(timeout);
      submitting.current = false;
      setSending(false);
    }
  };

  const field = (k, label, lines = 1) => (
    <div style={{ borderBottom: `1px solid var(--hair)`, paddingBottom: 12, fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--dim)', letterSpacing: 1, textTransform: 'uppercase' }}>
      <label htmlFor={'contact-' + k} style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>{label}</label>
      {lines === 1 ? (
        <input id={'contact-' + k} name={k} type={k === 'email' ? 'email' : 'text'} autoComplete={k === 'email' ? 'email' : 'name'} required maxLength={k === 'email' ? 254 : 120} disabled={sending} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--ink)', fontFamily: 'var(--mono)', fontSize: 15, width: '100%', padding: 0 }} />
      ) : (
        <textarea id={'contact-' + k} name={k} required maxLength={6000} disabled={sending} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          rows={lines} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--ink)', fontFamily: 'var(--mono)', fontSize: 15, width: '100%', padding: 0, resize: 'vertical' }} />
      )}
    </div>
  );

  return (
    <div className="contact-page">
      <div className="contact-content" style={{ padding: 'clamp(28px,6vw,40px) var(--pad) clamp(48px,9vw,80px)' }}>
        <Reveal delay={80}>
          <div data-main-headline style={{ fontSize: 'clamp(80px, 13vw, 184px)', lineHeight: 0.92, letterSpacing: -4, fontWeight: 300, marginBottom: 60 }}>
            <span style={{ fontStyle: 'italic', color: 'var(--lab-primary,#C1663B)' }}>say</span> <span style={{ color: 'var(--accent)' }}>hello.</span>
          </div>
        </Reveal>

        <div className="contact-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(36px,6vw,80px)' }}>
          <Reveal>
            <div data-heading-caption style={{ fontFamily: 'var(--sans)', fontSize: 16, lineHeight: 1.8, color: 'var(--dim)', fontWeight: 300, maxWidth: 420, marginBottom: 40 }}>
              Whether it&apos;s a VP shoot, a cinematic piece, or just a conversation about moss and displacement maps — I&apos;d love to hear about it. I reply within a day. Twice on weekends.
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 14, lineHeight: 1.9, color: 'var(--dim)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 32 }}>
              <div><span style={{ color: 'var(--dim)' }}>email&nbsp;&nbsp;</span><span style={{ color: 'var(--ink)' }}>bandakirankumar03@gmail.com</span></div>
              <div><span style={{ color: 'var(--dim)' }}>based&nbsp;&nbsp;</span><span style={{ color: 'var(--ink)' }}>Savannah, GA · USA</span></div>
            </div>

            {/* Updated résumé download */}
            <div id="resume" style={{ border: `1px solid var(--accent)`, padding: 22, marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 2, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 10 }}>résumé · pdf · 2026</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ fontSize: 22, fontWeight: 300, fontStyle: 'italic', letterSpacing: -0.3 }}>Kiran Banda · Résumé</div>
                <a href="documents/Kiran_Banda_Resume_2026.pdf" download="Kiran_Banda_Resume_2026.pdf" {...useCursorLabel('download', 'link')}
                  style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--accent)', letterSpacing: 1, textTransform: 'uppercase', cursor: 'none', borderBottom: '1px solid var(--accent)', paddingBottom: 2 }}>
                  download ↓
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['LinkedIn', 'Polycam'].map((s) => (
                <NavLink key={s} href={s === 'LinkedIn' ? 'https://www.linkedin.com/in/kiran-kumar-banda' : s === 'Polycam' ? 'https://poly.cam/@kiranBanda03' : undefined} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--mono)', fontSize: 13, border: `1px solid var(--hair)`, padding: '7px 14px', letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink)' }}>{s} →</NavLink>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            {sent ? (
              <div role="status" style={{ border: `1px solid var(--accent)`, padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>◉ transmission sent</div>
                <div style={{ fontSize: 40, fontStyle: 'italic', fontWeight: 300, letterSpacing: -0.5 }}>Talk soon, {form.name.split(' ')[0] || 'friend'}.</div>
                <div style={{ marginTop: 20, fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--dim)', letterSpacing: 1, textTransform: 'uppercase' }}>I&apos;ll reply to {form.email} within a day.</div>
              </div>
            ) : (
              <form onSubmit={submit} name="contact" method="POST" action="/" data-netlify="true" aria-busy={sending} style={{ display: 'grid', gridTemplateColumns: bp === 'mobile' ? '1fr' : '1fr 1fr', gap: 20 }}>
                <input type="hidden" name="form-name" value="contact" />
                {field('name', '01 · name')}
                {field('email', '02 · your email')}
                <div style={{ gridColumn: '1 / -1' }}>{field('project', '03 · the project', 4)}</div>
                {error && <div role="alert" style={{ gridColumn: '1 / -1', font: '13px/1.8 var(--sans)', color: 'var(--ink)' }}>{error}{' '}<a href={isPreview ? 'https://kiranbandaunreal.com/#/contact' : 'mailto:bandakirankumar03@gmail.com'} style={{ color: 'var(--accent)', textDecoration: 'underline' }}>{isPreview ? 'Open live contact form ↗' : 'Email me ↗'}</a></div>}
                <button type="submit" disabled={sending} {...sendCursor}
                  style={{ gridColumn: '1 / -1', background: 'var(--accent)', color: '#0b0b0c', border: 'none', padding: '20px 28px', fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', cursor: sending ? 'wait' : 'none', opacity: sending ? .7 : 1, textAlign: 'left', marginTop: 8 }}>
                  {sending ? 'Sending…' : 'Send the transmission'} &nbsp;&nbsp;→
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
      <Footer />
    </div>
  );
}

Object.assign(window, { ContactPage });
