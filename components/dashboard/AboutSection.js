import { HeartHandshake, Lightbulb, Target } from "lucide-react";
import styles from "../../app/page.module.css";

const values = [
  { icon: Target, title: "Purposeful learning", text: "Every course is designed around practical outcomes you can apply immediately." },
  { icon: Lightbulb, title: "Curiosity first", text: "We make it easy to discover ideas, build confidence, and keep asking better questions." },
  { icon: HeartHandshake, title: "Learn together", text: "Progress is better with support, encouragement, and a community that has your back." },
];

export default function AboutSection() {
  return (
    <section className={styles.contentSection}>
      <div className={styles.sectionIntro}><p className={styles.kicker}>ABOUT US</p><h1>একটি lesson, একটি নতুন সম্ভাবনা।</h1><p>codesikhbo.com বাংলাদেশি শিক্ষার্থীদের জন্য clear course, friendly guidance আর measurable progress একসাথে আনে—যাতে প্রতিদিন শেখা সহজ ও আনন্দের হয়।</p></div>
      <div className={styles.valueGrid}>{values.map(({ icon: Icon, title, text }) => <article className={styles.valueCard} key={title}><span><Icon size={21} /></span><h2>{title}</h2><p>{text}</p></article>)}</div>
    </section>
  );
}
