import React from "react";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.documentElement.style.margin = "0";
  document.documentElement.style.padding = "0";
}

const heroVariants = {
  hidden: { opacity: 0, y: -60, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, type: "spring" } },
};

const detailsVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, type: "spring" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.7 + i * 0.15, duration: 0.6, type: "spring" },
  }),
};

const footerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 1.1, type: "spring" } },
};

const features = [
  {
    title: "Contract Drafting & Review",
    desc: "Clear, concise, and enforceable contracts tailored to your needs.",
    icon: "📝",
  },
  {
    title: "Startup Legal Packages",
    desc: "All-in-one solutions for new businesses and founders.",
    icon: "🚀",
  },
  {
    title: "IP Protection",
    desc: "Safeguard your ideas, brands, and creative work.",
    icon: "🔒",
  },
  {
    title: "Compliance & Privacy",
    desc: "Stay ahead of regulations and protect your users.",
    icon: "🔎",
  },
];

const DummyPage: React.FC = () => (
  <div
    style={{
      minHeight: "100dvh",
      width: "100vw",
      margin: 0,
      padding: 0,
      overflow: "hidden",
      fontFamily: "Inter, sans-serif",
      background: "#fff",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Hero Section */}
    <motion.div
      initial="hidden"
      animate="visible"
      variants={heroVariants}
      style={{
        width: "100vw",
        background: "linear-gradient(120deg, #0a72bd 0%,  #84c4eeff 100%)", // updated gradient
        color: "#fff",
        padding: "72px 0 56px 0",
        textAlign: "center",
        boxShadow: "0 4px 32px 0 rgba(10,114,189,0.10)",
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px",
        position: "relative",
        overflow: "hidden",
        margin: 0,
      }}
    >
      <motion.img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
        alt="Hero"
        initial={{ opacity: 0, scale: 0.8, y: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -10, 0],
        }}
        transition={{
          delay: 0.3,
          duration: 2.4,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          type: "tween",
        }}
        style={{
          width: "130px",
          height: "130px",
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: "28px",
          border: "5px solid #fff",
          boxShadow: "0 6px 32px rgba(0,0,0,0.13)",
          background: "#eaf6fd",
        }}
      />
      <motion.h1
        style={{
          fontSize: "2.9rem",
          margin: 0,
          fontWeight: 900,
          letterSpacing: "-1px",
          lineHeight: 1.1,
          textShadow: "0 2px 12px #0a72bd55",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        Welcome to <span style={{ color: "#ffe066" }}>neon.law</span>
      </motion.h1>
      <motion.p
        style={{
          fontSize: "1.35rem",
          marginTop: "18px",
          opacity: 0.97,
          fontWeight: 500,
          textShadow: "0 1px 8px #0a72bd33",
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
      >
        Modern legal solutions for a digital world.
      </motion.p>
    </motion.div>

    {/* Details Section */}
    <motion.div
      initial="hidden"
      animate="visible"
      variants={detailsVariants}
      style={{
        flex: 1,
        maxWidth: "100vw",
        margin: "0 auto",
        background: "linear-gradient(120deg, #fafdff 0%, #fff 100%)", // subtle white gradient
        borderRadius: "0px",
        boxShadow: "none",
        padding: "48px 0 40px 0",
        position: "relative",
        zIndex: 2,
      }}
    >
      <h2 style={{ color: "#0a72bd", marginBottom: "22px", fontWeight: 800, fontSize: "2.1rem", letterSpacing: "-0.5px", textAlign: "center" }}>
        About neon.law
      </h2>
      <p style={{ color: "#333", fontSize: "1.18rem", lineHeight: 1.7, marginBottom: "38px", fontWeight: 500, textAlign: "center", maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
        neon.law is dedicated to providing accessible, transparent, and innovative legal services for startups, creators, and businesses.
        Our team leverages technology to streamline legal processes, making it easier for you to focus on what matters most—growing your vision.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "28px",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            style={{
              background: "linear-gradient(120deg, #0a72bd 0%,  #84c4eeff 90%)", // card gradient
              borderRadius: "16px",
              padding: "32px 20px",
              boxShadow: "0 2px 12px rgba(10,114,189,0.09)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "170px",
              border: "1.5px solid #0a72bd",
              transition: "border 0.2s",
            }}
            whileHover={{
              scale: 1.06,
              border: "1.5px solid #ffe066",
              boxShadow: "0 8px 32px #0a72bd33",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span style={{ fontSize: "2.3rem", marginBottom: "14px" }}>{feature.icon}</span>
            <div style={{ fontWeight: 700, color: "#ffe066", fontSize: "1.15rem", marginBottom: "7px", letterSpacing: "-0.2px" }}>
              {feature.title}
            </div>
            <div style={{ color: "#fff", fontSize: "1.04rem", textAlign: "center", fontWeight: 500 }}>{feature.desc}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Footer */}
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={footerVariants}
      style={{
        background: "linear-gradient(90deg, #0a72bd 0%,  #84c4eeff 100%)", // footer gradient
        color: "#fff",
        textAlign: "center",
        padding: "32px 0 18px 0",
        marginTop: "auto",
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        boxShadow: "0 -2px 16px #0a72bd22",
        width: "100vw",
        position: "relative",
        left: 0,
        right: 0,
        marginLeft: 0,
        marginRight: 0,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: "1.13rem" }}>
        <span style={{ marginRight: 8 }}>Contact us:</span>
        <a href="mailto:hello@neon.law" style={{ color: "#ffe066", textDecoration: "underline" }}>hello@neon.law</a>
        <span style={{ margin: "0 8px" }}>|</span>
        <a href="tel:+15551234567" style={{ color: "#ffe066", textDecoration: "underline" }}>+1 (555) 123-4567</a>
      </div>
      <div style={{ fontSize: "1rem", marginTop: "12px", opacity: 0.85 }}>
        &copy; {new Date().getFullYear()} neon.law. All rights reserved.
      </div>
    </motion.footer>
  </div>
);

export default DummyPage;