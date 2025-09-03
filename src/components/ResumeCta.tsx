"use client";

import { motion } from "framer-motion";

type Props = {
  resumePath?: string; // e.g. "/resume/Benjamin-Farthing-Resume.pdf"
  email?: string; // e.g. "benjamin@yourdomain.com"
  linkedin?: string; // e.g. "https://www.linkedin.com/in/benjaminfarthing"
};

export function ResumeCta({
  resumePath = "/resume/Benjamin-Farthing-Resume.pdf",
  email = "benjamin@example.com",
  linkedin = "https://www.linkedin.com/",
}: Props) {
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      alert("Email copied to clipboard");
    } catch {}
  };

  return (
    <motion.section
      id="resume"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto max-w-6xl pt-16 sm:pt-20"
    >
      <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">Let’s work together</h2>
        <p className="mt-2 text-white/80">
          Download my resume, say hello, or connect on LinkedIn.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={resumePath}
            download
            className="rounded-full bg-white/15 hover:bg-white/25 px-5 py-2.5 text-sm font-medium"
          >
            Download Resume
          </a>
          <a
            href={`mailto:${email}`}
            className="rounded-full bg-white/15 hover:bg-white/25 px-5 py-2.5 text-sm font-medium"
          >
            Email Me
          </a>
          <button
            onClick={copyEmail}
            className="rounded-full bg-white/10 hover:bg-white/20 px-5 py-2.5 text-sm font-medium"
          >
            Copy Email
          </button>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white/15 hover:bg-white/25 px-5 py-2.5 text-sm font-medium"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </motion.section>
  );
}
