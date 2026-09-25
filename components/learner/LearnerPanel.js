"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Check, Home, Image, Info, LogOut, Mail, RefreshCw, Search, Sparkles, X, Zap } from "lucide-react";
import { request } from "../../lib/api";
import styles from "./learner.module.css";
import HomeSection from "../dashboard/HomeSection";
import AboutSection from "../dashboard/AboutSection";
import GallerySection from "../dashboard/GallerySection";
import ContactSection from "../dashboard/ContactSection";

function courseId(course) {
  return course?._id || course?.id;
}

function CourseCard({ course, enrolled, onEnroll, busy }) {
  return (
    <article className={styles.courseCard}>
      <div className={styles.courseBadge}><BookOpen size={20} /></div>
      <div className={styles.courseBody}>
        <div className={styles.cardTopline}>
          <span className={styles.courseLabel}>COURSE</span>
          {enrolled && <span className={styles.enrolled}><Check size={12} /> Enrolled</span>}
        </div>
        <h3>{course.title}</h3>
        <p>{course.description || "Build practical skills at your own pace."}</p>
        <small>By {course.instructor?.name || "codesikhbo.com"}</small>
        {!enrolled && <button className={styles.primaryButton} disabled={busy} onClick={() => onEnroll(course)}>
          {busy ? "Enrolling…" : "Enroll now"} <span>→</span>
        </button>}
      </div>
    </article>
  );
}

function EnrollmentCard({ enrollment, onProgress, busy }) {
  const course = enrollment.course || {};
  const progress = Math.max(0, Math.min(100, Number(enrollment.progress) || 0));
  const id = courseId(course);
  return (
    <article className={styles.enrollmentCard}>
      <div className={styles.enrollmentIcon}><BookOpen size={19} /></div>
      <div className={styles.enrollmentContent}>
        <div className={styles.enrollmentTitle}><h3>{course.title || "Course unavailable"}</h3><strong>{progress}%</strong></div>
        <div className={styles.progressTrack} aria-label={`${progress}% complete`}><span style={{ width: `${progress}%` }} /></div>
        <div className={styles.progressMeta}><span>{progress === 100 ? "Completed" : progress ? "In progress" : "Not started"}</span><small>Update your progress</small></div>
        <input className={styles.progressRange} type="range" min="0" max="100" step="5" value={progress} disabled={busy || !id} onChange={(event) => onProgress(id, Number(event.target.value))} />
        <div className={styles.progressButtons}>
          {[0, 25, 50, 75, 100].map((value) => <button key={value} disabled={busy || progress === value || !id} onClick={() => onProgress(id, value)}>{value}%</button>)}
        </div>
      </div>
    </article>
  );
}

export default function LearnerPanel({ user, token, logout }) {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [active, setActive] = useState("Home");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [courseData, enrollmentData] = await Promise.all([
        request("/learner/courses", {}, token),
        request("/learner/enrollments", {}, token),
      ]);
      setCourses(courseData.courses || []);
      setEnrollments(enrollmentData.enrollments || []);
    } catch (err) {
      if (err.status === 401 || err.message.toLowerCase().includes("token")) logout();
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [logout, token]);

  useEffect(() => { load(); }, [load]);

  const enrolledIds = useMemo(() => new Set(enrollments.map((item) => courseId(item.course))), [enrollments]);
  const availableCourses = useMemo(() => courses.filter((course) => !enrolledIds.has(courseId(course)) && `${course.title} ${course.description || ""}`.toLowerCase().includes(query.toLowerCase())), [courses, enrolledIds, query]);
  const completed = enrollments.filter((item) => Number(item.progress) >= 100).length;

  async function enroll(course) {
    const id = courseId(course);
    setBusyId(id);
    setError("");
    try {
      const data = await request(`/learner/courses/${id}/enroll`, { method: "POST" }, token);
      setEnrollments((items) => [data.enrollment, ...items]);
      setNotice(`You're enrolled in ${course.title}.`);
    } catch (err) { setError(err.message); } finally { setBusyId(""); }
  }

  async function updateProgress(id, progress) {
    setBusyId(id);
    setError("");
    try {
      const data = await request(`/learner/enrollments/${id}/progress`, { method: "PATCH", body: JSON.stringify({ progress }) }, token);
      setEnrollments((items) => items.map((item) => courseId(item.course) === id ? data.enrollment : item));
    } catch (err) { setError(err.message); } finally { setBusyId(""); }
  }

  const navigate = (section) => setActive(section);
  return <div className={styles.shell}>
    <header className={styles.header}><div className={styles.brand}><span className={styles.brandMark}><Zap size={16} fill="currentColor" /></span> codesikhbo.com</div><nav className={styles.userNav} aria-label="Main navigation">{[["Home", Home], ["About us", Info], ["Gallery", Image], ["Contact us", Mail], ["Courses", BookOpen]].map(([label, Icon]) => <button key={label} className={active === label ? styles.activeNav : ""} onClick={() => navigate(label)}><Icon size={15} />{label}</button>)}</nav><div className={styles.headerRight}><span className={styles.welcome}>Hi, {user.name?.split(" ")[0]}</span><span className={styles.avatar}>{(user.name || "L").slice(0, 2).toUpperCase()}</span><button className={styles.logout} onClick={logout} title="Log out"><LogOut size={17} /></button></div></header>
    <main className={styles.content}>
      {error && <div className={styles.error}>{error}<button onClick={() => setError("")}><X size={14} /></button></div>}
      {notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}><Check size={14} /></button></div>}
      {active === "Home" && <HomeSection user={user} stats={{ users: "∞", courses: courses.length }} onExplore={() => navigate("Courses")} />}
      {active === "About us" && <AboutSection />}
      {active === "Gallery" && <GallerySection />}
      {active === "Contact us" && <ContactSection />}
      {active === "Courses" && <><section className={styles.hero}><div><p className={styles.kicker}>YOUR LEARNING SPACE</p><h1>Keep growing, {user.name?.split(" ")[0]} <span>✦</span></h1><p>Discover new skills and keep your learning momentum going.</p></div><div className={styles.heroIcon}><Sparkles size={27} /></div></section>
      <section className={styles.summary}><div><strong>{enrollments.length}</strong><span>Enrolled courses</span></div><div><strong>{completed}</strong><span>Completed</span></div><div><strong>{courses.length}</strong><span>Available courses</span></div></section>
      <section className={styles.section}><div className={styles.sectionHeading}><div><p className={styles.kicker}>CONTINUE LEARNING</p><h2>My courses</h2></div><button className={styles.refresh} onClick={load} disabled={loading}><RefreshCw size={15} className={loading ? styles.spin : ""} /> Refresh</button></div>
        {enrollments.length ? <div className={styles.enrollmentList}>{enrollments.map((item) => <EnrollmentCard key={courseId(item.course)} enrollment={item} onProgress={updateProgress} busy={busyId === courseId(item.course)} />)}</div> : <div className={styles.empty}><BookOpen size={28} /><h3>Your learning journey starts here</h3><p>Enroll in a course below to begin learning.</p></div>}
      </section>
      <section className={styles.section}><div className={styles.sectionHeading}><div><p className={styles.kicker}>COURSE CATALOG</p><h2>Explore courses</h2><p className={styles.sectionSub}>Find something new to learn today.</p></div><label className={styles.search}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses…" /></label></div>
        {loading && !courses.length ? <div className={styles.loading}><RefreshCw className={styles.spin} /> Loading courses…</div> : availableCourses.length ? <div className={styles.courseGrid}>{availableCourses.map((course) => <CourseCard key={courseId(course)} course={course} enrolled={false} onEnroll={enroll} busy={busyId === courseId(course)} />)}</div> : <div className={styles.empty}><Search size={28} /><h3>{query ? "No courses match your search" : "No new courses available"}</h3><p>{query ? "Try a different search term." : "Check back soon for new learning opportunities."}</p></div>}
      </section></>}
    </main>
  </div>;
}
