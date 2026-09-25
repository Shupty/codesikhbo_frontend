"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen, Check, ChevronDown, CircleHelp, LayoutDashboard, LogOut,
  Menu, Pencil, Plus, RefreshCw, Search, Shield, Trash2, UserRound,
  Users, X, Zap,
} from "lucide-react";
import styles from "./page.module.css";
import { request } from "../lib/api";
import { clearSession, restoreSession, saveSession } from "../lib/auth";
import AuthScreen from "../components/auth/AuthScreen";
import Stat from "../components/dashboard/Stat";
import LearnerPanel from "../components/learner/LearnerPanel";
import HomeSection from "../components/dashboard/HomeSection";
import AboutSection from "../components/dashboard/AboutSection";
import GallerySection from "../components/dashboard/GallerySection";

function CourseModal({ course, close, save }) {
  const [form, setForm] = useState({ title: course?.title || "", description: course?.description || "", published: course?.published || false });
  const [busy, setBusy] = useState(false);
  async function submit(event) { event.preventDefault(); setBusy(true); await save(form); setBusy(false); }
  return <div className={styles.modalBackdrop}><div className={styles.modal}>
    <div className={styles.modalHeader}><div><p className={styles.kicker}>{course ? "EDIT COURSE" : "NEW COURSE"}</p><h2>{course ? "Update course" : "Create a course"}</h2></div><button className={styles.iconButton} onClick={close}><X size={19} /></button></div>
    <form onSubmit={submit}><label>Course title<input required minLength={2} maxLength={200} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Introduction to product design" /></label><label>Description<textarea rows="4" maxLength={5000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What will learners take away?" /></label><label className={styles.checkLabel}><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Publish this course</label><div className={styles.modalActions}><button type="button" className={styles.secondaryButton} onClick={close}>Cancel</button><button className={styles.primaryButton} disabled={busy}>{busy ? "Saving…" : "Save course"}</button></div></form>
  </div></div>;
}

function Sidebar({ active, setActive, user, logout, open, close }) {
  return <><aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}><div className={styles.brand}><span className={styles.brandMark}><Zap size={17} fill="currentColor" /></span> codesikhbo.com<button className={styles.closeMenu} onClick={close}><X size={19} /></button></div><div className={styles.workspace}><span className={styles.workspaceLogo}>C</span><span><b>codesikhbo.com</b><small>Admin workspace</small></span><ChevronDown size={15} /></div><p className={styles.sectionLabel}>Explore</p><nav>{[["Home", LayoutDashboard], ["About us", CircleHelp], ["Gallery", BookOpen]].map(([label, Icon]) => <button key={label} onClick={() => { setActive(label); close(); }} className={active === label ? styles.activeNav : ""}><Icon size={18} /><span>{label}</span></button>)}</nav><p className={styles.sectionLabel}>Workspace</p><nav>{[["Overview", LayoutDashboard], ["Courses", BookOpen], ["Learners", Users]].map(([label, Icon]) => <button key={label} onClick={() => { setActive(label); close(); }} className={active === label ? styles.activeNav : ""}><Icon size={18} /><span>{label}</span></button>)}</nav><div className={styles.sidebarBottom}><div className={styles.user}><span className={styles.avatar}>{(user.name || "A").slice(0, 2).toUpperCase()}</span><span><b>{user.name}</b><small>{user.role === "admin" ? "Administrator" : "Learner"}</small></span><button className={styles.logoutButton} onClick={logout} title="Log out"><LogOut size={16} /></button></div></div></aside>{open && <button className={styles.backdrop} aria-label="Close menu" onClick={close} />}</>;
}

function Dashboard({ user, token, logout }) {
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [summary, courseData, userData] = await Promise.all([request("/dashboard", {}, token), request("/courses", {}, token), request("/users", {}, token)]);
      setDashboard(summary); setCourses(courseData.courses || []); setUsers(userData.users || []);
    } catch (err) { if (err.message.includes("token") || err.message.includes("Authentication")) logout(); else setError(err.message); } finally { setLoading(false); }
  }, [token, logout]);
  useEffect(() => { load(); }, [load]);

  async function saveCourse(values) {
    try { const data = await request(modal.course ? `/courses/${modal.course._id || modal.course.id}` : "/courses", { method: modal.course ? "PATCH" : "POST", body: JSON.stringify(values) }, token); setCourses((items) => modal.course ? items.map((item) => (item._id || item.id) === (modal.course._id || modal.course.id) ? data.course : item) : [data.course, ...items]); setModal(null); setNotice("Course saved successfully."); } catch (err) { setError(err.message); }
  }
  async function deleteCourse(course) {
    if (!window.confirm(`Delete “${course.title}”?`)) return;
    try { await request(`/courses/${course._id || course.id}`, { method: "DELETE" }, token); setCourses((items) => items.filter((item) => (item._id || item.id) !== (course._id || course.id))); setNotice("Course deleted."); } catch (err) { setError(err.message); }
  }
  async function updateUser(item, patch) {
    try { const data = await request(`/users/${item.id || item._id}`, { method: "PATCH", body: JSON.stringify(patch) }, token); setUsers((items) => items.map((u) => (u.id || u._id) === (item.id || item._id) ? data.user : u)); setNotice("User updated."); } catch (err) { setError(err.message); }
  }
  const filteredCourses = useMemo(() => courses.filter((course) => `${course.title} ${course.description}`.toLowerCase().includes(query.toLowerCase())), [courses, query]);
  const stats = dashboard?.stats || {};

  if (loading && !dashboard) return <div className={styles.centerState}><RefreshCw className={styles.spin} /><p>Loading your workspace…</p></div>;
  return <div className={styles.shell}><Sidebar active={active} setActive={setActive} user={user} logout={logout} open={menuOpen} close={() => setMenuOpen(false)} /><main className={styles.main}><header className={styles.header}><button className={styles.menuButton} onClick={() => setMenuOpen(true)}><Menu size={21} /></button><div className={styles.breadcrumb}><span>Workspace</span><b> / {active}</b></div><div className={styles.headerActions}><button className={styles.iconButton} onClick={load} title="Refresh"><RefreshCw size={17} className={loading ? styles.spin : ""} /></button><div className={styles.headerAvatar}>{(user.name || "A").slice(0, 2).toUpperCase()}</div></div></header><div className={styles.content}>
    {error && <div className={styles.error}>{error}<button onClick={() => setError("")}><X size={14} /></button></div>}{notice && <div className={styles.notice}>{notice}<button onClick={() => setNotice("")}><Check size={14} /></button></div>}
    {active === "Home" && <HomeSection user={user} stats={stats} onExplore={() => setActive("Courses")} />}
    {active === "About us" && <AboutSection />}
    {active === "Gallery" && <GallerySection />}
    {active === "Overview" && <><div className={styles.titleRow}><div><p className={styles.kicker}>{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).toUpperCase()}</p><h1>Good morning, {user.name?.split(" ")[0]} <span>✦</span></h1><p className={styles.subtitle}>Here’s what’s happening across your learning space.</p></div><button className={styles.primaryButton} onClick={() => setModal({})}><Plus size={18} /> Create course</button></div><section className={styles.statsGrid}><Stat icon={<Users size={19} />} tone="purple" label="Total learners" value={stats.users ?? "—"} detail="Registered accounts" /><Stat icon={<BookOpen size={19} />} tone="orange" label="Total courses" value={stats.courses ?? "—"} detail={`${stats.publishedCourses ?? 0} published`} /><Stat icon={<Shield size={19} />} tone="green" label="Your role" value={user.role === "admin" ? "Admin" : "User"} detail={user.active ? "Account active" : "Account inactive"} /><Stat icon={<UserRound size={19} />} tone="blue" label="Workspace" value="Live" detail="Connected to API" /></section><section className={styles.dashboardGrid}><div className={`${styles.panel} ${styles.welcomePanel}`}><div className={styles.largeIcon}><Zap size={25} /></div><h2>Make learning move forward.</h2><p>Create clear, engaging courses and keep your academy in sync with real-time data from your API.</p><button className={styles.secondaryButton} onClick={() => setActive("Courses")}>Explore courses →</button></div><div className={styles.panel}><div className={styles.panelHeading}><div><h2>Quick overview</h2><p>Workspace at a glance</p></div></div><div className={styles.overviewRows}><div><span>Published courses</span><b>{stats.publishedCourses ?? 0}</b></div><div><span>Draft courses</span><b>{Math.max(0, (stats.courses || 0) - (stats.publishedCourses || 0))}</b></div><div><span>Team members</span><b>{stats.users ?? 0}</b></div></div></div></section></>}
    {active === "Courses" && <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>CATALOG</p><h2>Courses</h2><p>Manage the learning content in your academy.</p></div><button className={styles.primaryButton} onClick={() => setModal({})}><Plus size={17} /> New course</button></div><div className={styles.toolbar}><div className={styles.search}><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses…" /></div><button className={styles.secondaryButton} onClick={load}><RefreshCw size={15} /> Refresh</button></div>{filteredCourses.length ? <div className={styles.courseList}>{filteredCourses.map((course) => <article className={styles.courseItem} key={course._id || course.id}><div className={styles.courseIcon}><BookOpen size={20} /></div><div className={styles.courseInfo}><h3>{course.title}</h3><p>{course.description || "No description added yet."}</p><small>{course.instructor?.name || "You"} · {course.published ? "Published" : "Draft"}</small></div><span className={course.published ? styles.published : styles.draft}>{course.published ? "Published" : "Draft"}</span><button className={styles.iconButton} onClick={() => setModal({ course })} title="Edit"><Pencil size={16} /></button><button className={`${styles.iconButton} ${styles.danger}`} onClick={() => deleteCourse(course)} title="Delete"><Trash2 size={16} /></button></article>)}</div> : <div className={styles.empty}><BookOpen size={30} /><h3>{query ? "No matching courses" : "No courses yet"}</h3><p>{query ? "Try another search." : "Create your first course to get started."}</p></div>}</section>}
    {active === "Learners" && <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>PEOPLE</p><h2>Learners & team</h2><p>View accounts and manage access permissions.</p></div><button className={styles.secondaryButton} onClick={load}><RefreshCw size={15} /> Refresh</button></div>{users.length ? <div className={styles.userList}>{users.map((item) => <div className={styles.userRow} key={item.id || item._id}><span className={styles.avatar}>{(item.name || "A").slice(0, 2).toUpperCase()}</span><div><b>{item.name}</b><small>{item.email}</small></div><select value={item.role} onChange={(e) => updateUser(item, { role: e.target.value })}><option value="user">Learner</option><option value="admin">Admin</option></select><label className={styles.toggle}><input type="checkbox" checked={item.active} onChange={(e) => updateUser(item, { active: e.target.checked })} /><span /></label><span className={item.active ? styles.activeStatus : styles.inactiveStatus}>{item.active ? "Active" : "Inactive"}</span></div>)}</div> : <div className={styles.empty}><Users size={30} /><h3>No users found</h3><p>New registrations will appear here.</p></div>}</section>}
  </div></main>{modal && <CourseModal course={modal.course} close={() => setModal(null)} save={saveCourse} />}</div>;
}

export default function Home() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [ready, setReady] = useState(false);
  const logout = useCallback(() => { clearSession(); setToken(null); setUser(null); }, []);
  useEffect(() => { restoreSession().then((session) => { if (session) { setToken(session.token); setUser(session.user); } }).catch(() => {}).finally(() => setReady(true)); }, []);
  if (!ready) return <div className={styles.centerState}><RefreshCw className={styles.spin} /><p>Preparing your workspace…</p></div>;
  if (!token || !user) return <AuthScreen mode={mode} setMode={setMode} onAuthenticated={(nextUser, nextToken) => { saveSession({ user: nextUser, token: nextToken }); setUser(nextUser); setToken(nextToken); }} />;
  if (user.role === "user") return <LearnerPanel user={user} token={token} logout={logout} />;
  if (user.role !== "admin") return <div className={styles.centerState}><Shield size={38} /><h2>Admin access required</h2><p>Your account does not have permission to view this workspace.</p><button className={styles.primaryButton} onClick={logout}><LogOut size={16} /> Log out</button></div>;
  return <Dashboard user={user} token={token} logout={logout} />;
}
