import { Image, PlayCircle } from "lucide-react";
import styles from "../../app/page.module.css";

const moments = [
  { title: "Focused study", text: "Create time for the skills that matter.", tone: "purple" },
  { title: "Ideas in motion", text: "Turn lessons into real-world projects.", tone: "orange" },
  { title: "Shared progress", text: "Celebrate every milestone together.", tone: "blue" },
  { title: "Keep exploring", text: "There is always something new to learn.", tone: "green" },
];

export default function GallerySection() {
  return (
    <section className={styles.contentSection}>
      <div className={styles.sectionIntro}><p className={styles.kicker}>OUR COMMUNITY</p><h1>codesikhbo.com-এর learning moments.</h1><p>শেখার energy, project বানানোর আনন্দ আর community-র inspiration—সব এক জায়গায়।</p></div>
      <div className={styles.galleryGrid}>{moments.map((moment) => <article className={`${styles.galleryCard} ${styles[moment.tone]}`} key={moment.title}><div className={styles.galleryIcon}>{moment.tone === "blue" ? <PlayCircle size={28} /> : <Image size={28} />}</div><div><h2>{moment.title}</h2><p>{moment.text}</p></div></article>)}</div>
    </section>
  );
}
