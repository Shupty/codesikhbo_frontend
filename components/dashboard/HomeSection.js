import { ArrowRight, BookOpen, ShieldCheck, Users, Zap } from "lucide-react";
import styles from "../../app/page.module.css";

export default function HomeSection({ user, stats, onExplore }) {
  return (
    <section className={styles.homeSection}>
      <div className={styles.homeHero}>
        <div>
          <p className={styles.kicker}>WELCOME TO CODESIKHBO.COM</p>
          <h1>শিখুন নিজের গতিতে, গড়ুন নিজের ভবিষ্যৎ।</h1>
          <p>বাংলাদেশি learners-দের জন্য coding, career আর practical skills শেখার এক focused space।</p>
          <button className={styles.primaryButton} onClick={onExplore}>Explore courses <ArrowRight size={16} /></button>
        </div>
        <div className={styles.homeHeroIcon}><Zap size={40} /></div>
      </div>
      <div className={styles.homeStats}>
        <div><Users size={20} /><strong>{stats.users ?? "—"}</strong><span>Active learners</span></div>
        <div><BookOpen size={20} /><strong>{stats.courses ?? "—"}</strong><span>Courses available</span></div>
        <div><ShieldCheck size={20} /><strong>100%</strong><span>Secure learning</span></div>
      </div>
      <div className={styles.panelHeading}><div><p className={styles.kicker}>WHY CODESIKHBO.COM</p><h2>শেখার জন্য যা কিছু দরকার</h2><p>Welcome back, {user.name?.split(" ")[0]}. আপনার শেখার journey এখান থেকেই শুরু।</p></div></div>
    </section>
  );
}
