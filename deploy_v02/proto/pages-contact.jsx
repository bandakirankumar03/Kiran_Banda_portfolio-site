// proto/pages-contact.jsx — contact page with resume download slot.

function ContactPage() {
  const [form, setForm] = React.useState({ name: '', email: '', project: '' });
  const [sent, setSent] = React.useState(false);
  const bp = useBP();
  const sendCursor = useCursorLabel('send', 'link');

  const submit = (e) => {
    e.preventDefault();
    if (!(form.name && form.email && form.project)) return;
    const data = new URLSearchParams({ 'form-name': 'contact', ...form }).toString();
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data })
      .catch(() => {});
    setSent(true);
  };

  const field = (k, label, lines = 1) => (
    <div style={{ borderBottom: `1px solid var(--hair)`, paddingBottom: 12, fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--dim)', letterSpacing: 1, textTransform: 'uppercase' }}>
      <div style={{ marginBottom: 8, fontSize: 12 }}>{label}</div>
      {lines === 1 ? (
        <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--ink)', fontFamily: 'var(--mono)', fontSize: 15, width: '100%', padding: 0 }} />
      ) : (
        <textarea value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          rows={lines} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--ink)', fontFamily: 'var(--mono)', fontSize: 15, width: '100%', padding: 0, resize: 'vertical' }} />
      )}
    </div>
  );

  return (
    <div>
      <div style={{ padding: 'clamp(28px,6vw,40px) var(--pad) clamp(48px,9vw,80px)' }}>
        <Reveal delay={80}>
          <div style={{ fontSize: 'clamp(80px, 13vw, 184px)', lineHeight: 0.92, letterSpacing: -4, fontWeight: 300, marginBottom: 60 }}>
            <span style={{ fontStyle: 'italic', color: 'var(--lab-primary,#C1663B)' }}>say</span> <span style={{ color: 'var(--accent)' }}>hello.</span>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(36px,6vw,80px)' }}>
          <Reveal>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 16, lineHeight: 1.8, color: 'var(--dim)', fontWeight: 300, maxWidth: 420, marginBottom: 40 }}>
              Have a film, environment, or VFX project? Let’s talk.
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 14, lineHeight: 1.9, color: 'var(--dim)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 32 }}>
              <div><span style={{ color: 'var(--dim)' }}>email&nbsp;&nbsp;</span><span style={{ color: 'var(--ink)' }}>bandakirankumar03@gmail.com</span></div>
              <div><span style={{ color: 'var(--dim)' }}>based&nbsp;&nbsp;</span><span style={{ color: 'var(--ink)' }}>Savannah, GA · USA</span></div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['LinkedIn', 'Polycam', 'Instagram'].map((s) => (
                <NavLink key={s} style={{ fontFamily: 'var(--mono)', fontSize: 13, border: `1px solid var(--hair)`, padding: '7px 14px', letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink)' }}>{s} →</NavLink>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            {sent ? (
              <div style={{ border: `1px solid var(--accent)`, padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Message sent</div>
                <div style={{ fontSize: 40, fontStyle: 'italic', fontWeight: 300, letterSpacing: -0.5 }}>Talk soon, {form.name.split(' ')[0] || 'friend'}.</div>
                <div style={{ marginTop: 20, fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--dim)', letterSpacing: 1, textTransform: 'uppercase' }}>I’ll reply to {form.email}.</div>
              </div>
            ) : (
              <form onSubmit={submit} name="contact" data-netlify="true" style={{ display: 'grid', gridTemplateColumns: bp === 'mobile' ? '1fr' : '1fr 1fr', gap: 20 }}>
                <input type="hidden" name="form-name" value="contact" />
                {field('name', 'Name')}
                {field('email', 'Email')}
                <div style={{ gridColumn: '1 / -1' }}>{field('project', 'Project', 4)}</div>
                <button type="submit" {...sendCursor}
                  style={{ gridColumn: '1 / -1', background: 'var(--accent)', color: '#0b0b0c', border: 'none', padding: '20px 28px', fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', cursor: 'none', textAlign: 'left', marginTop: 8 }}>
                  Send message &nbsp;&nbsp;→
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
