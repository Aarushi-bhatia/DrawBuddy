import { Link as ScrollLink } from "react-scroll";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import Video from "../components/videoComponent";
import {
  ArrowRight,
  Pen,
  Share2,
  Users2,
  Layers,
  Cloud,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
// import { ThemeToggle } from "./components/theme-toggle";
// import HeroBackground from "../components/hero-background";
import "../../src/index.css";
import WhiteboardLanding from "./HeroPage";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
  NavItems,
} from "../ui/navbar";

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollY, setScrollY] = useState(0);

  // Refs for sections
  const heroRef = useRef < HTMLElement > null;
  const videoRef = useRef < HTMLElement > null;
  const featuresRef = useRef < HTMLElement > null;
  const ctaRef = useRef < HTMLElement > null;

  // Handle scroll to determine active section and scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);

      const viewPosition = scrollPosition + window.innerHeight / 3;

      if (
        heroRef.current &&
        viewPosition < heroRef.current.offsetTop + heroRef.current.offsetHeight
      ) {
        setActiveSection("hero");
      } else if (
        videoRef.current &&
        viewPosition <
          videoRef.current.offsetTop + videoRef.current.offsetHeight
      ) {
        setActiveSection("video");
      } else if (
        featuresRef.current &&
        viewPosition <
          featuresRef.current.offsetTop + featuresRef.current.offsetHeight
      ) {
        setActiveSection("features");
      } else if (ctaRef.current) {
        setActiveSection("cta");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initial animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  //  const navItems = [
  //     { name: "Home", href: "home" },
  //     { name: "Demo", href: "video" },
  //     { name: "Features", href: "features" },
  //     { name: "About", href: "about" },
  //   ];

  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* <div className="min-h-screen bg-background overflow-hidden"> */}
        <Navbar>
          {/* Desktop Navigation */}
          <NavBody>
            <NavbarLogo />
            <NavItems items={navItems} />
            <div className="flex items-center gap-4">
              <a href = "/auth/sign-up"><NavbarButton variant="secondary">Sign Up</NavbarButton></a>
             <a href = "/auth/sign-in"> <NavbarButton variant="primary">Sign In</NavbarButton></a>
            </div>
          </NavBody>

          {/* Mobile Navigation */}
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300"
                >
                  <span className="block">{item.name}</span>
                </a>
              ))}
              <div className="flex w-full flex-col gap-4">
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                >
                  Login
                </NavbarButton>
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                >
                  Book a call
                </NavbarButton>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
        <WhiteboardLanding />
      {/* </div> */}
    </>
  );
}

const features = [
  {
    title: "Real-time Collaboration",
    description:
      "Work together with your team in real-time, seeing changes instantly as they happen.",
    icon: <Users2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Intuitive Drawing Tools",
    description:
      "Easy-to-use tools for creating professional diagrams and sketches.",
    icon: <Pen className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Easy Sharing",
    description:
      "Share your work with a simple link or export in multiple formats.",
    icon: <Share2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Multiple Layers",
    description:
      "Organize your drawings with layers for complex diagrams and presentations.",
    icon: <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Cloud Storage",
    description:
      "Your drawings are automatically saved and synced across devices.",
    icon: <Cloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Smart Features",
    description: "AI-powered tools to help you create better diagrams faster.",
    icon: <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
  },
];

export default Home;
