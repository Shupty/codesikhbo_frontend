import { useState } from "react";
import { BookOpen, Image, Info, Mail, Shield, Home, Zap } from "lucide-react";
import { request } from "../../lib/api";
import { saveSession } from "../../lib/auth";
import styles from "../../app/page.module.css";
import HomeSection from "../dashboard/HomeSection";
import AboutSection from "../dashboard/AboutSection";
import GallerySection from "../dashboard/GallerySection";
import ContactSection from "../dashboard/ContactSection";

export default function AuthScreen({ mode, setMode, onAuthenticated }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isRegister = mode === "register";
  const [section, setSection] = useState("Home");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const session = await request(`/auth/${isRegister ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(isRegister ? form : { email: form.email, password: form.password }),
      });
      saveSession(session);
      onAuthenticated(session.user, session.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const publicContent = {
    Home: <HomeSection user={{ name: "learner" }} stats={{ users: "∞", courses: "50+" }} onExplore={() => document.getElementById("auth-card")?.scrollIntoView({ behavior: "smooth" })} />,
    "About us": <AboutSection />,
    Gallery: <GallerySection />,
    "Contact us": <ContactSection />,
  };

  return (
    <main className={styles.publicShell}>
      <header className={styles.publicHeader}>
        <div className={styles.brand}><span className={styles.brandMark}><Zap size={17} fill="currentColor" /></span> codesikhbo.com</div>
        <nav className={styles.publicNav} aria-label="Public navigation">
          {[["Home", Home], ["About us", Info], ["Gallery", Image], ["Contact us", Mail]].map(([label, Icon]) => <button key={label} className={section === label ? styles.activeNav : ""} onClick={() => setSection(label)}><Icon size={15} />{label}</button>)}
        </nav>
        <button className={styles.primaryButton} onClick={() => document.getElementById("auth-card")?.scrollIntoView({ behavior: "smooth" })}><BookOpen size={15} /> Sign in</button>
      </header>
      <section className={styles.publicContent}>{publicContent[section]}</section>
      <section className={styles.authCardWrap} id="auth-card">
        <section className={styles.authIntro}>
        <div className={styles.brand}><span className={styles.brandMark}><Zap size={17} fill="currentColor" /></span> codesikhbo.com</div>
        <div className={styles.introCopy}><p className={styles.kicker}>SHIKHUN, EGIE JAN</p><h1>শিখুন আজ, এগিয়ে যান কাল।</h1><p>বাংলাদেশের শিক্ষার্থী ও নির্মাতাদের জন্য practical skills শেখার সহজ, আনন্দের জায়গা।</p></div>
        <div className={styles.introNote}><Shield size={18} /><span><b>Secure by design</b><small>Your account is protected with token-based authentication.</small></span></div>
        </section>
        <div className={styles.authCard}>
        <p className={styles.kicker}>WELCOME TO CODESIKHBO.COM</p><h2>{isRegister ? "Create your account" : "Welcome back"}</h2>
        <p className={styles.muted}>{isRegister ? "আজ থেকেই আপনার শেখার যাত্রা শুরু করুন।" : "আপনার শেখার workspace-এ sign in করুন।"}</p>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={submit}>
          {isRegister && <label>Full name<input required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="আপনার নাম" /></label>}
          <label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
          <label>Password<input required minLength={8} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" /></label>
          <button className={styles.primaryButton} disabled={busy}>{busy ? "Please wait…" : isRegister ? "Create account" : "Sign in"} {!busy && <span>→</span>}</button>
        </form>
        <p className={styles.switchAuth}>{isRegister ? "Already have an account?" : "New to codesikhbo.com?"} <button onClick={() => { setMode(isRegister ? "login" : "register"); setError(""); }}>{isRegister ? "Sign in" : "Create an account"}</button></p>
        </div>
      </section>
    </main>
  );
}
