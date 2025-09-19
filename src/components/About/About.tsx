const About = () => {
  return (
    <section className="py-16 bg-base-200">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Khulna University Innovation Club{" "}
            <span className="text-primary">(KUIC)</span>
          </h2>
          <p className="text-lg text-base-content mb-4">
            <strong>Khulna University Innovation Club (KUIC)</strong> is a
            student-driven community that nurtures creativity, technology
            exploration, and entrepreneurial thinking across Khulna University.
            We help students build skills, ship projects, and connect with
            mentors and the wider tech ecosystem.
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-2xl">🌟</span>
              <span>
                <strong>Workshops & Seminars:</strong> hands-on sessions on
                innovation, product design, and tech.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🤝</span>
              <span>
                <strong>Networking:</strong> events that connect students with
                alumni, startups, and industry leaders.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <span>
                <strong>Project Incubation:</strong> mentorship and resources to
                turn ideas into prototypes.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🏆</span>
              <span>
                <strong>Competitions:</strong> participate and win at hackathons
                and innovation challenges.
              </span>
            </li>
          </ul>

          <p className="italic text-sm text-secondary">
            "Inspiring the next generation of innovators at Khulna University."
          </p>
        </div>

        <div className="order-1 md:order-2 flex justify-center">
          <img
            src="/kuic.jpg"
            alt="KUIC"
            className="w-full max-w-md rounded-lg shadow-lg border border-base-300"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        <h3 className="text-2xl font-bold mb-6 text-center">Our Focus</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-5 bg-base-100 shadow-md border border-base-300 flex flex-col">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="font-semibold">Science</h4>
            <p className="text-sm text-muted mt-2 flex-1">
              Lab-style explorations, student research, and data-driven projects
              that deepen scientific understanding.
            </p>
            <div className="mt-4">
              <button className="btn btn-sm btn-outline">
                Explore Projects
              </button>
            </div>
          </div>

          <div className="card p-5 bg-base-100 shadow-md border border-base-300 flex flex-col">
            <div className="text-3xl mb-2">💻</div>
            <h4 className="font-semibold">Technology</h4>
            <p className="text-sm text-muted mt-2 flex-1">
              Workshops, hackathons, and maker sessions to build real-world
              apps, devices, and prototypes.
            </p>
            <div className="mt-4">
              <button className="btn btn-sm btn-outline">
                Join a Workshop
              </button>
            </div>
          </div>

          <div className="card p-5 bg-base-100 shadow-md border border-base-300 flex flex-col">
            <div className="text-3xl mb-2">🚀</div>
            <h4 className="font-semibold">Entrepreneurship</h4>
            <p className="text-sm text-muted mt-2 flex-1">
              Mentorship, business model workshops, and pitch practice to help
              members launch startups and social ventures.
            </p>
            <div className="mt-4">
              <button className="btn btn-sm btn-outline">
                Start a Venture
              </button>
            </div>
          </div>

          <div className="card p-5 bg-base-100 shadow-md border border-base-300 flex flex-col">
            <div className="text-3xl mb-2">📚</div>
            <h4 className="font-semibold">Philosophy</h4>
            <p className="text-sm text-muted mt-2 flex-1">
              Dialogues on ethics, design thinking, and the social impact of
              technology to keep innovation responsible.
            </p>
            <div className="mt-4">
              <button className="btn btn-sm btn-outline">Read Articles</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
