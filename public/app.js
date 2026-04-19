import { useState, useEffect } from "react";

// ✅ Fallback data (always works)
const fallbackData = {
  logo: "LOGO",
  hero: {
    name: "Your Name",
    title: "Your Title",
    description: "Your description",
    image: "https://via.placeholder.com/300",
  },
  education: [],
  experience: [],
  projects: [],
  skills: {},
};

export default function Portfolio() {
  const [activeSkill, setActiveSkill] = useState(null);
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/data.json", { cache: "no-cache" });

        // ✅ If file exists → use it
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setUsingFallback(false);
        } else {
          // ❌ File not found → silently fallback
          setUsingFallback(true);
        }
      } catch (err) {
        // ❌ Network error → silently fallback
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="bg-black text-white font-sans min-h-screen">
      {/* INFO BANNER (no error crash) */}
      {usingFallback && (
        <div className="bg-yellow-600 text-center p-2 text-sm">
          Using default data (data.json not found)
        </div>
      )}

      {/* NAVBAR */}
      <nav className="fixed w-full flex justify-between p-4 bg-black/50 backdrop-blur z-50">
        <h1 className="text-red-500 font-bold">{data.logo}</h1>
        <div className="space-x-6 hidden md:block">
          <a href="#education">Education</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="h-screen flex items-center justify-between px-10">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-4">{data.hero?.name}</h1>
          <h2 className="text-red-500 mb-4">{data.hero?.title}</h2>
          <p className="text-gray-400 mb-6">{data.hero?.description}</p>
          <button className="bg-red-500 px-6 py-2 rounded-lg">Explore</button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-red-500 blur-3xl opacity-30 rounded-full"></div>
          <img src={data.hero?.image} alt="profile" className="relative rounded-lg" />
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="px-10 py-20">
        <h2 className="text-3xl mb-10">Education</h2>
        {(data.education || []).map((item, i) => (
          <div key={i} className="bg-white/5 p-6 rounded-xl mb-4">
            <h3 className="text-red-500">{item.degree}</h3>
            <p>{item.institution}</p>
            <span className="text-sm text-gray-400">{item.year}</span>
          </div>
        ))}
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="px-10 py-20">
        <h2 className="text-3xl mb-10">Experience</h2>
        {(data.experience || []).map((item, i) => (
          <div key={i} className="bg-white/5 p-6 rounded-xl mb-4">
            <h3 className="text-red-500">{item.role}</h3>
            <p>{item.company}</p>
            <span className="text-sm text-gray-400">{item.duration}</span>
          </div>
        ))}
      </section>

      {/* PROJECTS */}
      <section id="projects" className="px-10 py-20">
        <h2 className="text-3xl mb-10">Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(data.projects || []).map((proj, i) => (
            <div key={i} className="relative group">
              <img src={proj.image} alt="project" className="rounded-lg" />
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="px-10 py-20">
        <h2 className="text-3xl mb-10">Skills</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.keys(data.skills || {}).map((skill) => (
            <div
              key={skill}
              onClick={() => setActiveSkill(skill)}
              className="p-6 bg-white/5 rounded-xl cursor-pointer"
            >
              {skill}
            </div>
          ))}
        </div>

        {activeSkill && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3>{activeSkill}</h3>
              {(data.skills[activeSkill] || []).map((p, i) => (
                <div key={i}>{p.title}</div>
              ))}
              <button onClick={() => setActiveSkill(null)}>Close</button>
            </div>
          </div>
        )}
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-10 py-20">
        <h2 className="text-3xl mb-6">Contact</h2>
        <input placeholder="Name" className="block mb-2 p-2 bg-white/5" />
        <input placeholder="Email" className="block mb-2 p-2 bg-white/5" />
        <textarea placeholder="Message" className="block mb-2 p-2 bg-white/5"></textarea>
        <button className="bg-red-500 px-4 py-2">Send</button>
      </section>
    </div>
  );
}
