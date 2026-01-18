import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Linkedin, Github, Mail, User, Code, Briefcase, GraduationCap, Award, Folder, Phone } from 'lucide-react';

// GalaxyBackground Component
const GalaxyBackground = () => {
  const canvasRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleColors = ['#e0e0e0', '#a0a0ff', '#800080', '#ff6347'];
    const numPoints = 350;
    const particleSizes = [1, 1.5, 2];

    const generatePoints = () => {
      pointsRef.current = [];
      for (let i = 0; i < numPoints; i++) {
        pointsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          radius: particleSizes[Math.floor(Math.random() * particleSizes.length)],
          alpha: Math.random() * 0.7 + 0.3,
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
        });
      }
    };

    generatePoints();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generatePoints();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.fillStyle = '#05051a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      pointsRef.current.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0) point.x = canvas.width;
        if (point.x > canvas.width) point.x = 0;
        if (point.y < 0) point.y = canvas.height;
        if (point.y > canvas.height) point.y = 0;

        ctx.fillStyle = point.color;
        ctx.globalAlpha = point.alpha;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      const mouseThreshold = 200;
      const pointThreshold = 110;
      const mouse = mousePosRef.current;

      pointsRef.current.forEach(p => {
        const dMouse = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        if (dMouse < mouseThreshold) {
          pointsRef.current.forEach(op => {
            if (p !== op) {
              const dPoints = Math.hypot(p.x - op.x, p.y - op.y);
              const dMouseOp = Math.hypot(mouse.x - op.x, mouse.y - op.y);
              if (dPoints < pointThreshold && dMouseOp < mouseThreshold) {
                const opacity = 1 - dMouse / mouseThreshold;
                ctx.strokeStyle = `rgba(100,149,237,${opacity * 0.5})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(op.x, op.y);
                ctx.stroke();
              }
            }
          });
        }
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
};

// Section Component
const Section = ({ title, children, icon: IconComponent, sectionRef }) => (
  <section
    ref={sectionRef}
    className="mb-12 p-6 rounded-lg relative z-10"
    style={{
      backdropFilter: 'blur(1px)',
      backgroundColor: 'rgba(15, 15, 40, 0.7)',
      border: '1px solid rgba(160, 160, 255, 0.3)'
    }}
  >
    <h2 className="text-2xl font-bold text-[#80ffff] mb-4 border-b-2 border-[#60c0c0] pb-2 flex items-center">
      {IconComponent && <IconComponent size={28} className="mr-3 text-[#80ffff]" />}
      {title}
    </h2>
    <div className="text-white">{children}</div>
  </section>
);

function App() {
  const landingRef = useRef(null);
  const summaryRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const certificationsRef = useRef(null);
  const projectsRef = useRef(null);
  const achievementsRef = useRef(null);

  const navbarOffset = 70;
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  const scrollToSection = (ref) => {
    if (ref.current) {
      const pos = ref.current.getBoundingClientRect().top + window.scrollY - navbarOffset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (landingRef.current) {
        setIsNavbarVisible(landingRef.current.getBoundingClientRect().bottom <= 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <GalaxyBackground />

      {isNavbarVisible && (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#60c0c0] bg-gray-900 hidden md:flex">
          <div className="container mx-auto px-4 py-4 flex justify-center space-x-14 text-[#80ffff]">
            <button onClick={() => scrollToSection(skillsRef)}>Skills</button>
            <button onClick={() => scrollToSection(experienceRef)}>Experience</button>
            <button onClick={() => scrollToSection(educationRef)}>Education</button>
            <button onClick={() => scrollToSection(certificationsRef)}>Certifications</button>
            <button onClick={() => scrollToSection(projectsRef)}>Projects</button>
            <button onClick={() => scrollToSection(achievementsRef)}>Achievements</button>
          </div>
        </nav>
      )}

      {/* Landing */}
      <section ref={landingRef} className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-[#80ffff] mb-3">Naveen Kumar Manivannan</h1>
        <p className="text-lg md:text-3xl text-[#a0b0c0] mb-4">Software Engineer</p>
        <p className="text-md md:text-lg text-[#a0b0c0] mb-6 max-w-2xl">
          Backend-focused software engineer building scalable, secure, cloud-native systems using Java, Spring Boot, and AWS.
        </p>

        <div className="flex flex-col md:flex-row gap-6 text-[#80ffff] mb-10">
          <a href="mailto:naveennv2303@gmail.com" className="flex items-center"><Mail className="mr-2" /> naveennv2303@gmail.com</a>
          <span className="flex items-center"><Phone className="mr-2" /> +353 894654932</span>
          <a href="https://www.linkedin.com/in/naveennv" className="flex items-center"><Linkedin className="mr-2" /> LinkedIn</a>
          <a href="https://github.com/NaveenNV2303" className="flex items-center"><Github className="mr-2" /> GitHub</a>
        </div>

        <ChevronDown size={40} className="text-[#80ffff] animate-bounce" />
      </section>

      <div className="container mx-auto px-4 py-16">

        <Section title="Professional Summary" icon={User} sectionRef={summaryRef}>
          <p>
            Software Engineer with strong experience building scalable backend systems and cloud-native applications using Java 17,
            Spring Boot, and RESTful APIs. Skilled in microservices architecture, Kafka-based event-driven systems,
            containerized deployments on AWS, and CI/CD automation. Founder of WalrieWay, delivering end-to-end web
            and mobile solutions for real clients. Passionate about clean architecture, system reliability, and secure software design.
          </p>
        </Section>

        <Section title="Technical Skills" icon={Code} sectionRef={skillsRef}>
          <div className="grid md:grid-cols-3 gap-4">
            <p><strong>Languages:</strong> Java, Python, JavaScript, TypeScript</p>
            <p><strong>Frameworks:</strong> Spring Boot, React, Angular, Ionic, Flask</p>
            <p><strong>Cloud & DevOps:</strong> AWS, Docker, Kubernetes, Terraform</p>
            <p><strong>Databases:</strong> PostgreSQL, MySQL, Oracle, MongoDB</p>
            <p><strong>Messaging:</strong> Kafka, REST, OAuth2, JWT</p>
            <p><strong>CI/CD:</strong> Jenkins, GitHub Actions</p>
          </div>
        </Section>

        <Section title="Experience" icon={Briefcase} sectionRef={experienceRef}>
          <h3 className="text-xl text-[#80ffff] font-semibold">Capgemini | Software Engineer</h3>
          <p className="text-[#a0b0c0]">Apr 2021 – Apr 2023</p>
          <ul className="list-disc ml-4 mt-2">
            <li>Built Spring Boot microservices supporting 50M+ daily transactions with 99.9% uptime.</li>
            <li>Implemented Kafka-based event processing for distributed system integration.</li>
            <li>Automated CI/CD pipelines and cloud deployments on AWS EKS.</li>
            <li>Improved observability, resilience, and security using Resilience4J and OAuth2.</li>
          </ul>

          <h3 className="text-xl text-[#80ffff] font-semibold mt-6">WalrieWay | Founder & Software Engineer</h3>
          <p className="text-[#a0b0c0]">May 2023 – Present</p>
          <ul className="list-disc ml-4 mt-2">
            <li>Founded and delivered scalable web and mobile applications for small businesses.</li>
            <li>Built cross-platform Ionic apps and full-stack solutions.</li>
            <li>Managed full lifecycle from requirements to deployment.</li>
          </ul>
        </Section>

        <Section title="Projects" icon={Folder} sectionRef={projectsRef}>
          <ul className="list-disc ml-4">
            <li>Cloud-Based Risk Evaluation System (Java, Spring Boot, AWS, Kubernetes)</li>
            <li>Hotel Booking Platform with Kafka-driven workflows</li>
            <li>Real-Time Social Media Platform (Ionic, Firebase)</li>
            <li>Property Listing Platform (Flask, PostgreSQL)</li>
          </ul>
        </Section>

        <Section title="Achievements" icon={Award} sectionRef={achievementsRef}>
          <ul className="list-disc ml-4">
            <li>1-Star Performer at Capgemini for backend excellence</li>
            <li>Promoted to Senior Software Engineer within 2 years</li>
          </ul>
        </Section>

        <footer className="text-center text-[#a0b0c0] mt-12">
          © 2024 Naveen Kumar Manivannan
        </footer>
      </div>
    </div>
  );
}

export default App;
