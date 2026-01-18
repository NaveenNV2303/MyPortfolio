import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Linkedin,
  Github,
  Mail,
  User,
  Code,
  Briefcase,
  GraduationCap,
  Award,
  Folder,
  Phone
} from 'lucide-react';

/* ================= BACKGROUND ================= */

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
          color: particleColors[Math.floor(Math.random() * particleColors.length)]
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

      pointsRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
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

/* ================= SECTION ================= */

const Section = ({ title, children, icon: Icon, sectionRef }) => (
  <section
    ref={sectionRef}
    className="mb-12 p-6 rounded-lg relative z-10"
    style={{
      backdropFilter: 'blur(1px)',
      backgroundColor: 'rgba(15,15,40,0.7)',
      border: '1px solid rgba(160,160,255,0.3)'
    }}
  >
    <h2 className="text-2xl font-bold text-[#80ffff] mb-4 border-b-2 border-[#60c0c0] pb-2 flex items-center">
      {Icon && <Icon size={28} className="mr-3" />}
      {title}
    </h2>
    <div className="text-white">{children}</div>
  </section>
);

/* ================= APP ================= */

function App() {
  const landingRef = useRef(null);
  const summaryRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const certificationsRef = useRef(null);
  const projectsRef = useRef(null);
  const achievementsRef = useRef(null);

  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const navbarOffset = 70;

  const scrollToSection = (ref) => {
    if (ref.current) {
      const pos = ref.current.getBoundingClientRect().top + window.scrollY - navbarOffset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const onScroll = () => {
      if (landingRef.current) {
        setIsNavbarVisible(landingRef.current.getBoundingClientRect().bottom <= 0);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <GalaxyBackground />

      {isNavbarVisible && (
        <nav className="fixed top-0 inset-x-0 z-50 bg-gray-900 border-b border-[#60c0c0] hidden md:flex">
          <div className="mx-auto px-4 py-4 flex space-x-14 text-[#80ffff]">
            <button onClick={() => scrollToSection(skillsRef)}>Skills</button>
            <button onClick={() => scrollToSection(experienceRef)}>Experience</button>
            <button onClick={() => scrollToSection(educationRef)}>Education</button>
            <button onClick={() => scrollToSection(certificationsRef)}>Certifications</button>
            <button onClick={() => scrollToSection(projectsRef)}>Projects</button>
            <button onClick={() => scrollToSection(achievementsRef)}>Achievements</button>
          </div>
        </nav>
      )}

      {/* LANDING */}
      <section ref={landingRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-[#80ffff] mb-3">
          Naveen Kumar Manivannan
        </h1>
        <p className="text-lg md:text-3xl text-[#a0b0c0] mb-4">Software Engineer</p>
        <p className="text-md md:text-lg text-[#a0b0c0] max-w-2xl mb-6">
          Software Engineer specializing in scalable backend systems, cloud-native architectures,
          and full-stack development with Java, Spring Boot, React, and AWS.
        </p>

        <div className="flex flex-col md:flex-row gap-6 text-[#80ffff] text-lg">
          <a href="mailto:naveennv2303@gmail.com" className="flex items-center">
            <Mail className="mr-2" /> naveennv2303@gmail.com
          </a>
          <span className="flex items-center">
            <Phone className="mr-2" /> +353 894654932
          </span>
          <a href="https://linkedin.com/in/naveennv" className="flex items-center">
            <Linkedin className="mr-2" /> LinkedIn
          </a>
          <a href="https://github.com/NaveenNV2303" className="flex items-center">
            <Github className="mr-2" /> GitHub
          </a>
        </div>

        <ChevronDown size={40} className="text-[#80ffff] mt-12 animate-bounce" />
      </section>

      <div className="container mx-auto px-4 py-8 pt-16 relative z-10">

        {/* SUMMARY */}
        <Section title="Professional Summary" icon={User} sectionRef={summaryRef}>
          <p>
            Software Engineer with strong hands-on experience building scalable,
            cloud-ready applications using Java 17, Spring Boot, and RESTful APIs.
            Skilled full-stack developer with React and Ionic experience, backend
            services on AWS, and CI/CD automation. Founder of WalrieWay, delivering
            end-to-end web and mobile solutions. Passionate about clean architecture,
            distributed systems, and continuous learning.
          </p>
        </Section>

        {/* SKILLS */}
        <Section title="Technical Skills" icon={Code} sectionRef={skillsRef}>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Languages:</strong> Java, Python, JavaScript, TypeScript, C++, C#</li>
            <li><strong>Frameworks:</strong> Spring Boot, React, Angular, Node.js, Flask, Django</li>
            <li><strong>Databases:</strong> PostgreSQL, MySQL, Oracle, MongoDB, Redis, DynamoDB</li>
            <li><strong>Messaging:</strong> Kafka, REST, OAuth2, JWT, RBAC, mTLS</li>
            <li><strong>Cloud & DevOps:</strong> AWS, Azure, Docker, Kubernetes, Terraform, Jenkins</li>
          </ul>
        </Section>

        {/* EXPERIENCE */}
        <Section title="Experience" icon={Briefcase} sectionRef={experienceRef}>
          <h3 className="text-xl font-semibold text-[#80ffff]">Capgemini — Software Engineer</h3>
          <p className="text-[#a0b0c0] mb-2">Apr 2021 – Apr 2023</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Built Java 17 & Spring Boot microservices supporting 50M+ daily transactions.</li>
            <li>Developed React-based UIs for financial applications.</li>
            <li>Implemented Kafka-based event-driven integrations.</li>
            <li>Automated AWS infrastructure with Terraform and Kubernetes (EKS).</li>
            <li>Led CI/CD pipelines using Jenkins and GitHub Actions.</li>
            <li>Improved resilience using Resilience4J and ELK stack.</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#80ffff] mt-6">WalrieWay — Founder & Software Engineer</h3>
          <p className="text-[#a0b0c0] mb-2">May 2023 – Present</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Founded and led delivery of scalable web and mobile applications.</li>
            <li>Built portfolio, business, and e-commerce websites.</li>
            <li>Developed cross-platform apps using Ionic.</li>
            <li>Delivered 15+ client projects end-to-end.</li>
          </ul>
        </Section>

        {/* EDUCATION */}
        <Section title="Education" icon={GraduationCap} sectionRef={educationRef}>
          <p className="font-semibold text-[#80ffff]">
            M.Sc. Information Systems with Computing (First Class Honours – 1:1)
          </p>
          <p className="text-[#a0b0c0] mb-3">Dublin Business School — 2023–2024</p>

          <p className="font-semibold text-[#80ffff] mt-4">
            Bachelor of Engineering in Electronics & Communication (First Class Honours – 1:1)
          </p>
          <p className="text-[#a0b0c0]">2016–2020</p>
        </Section>

        {/* CERTIFICATIONS */}
        <Section title="Certifications" icon={Award} sectionRef={certificationsRef}>
          <ul className="list-disc list-inside space-y-1">
            <li>AWS Certified Developer – Associate (Course Completion)</li>
            <li>Serverless Foundations — AWS Educate</li>
            <li>Cloud 101 — AWS Educate</li>
            <li>Agile Software Development — Coursera</li>
            <li>Java Foundation — Oracle</li>
          </ul>
        </Section>

        {/* PROJECTS */}
        <Section title="Projects" icon={Folder} sectionRef={projectsRef}>
          <ul className="list-disc list-inside space-y-1">
            <li>Cloud-Based Risk Evaluation System (AWS, Java, Kubernetes, Kafka)</li>
            <li>Hotel Booking Platform (React + Spring Boot)</li>
            <li>Real-Time Social Media App (Ionic + Firebase)</li>
            <li>Property Listing Platform (Flask + PostgreSQL)</li>
          </ul>
        </Section>

        {/* ACHIEVEMENTS */}
        <Section title="Achievements" icon={Award} sectionRef={achievementsRef}>
          <ul className="list-disc list-inside space-y-1">
            <li>Promoted to Senior Software Engineer within 2 years at Capgemini</li>
            <li>1-Star Performer Award for backend delivery excellence</li>
          </ul>
        </Section>

        <footer className="text-center text-[#a0b0c0] mt-12 pb-8">
          © 2024 Naveen Kumar Manivannan
        </footer>
      </div>
    </div>
  );
}

export default App;
