import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import styles from "../../app/page.module.css";

export default function ContactSection() {
  return (
    <section className={styles.contentSection}>
      <div className={styles.sectionIntro}>
        <p className={styles.kicker}>CONTACT US</p>
        <h1>We&apos;re here to help you keep learning.</h1>
        <p>Course, account বা codesikhbo.com experience নিয়ে কোনো প্রশ্ন আছে? জানাবেন—আমাদের team দ্রুত উত্তর দেবে।</p>
      </div>
      <div className={styles.contactGrid}>
        <div className={styles.contactDetails}>
          <div><Mail size={19} /><span><b>Email us</b><small>hello@codesikhbo.com</small></span></div>
          <div><Phone size={19} /><span><b>Call us</b><small>+8801982666706</small></span></div>
          <div><MapPin size={19} /><span><b>Visit us</b><small>Dhaka, Bangladesh</small></span></div>
        </div>
        <form className={styles.contactForm} onSubmit={(event) => event.preventDefault()}>
          <label>Your name<input required placeholder="আপনার নাম" /></label>
          <label>Email address<input required type="email" placeholder="you@example.com" /></label>
          <label>How can we help?<textarea required rows="4" placeholder="Tell us what you need..." /></label>
          <button className={styles.primaryButton} type="submit"><MessageCircle size={16} /> Send message</button>
        </form>
      </div>
    </section>
  );
}
