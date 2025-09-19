import React from "react";
import { motion } from "motion/react";

type Message = {
  id: string;
  name: string;
  title: string;
  role: string;
  photo?: string;
  message: string;
};

const ADVISOR: Message = {
  id: "m-advisor",
  name: "Dr. Md Ashiq Ur Rahman",
  title: "Message from the Club Advisor",
  role: "Advisor",
  photo: "/kuic.jpg",
  message:
    "As the Club Advisor, I am honored to be part of this incredible journey with the Khulna University Innovation Club. My role is to guide and support the team in their endeavors, ensuring that the club's activities align with our broader educational goals. I encourage all students to take full advantage of the club's resources, learn from the diverse experiences offered, and always strive for personal and professional growth. Together, we can build a future of success and opportunity.",
};

const LEADERS: Message[] = [
  {
    id: "m-pres",
    name: "Logan Hart",
    title: "Message from the President",
    role: "President",
    photo: "/kuic.jpg",
    message:
      "As the President of the Khulna University Innovation Club, I am delighted to welcome you to our vibrant and dynamic community. Our mission is to empower students with the knowledge, skills, and opportunities necessary to excel in their careers and personal growth.",
  },
  {
    id: "m-gs",
    name: "Victor Ramos",
    title: "Message from the General Secretary",
    role: "General Secretary",
    photo: "/kuic.jpg",
    message:
      "It is a privilege to serve as the General Secretary. Our goal is to support students in their journey toward personal and professional development by organizing events, maintaining communication, and ensuring smooth execution of activities.",
  },
];

const Messages: React.FC = () => {
  return (
    <section className="bg-base-100">
      {/* teal header */}
      <div className="bg-gradient-to-r from-primary to-cyan-600  py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-center">
              Insights & Messages
            </h2>
            <p className="text-center text-base-content/70 max-w-2xl mx-auto mt-2">
              Stay updated with the latest club initiatives and hear directly
              from our leadership.
            </p>
          </motion.div>

          <div className="mt-10 bg-base-200 text-base-content rounded-lg overflow-hidden shadow-lg">
            <div className="p-10 text-center">
              <img
                src={ADVISOR.photo}
                alt={ADVISOR.name}
                className="w-40 h-40 rounded-full mx-auto object-cover ring-4 ring-primary"
              />
              <h3 className="text-2xl font-semibold mt-4 text-primary">
                {ADVISOR.title}
              </h3>
              <p className="mt-4 text-sm text-base-content/80">
                {ADVISOR.message}
              </p>
              <div className="mt-6 text-sm font-semibold">— {ADVISOR.name}</div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {LEADERS.map((L) => (
              <div
                key={L.id}
                className="bg-base-100 flex-1 rounded-lg p-6 shadow-md"
              >
                <div className="flex flex-col items-start gap-4">
                  <img
                    src={L.photo}
                    alt={L.name}
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-primary"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-primary">
                      {L.title}
                    </h4>
                    <p className="text-sm text-muted mt-2">{L.message}</p>
                    <div className="mt-4 text-sm font-medium">— {L.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Messages;
