import React, { useEffect, useRef, useState } from 'react';
// import './App.css'; // Removed this line as styling is handled by Tailwind
// Importing icons from lucide-react
import { ChevronDown, Linkedin, Github, Mail, User, Code, Briefcase, GraduationCap, Award, Folder, Phone } from 'lucide-react'; // Added Phone icon

// GalaxyBackground Component with Spiderweb Effect
const GalaxyBackground = () => {
  const canvasRef = useRef(null);
  // Use a ref for mouse position to avoid re-rendering the component on every mouse move
  const mousePosRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef([]); // Using ref to store points

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size to fill the window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Define 4 distinct colors for the particles (Galaxy theme)
    const particleColors = ['#e0e0e0', '#a0a0ff', '#800080', '#ff6347']; // White, Light Blue, Purple, Tomato (subtle red)

    // Generate random points (stars) with initial position, velocity, size, and color
    const numPoints = 350; // Increased number of points for a denser field
    const particleSizes = [1, 1.5, 2]; // Three distinct small sizes
    const generatePoints = () => {
      pointsRef.current = [];
      for (let i = 0; i < numPoints; i++) {
        pointsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          // Slow, irregular velocity
          vx: (Math.random() - 0.5) * 0.12, // Particle speed
          vy: (Math.random() - 0.5) * 0.12, // Particle speed
          radius: particleSizes[Math.floor(Math.random() * particleSizes.length)], // Assign one of the three sizes
          alpha: Math.random() * 0.7 + 0.3, // Varying brightness
          color: particleColors[Math.floor(Math.random() * particleColors.length)], // Assign a random color
        });
      }
    };

    generatePoints(); // Generate points initially

    // Handle mouse movement
    const handleMouseMove = (event) => {
      // Update mouse position relative to the canvas using a ref
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generatePoints(); // Regenerate points on resize
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Drawing the background and spiderweb
    const draw = () => {
      // Draw Background (Deeper space black/blue)
      ctx.fillStyle = '#05051a'; // Dark blue-black
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles (dots)
      pointsRef.current.forEach(point => {
        // Update position based on velocity - independent of mouse
        point.x += point.vx;
        point.y += point.vy;

        // Wrap around if particles go off-screen
        if (point.x < 0) point.x = canvas.width;
        if (point.x > canvas.width) point.x = 0;
        if (point.y < 0) point.y = canvas.height;
        if (point.y > canvas.height) point.y = 0;

        // Draw particle with its assigned color and varying brightness
        ctx.fillStyle = point.color;
        ctx.globalAlpha = point.alpha; // Apply varying brightness
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1; // Reset alpha

      // Draw Spiderweb effect near mouse
      const mouseProximityThreshold = 200; // Distance threshold for a larger web area around mouse
      const pointProximityThreshold = 110; // Distance threshold for connecting particles to each other
      const currentMousePos = mousePosRef.current; // Get the latest mouse position from the ref

      pointsRef.current.forEach(point => {
         // Check if the current point is within the mouse proximity
         const distanceToMouse = Math.sqrt(
           Math.pow(currentMousePos.x - point.x, 2) + Math.pow(currentMousePos.y - point.y, 2)
         );

         if (distanceToMouse < mouseProximityThreshold) {
           // Draw lines from this point to other nearby points that are also within mouse proximity
           pointsRef.current.forEach(otherPoint => {
             if (point !== otherPoint) {
               const distanceBetweenPoints = Math.sqrt(
                 Math.pow(point.x - otherPoint.x, 2) + Math.pow(point.y - otherPoint.y, 2)
               );

               const distanceToMouseOther = Math.sqrt(
                 Math.pow(currentMousePos.x - otherPoint.x, 2) + Math.pow(currentMousePos.y - otherPoint.y, 2)
               );

               // Connect if both points are near the mouse AND near each other
               if (distanceBetweenPoints < pointProximityThreshold && distanceToMouseOther < mouseProximityThreshold) {
                 // Calculate line opacity based on distance to the mouse (fades out further from mouse)
                 const lineOpacity = 1 - (distanceToMouse / mouseProximityThreshold);
                 // Subtle blue lines with transparency (CornflowerBlue)
                 ctx.strokeStyle = `rgba(100, 149, 237, ${lineOpacity * 0.5})`;
                 ctx.lineWidth = 0.8; // Thinner lines

                 ctx.beginPath();
                 ctx.moveTo(point.x, point.y);
                 ctx.lineTo(otherPoint.x, otherPoint.y);
                 ctx.stroke();
               }
             }
           });
         }
      });


      requestAnimationFrame(draw); // Continue the animation loop
    };

    draw(); // Start the drawing loop

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      // No need to cancel animation frame if draw calls requestAnimationFrame
    };
  }, []); // Empty dependency array - effect runs only once on mount

  return <canvas ref={canvasRef} className="fixed top-0 left-0 right-0 bottom-0 z-0"></canvas>;
};

// Content Section Component - now accepts an optional icon prop and a ref
const Section = ({ title, children, icon: IconComponent, sectionRef }) => (
  // Increased background opacity and added subtle border for glass effect
  // Added backdrop-filter for the blur effect
  <section
    ref={sectionRef} // Assign the ref to the section
    className="mb-12 p-6 rounded-lg relative z-10"
    // Updated background color and border for a more integrated look
    style={{ backdropFilter: 'blur(1px)', backgroundColor: 'rgba(15, 15, 40, 0.7)', border: '1px solid rgba(160, 160, 255, 0.3)' }} // Darker blue-black background, subtle light blue border
  >
    {/* Section title color - changed to light cyan */}
    <h2 className="text-2xl font-bold text-[#80ffff] mb-4 border-b-2 border-[#60c0c0] pb-2 flex items-center"> {/* Changed border color */}
      {IconComponent && <IconComponent size={28} className="mr-3 text-[#80ffff]" />} {/* Changed icon color */}
      {title}
    </h2>
    {/* Content text color is white */}
    <div className="text-white">{children}</div> {/* Changed to white for body text */}
  </section>
);

// App Component (Main Portfolio Layout)
function App() {
  // Create refs for each section
  const landingRef = useRef(null); // Ref for the landing page
  const summaryRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const certificationsRef = useRef(null);
  const projectsRef = useRef(null);
  const achievementsRef = useRef(null); // Added ref for Achievements

  const navbarOffset = 70;
  // State to control navbar visibility
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  // Function to handle smooth scrolling
  const scrollToSection = (ref) => {
    if (ref.current) {

      const targetPosition = ref.current.getBoundingClientRect().top + window.scrollY - navbarOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });;
    }
  };

  // Effect to handle scroll event and show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      if (landingRef.current) {
        const landingPageBottom = landingRef.current.getBoundingClientRect().bottom;
        // Show navbar if scrolled past the bottom of the landing page
        if (landingPageBottom <= 0) {
          setIsNavbarVisible(true);
        } else {
          setIsNavbarVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs only once on mount

    // Color Scheme:
    // Background: #05051a (Dark Blue-Black)
    // Particle Colors: #e0e0e0 (White), #a0a0ff (Light Blue), #800080 (Purple), #ff6347 (Tomato)
    // Spiderweb Lines: #6495ed (CornflowerBlue)
    // Section Border: rgba(160, 160, 255, 0.3) (Subtle Light Blue)
    // Text Colors (3 colors - Option 1: Cool & Crisp):
    // 1. #80ffff (Light Cyan) - Titles (Name, Section Headings), Navbar Links, Contact Info, Scroll Indicator
    // 2. #ffffff (White) - Main Body Text (Paragraphs, List Items)
    // 3. #a0b0c0 (Muted Blue-Gray) - Accents (Tagline, Dates, Footer)

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden"> {/* Changed base text color to white */}
      <GalaxyBackground /> {/* Changed to GalaxyBackground */}

      {/* Navigation Bar - Conditionally rendered */}
      {isNavbarVisible && (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#60c0c0] bg-gray-900 bg-opacity-100 shadow-lg transition-all duration-300 ease-in-out hidden md:flex">
          {/* Reduced font size and increased spacing, changed text color to light cyan */}
          <div className="container mx-auto px-4 py-4 flex justify-center space-x-14 text-[#80ffff] text-l md:text-s">
            <button onClick={() => scrollToSection(skillsRef)} className="hover:text-[#60c0c0] focus:outline-none">Skills</button> {/* Changed hover color */}
            <button onClick={() => scrollToSection(experienceRef)} className="hover:text-[#60c0c0] focus:outline-none">Experience</button> {/* Changed hover color */}
            <button onClick={() => scrollToSection(educationRef)} className="hover:text-[#60c0c0] focus:outline-none">Education</button> {/* Changed hover color */}
            <button onClick={() => scrollToSection(certificationsRef)} className="hover:text-[#60c0c0] focus:outline-none">Certifications</button> {/* Changed hover color */}
            <button onClick={() => scrollToSection(projectsRef)} className="hover:text-[#60c0c0] focus:outline-none">Projects</button> {/* Changed hover color */}
            <button onClick={() => scrollToSection(achievementsRef)} className="hover:text-[#60c0c0] focus:outline-none">Achievements</button> {/* Changed hover color */}
          </div>
        </nav>
      )}

      {/* Landing Page Section */}
      {/* Added ref for scroll detection */}
      <section ref={landingRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-16">
        {/* Reduced font size for the name, changed color to light cyan */}
        <h1 className="text-3xl md:text-5xl font-bold text-[#80ffff] mb-3">Naveen Kumar Manivannan</h1> {/* Changed color */}
        {/* Changed Software Engineer text color to muted blue-gray */}
        <p className="text-lg md:text-3xl text-[#a0b0c0] mb-4">Software Engineer</p> {/* Changed to muted blue-gray */}
        {/* Changed tagline text color to muted blue-gray */}
        <p className="text-md md:text-lg text-[#a0b0c0] mb-6 max-w-2xl">Proficient software engineer, focused on crafting efficient and impactful software solutions.</p> {/* Changed to muted blue-gray */}
        <div className="flex flex-col items-center space-y-4 text-[#80ffff] text-lg mb-10 md:flex-row md:space-y-0 md:space-x-6"> {/* Changed contact info color to light cyan */}
          {/* Email with Icon */}
          <a href="mailto:naveennv2303@gmail.com" className="hover:underline flex items-center">
             <Mail size={24} className="mr-2" /> naveennv2303@gmail.com
          </a>
          {/* Phone number with Icon - text-green-400 already applied by parent div */}
          <span className="flex items-center">
             <Phone size={24} className="mr-2" /> +353 894654932
          </span>
          {/* LinkedIn with Icon */}
          <a href="https://www.linkedin.com/in/naveennv" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
             <Linkedin size={24} className="mr-2" /> LinkedIn
          </a>
          {/* GitHub with Icon */}
          <a href="https://github.com/NaveenNV2303" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
             <Github size={24} className="mr-2" /> GitHub
          </a>
        </div>
         {/* Scroll Down Indicator - changed color to light cyan */}
         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown size={40} className="text-[#80ffff]" /> {/* Changed color */}
         </div>
      </section>


      {/* Main Content Container (appears below landing page) */}
      {/* Added min-h-screen and explicitly set text-white */}
      <div className="container mx-auto px-4 py-8 relative z-10 pt-16 min-h-screen text-white"> {/* Added padding top to account for potential navbar */}

        {/* Professional Summary with Icon and Ref */}
        <Section title="Professional Summary" icon={User} sectionRef={summaryRef}>
          {/* Content text color is white */}
          <p>Skilled Software Engineer with 2 years of experience designing, developing, and deploying software solutions in Agile
environments. Proficient in Java, Spring Boot, Angular, SQL, Python, and AWS (certified in cloud fundamentals and
serverless architecture). Experienced in backend technologies like Spring Boot and Oracle SQL, and in CI/CD pipeline
implementation using Jenkins. Improved operational efficiency by 15% through business logic development for credit card
applications, fraud detection, and system enhancements. During my Master’s thesis at Dublin Business School, I
developed and deployed a weather forecasting model on Azure using machine learning, predicting future air quality (AQI)
from historical data. This demonstrated my ability to apply data-driven solutions, strengthening my expertise in cloud and
machine learning.</p>
        </Section>

        {/* Technical Skills with Icon and Ref */}
        <Section title="Technical Skills" icon={Code} sectionRef={skillsRef}>
           {/* Content text color is white */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h3 className="text-xl font-semibold text-[#80ffff] mb-2">Programming Languages:</h3> {/* Changed color */}
              <p>Java, Python, SQL, JavaScript</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#80ffff] mb-2">Frameworks:</h3> {/* Changed color */}
              <p>Spring Boot, Flask, Angular, ReactJS, jQuery</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#80ffff] mb-2">Tools:</h3> {/* Changed color */}
              <p>Git, Tableau, ETL, WinSCP, PuTTY</p>
            </div>
            <div>
              <h3 className="xl font-semibold text-[#80ffff] mb-2">Methodologies:</h3> {/* Changed color */}
              <p>Agile, CI/CD, Test-Driven Development</p>
            </div>
             <div>
              <h3 className="xl font-semibold text-[#80ffff] mb-2">Testing Tools:</h3> {/* Changed color */}
              <p>Postman, Selenium (basic familiarity)</p>
            </div>
            <div>
              <h3 className="xl font-semibold text-[#80ffff] mb-2">DevOps:</h3> {/* Changed color */}
              <p>Docker, Jenkins</p>
            </div>
            <div>
              <h3 className="xl font-semibold text-[#80ffff] mb-2">Cloud Services:</h3> {/* Changed color */}
              <p>Microsoft Azure, AWS, Vercel</p>
            </div>
            <div>
              <h3 className="xl font-semibold text-[#80ffff] mb-2">Databases:</h3> {/* Changed color */}
              <p>Oracle, MySQL, PostgreSQL, FireBase</p>
            </div>
            <div>
              <h3 className="xl font-semibold text-[#80ffff] mb-2">API Development:</h3> {/* Changed color */}
              <p>RESTful API, SOAP API, GraphQL</p>
            </div>
            <div>
              <h3 className="xl font-semibold text-[#80ffff] mb-2">Web Technologies:</h3> {/* Changed color */}
              <p>HTML, CSS, jQuery</p>
            </div>
          </div>
        </Section>

        {/* Experience with Icon and Ref */}
        <Section title="Experience" icon={Briefcase} sectionRef={experienceRef}>
           {/* Content text color is white */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-[#80ffff]">Capgemini | Software Engineer</h3> {/* Changed color */}
            <p className="text-[#a0b0c0]">Apr 2021 - Apr 2023</p> {/* Changed to muted blue-gray */}
            <ul className="list-disc list-inside ml-4 mt-2 text-white"> {/* Changed list item color to white */}
              <li>Developed and implemented business logic for credit card application processing, fraud detection, and feature
              development for Synchrony, a leading U.S. banking company, supporting over 5 million transactions per day.</li>
              <li>Integrated Resilience4J into the application, reducing system downtime by 15% during high-load situations, which
              significantly improved overall system efficiency and enhanced user experience.</li>
              <li>Worked in an Agile environment, where tasks were assigned, and progress was updated on the dashboard
              based on completed work, ensuring efficient collaboration and meeting delivery deadlines.</li>
              <li>Designed and maintained CI/CD pipelines using Jenkins, automating over 200+ deployments per month,
              reducing deployment time by 30% and improving code quality.</li>
              <li>Led the implementation of automated business logic validations, streamlining the approval process and reducing
              manual errors by 20%, which resulted in faster processing times and more accurate results.</li>
              <li>Worked with ReactJS and Angular for front-end development, enhancing the user interface and ensuring
              seamless integration with back-end services, improving user satisfaction by 25% as measured by user feedback.</li>
              <li>Conducted Postman API testing and Selenium automated UI testing, ensuring 99.9% uptime by identifying and
              resolving critical bugs prior to production deployment.</li>
              <li>Troubleshot and deployed applications on production and development servers using PuTTY and WinSCP,
              reducing server downtimes by 10% through proactive management and quick resolution of issues.</li>
              <li>Coordinated with onshore teams to implement system enhancements, maintain project timelines, and ensure the
              successful delivery of client projects.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#80ffff]">OX Software | Intern</h3> {/* Changed color */}
            <p className="text-[#a0b0c0]">Jan 2021 - Mar 2021</p> {/* Changed to muted blue-gray */}
            <ul className="list-disc list-inside ml-4 mt-2 text-white"> {/* Changed list item color to white */}
              <li>Enhanced eCommerce platforms by customizing themes and implementing client-specific features.</li>
              <li>Developed and tested functionality improvements using Magento for seamless platform deployment.</li>
              <li>Assisted in the design and implementation of user-centric features to improve platform usability.</li>
              </ul>
            </div>
          </Section>

          {/* Education with Icon and Ref */}
          <Section title="Education" icon={GraduationCap} sectionRef={educationRef}>
             {/* Content text color is white */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#80ffff]">Dublin Business School | M.Sc. in Information Systems with Computing</h3> {/* Changed color */}
              <p className="text-[#a0b0c0]">2023 - 2024 | GPA: 7.30</p> {/* Changed to muted blue-gray */}
              <ul className="list-disc list-inside ml-4 mt-2 text-white"> {/* Changed list item color to white */}
                <li>Completed advanced coursework in machine learning, data analytics, and cloud computing.</li>
                <li>Developed a real-time weather forecasting model and deployed it in Azure as part of the thesis.</li>
                <li>Developed a mobile web application using lonic Framework and Firebase DB for posting, sharing thoughts, and real-time interactions (likes, comments), ensuring scalability and live updates.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#80ffff]">Global Institute of Engineering and Technology | Bachelor of Engineering in Electronics and Communication Engineering</h3> {/* Changed color */}
              <p className="text-[#a0b0c0]">2016 - 2020 | GPA: 7.10</p> {/* Changed to muted blue-gray */}
              <ul className="list-disc list-inside ml-4 mt-2 text-white"> {/* Changed list item color to white */}
                <li>Emphasized foundational engineering principles and software development practices, building a strong base for technical and analytical problem-solving skills.</li>
                <li>Gained proficiency in OOP concepts and C++ programming, strengthening core software development abilities.</li>
              </ul>
            </div>
          </Section>

           {/* Certifications with Icon and Ref */}
          <Section title="Certifications" icon={Award} sectionRef={certificationsRef}>
             {/* Content text color is white */}
            <ul className="list-disc list-inside ml-4 mt-2 text-white"> {/* Changed list item color to white */}
              <li>Introduction to Cloud 101 - Amazon AWS Educate | Issued May 2025</li>
              <li>Getting Started with Serverless - Amazon AWS Educate | Issued May 2025</li>
              <li>AWS Certified Developer (In Progress) - Amazon Web Services | Expected [Jun 2025]</li>
              <li>Agile Software Development - University of Minnesota | LinkedIn | Issued Jul 2021</li>
              <li>Core Java - QSpiders - Software Testing Training Institute, Chennai, India | Issued Feb 2021</li>
              <li>Manual Testing - QSpiders - Software Testing Training Institute, Chennai, India | Issued Feb 2021</li>
            </ul>
          </Section>


          {/* Projects with Icon and Ref */}
          <Section title="Projects" icon={Folder} sectionRef={projectsRef}>
             {/* Content text color is white */}
             <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#80ffff]">E-Commerce Platform Customization</h3> {/* Changed color */}
               <ul className="list-disc list-inside ml-4 mt-2 text-white"> {/* Changed list item color to white */}
                <li>Designed a database model for a shoe company, focusing on data structure and system optimization.</li>
                <li>Utilized ETL processes (Extract, Transform, Load) with SQL and Oracle to manage and process large volumes of data for efficient database handling.</li>
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#80ffff]">Real-Time Social Media Platform</h3> {/* Changed color */}
               <ul className="list-disc list-inside ml-4 mt-2 text-white"> {/* Changed list item color to white */}
                <li>Developed a mobile web application for posting and sharing thoughts with real-time like and comment features.</li>
                <li>Built using Ionic Framework for cross-platform mobile development and Firebase for real-time data synchronization, ensuring scalability and live updates.</li>
                </ul>
              </div>
               <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#80ffff]">Banking Application Development</h3> {/* Changed color */}
                 <ul className="list-disc list-inside ml-4 mt-2 text-white"> {/* Changed list item color to white */}
                  <li>Developed business logic for credit card applications, fraud detection, and feature development for Synchrony, a leading banking company in the USA.</li>
                  <li>Utilized Spring Boot and Oracle SQL for backend development, ensuring system reliability and improved user experience.</li>
                </ul>
              </div>
               <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#80ffff]">Real-Time Weather Forecasting</h3> {/* Changed color */}
                 <ul className="list-disc list-inside ml-4 mt-2 text-white"> {/* Changed list item color to white */}
                  <li>Developed an LSTM model for predicting AQI and deployed the model on the Azure cloud platform.</li>
                  <li>The model predicts future AQI levels based on user-selected date inputs, using historical data and machine learning algorithms for accurate forecasts.</li>
                </ul>
              </div>
               <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#80ffff]">Property Listing Web Application</h3> {/* Changed color */}
                 <ul className="list-disc list-inside ml-4 mt-2 text-white"> {/* Changed list item color to white */}
                  <li>Developed a web application using Flask for browsing and managing property listings and related services.</li>
                  <li>Implemented HTML, CSS, and JavaScript to create user-friendly features, enhancing property search and management experiences.</li>
                </ul>
              </div>
            </Section>


            {/* Achievements with Icon and Ref */}
            <Section title="Achievements" icon={Award} sectionRef={achievementsRef}>
               {/* Content text color is white */}
              <ul className="list-disc list-inside ml-4 mt-2 text-white"> {/* Changed list item color to white */}
                <li>1-Star Rating at Capgemini: Honored with this recognition, given to one team member, for consistent performance and meaningful contributions to project success.</li>
                <li>Promotion to Senior Software Engineer: Progressed from Software Engineer to Senior Software Engineer within 2 years at Capgemini, reflecting growth and a commitment to contributing effectively to the team.</li>
                <li>Improved Application Resilience: Contributed to enhancing application stability by implementing Resilience4J, which helped improve system efficiency and minimize delays.</li>
              </ul>
            </Section>


            {/* Footer */}
            {/* Changed footer text color to muted blue-gray */}
            <footer className="text-center mt-12 text-[#a0b0c0] relative z-10 pb-8">
              <p>&copy; 2024 Naveen Kumar Manivannan. All rights reserved.</p>
            </footer>

          </div>
        </div>
      );
    }

    export default App;
    