import React, { useState, useEffect } from "react";
import {
  Pencil,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Sparkles,
  Globe,
  MessageSquare,
  Video,
  Play,
} from "lucide-react";
import SketchWidget from "../ui/sketchWidget";
import { Square, Circle, Type, Eraser, Undo, Redo } from "lucide-react";

const WhiteboardLanding = () => {
  const [activeTool, setActiveTool] = useState("pencil");
  const [cursors, setCursors] = useState([
    { id: 1, x: 30, y: 40, name: "Sarah", color: "#8B5CF6" },
    { id: 2, x: 60, y: 25, name: "Alex", color: "#EC4899" },
    { id: 3, x: 45, y: 60, name: "Mike", color: "#10B981" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursors((prev) =>
        prev.map((cursor) => ({
          ...cursor,
          x: Math.max(10, Math.min(90, cursor.x + (Math.random() - 0.5) * 8)),
          y: Math.max(10, Math.min(90, cursor.y + (Math.random() - 0.5) * 8)),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const tools = [
    { icon: Pencil, name: "pencil", label: "Draw" },
    { icon: Square, name: "square", label: "Rectangle" },
    { icon: Circle, name: "circle", label: "Circle" },
    { icon: Type, name: "text", label: "Text" },
    { icon: Eraser, name: "eraser", label: "Eraser" },
  ];

  const [activeDemo, setActiveDemo] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Real-time Collaboration",
      desc: "Work together seamlessly with instant updates",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      desc: "Bank-grade encryption for your data",
    },
    {
      icon: Globe,
      title: "Work From Anywhere",
      desc: "Access your boards from any device",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative mt-20 z-10 pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Collaborate in
            <br />
            Real-Time
          </h1>

          <p className="text-xl md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The most intuitive whiteboard for remote teams. Draw, brainstorm,
            and create together, no matter where you are.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="/auth/sign-up">
              <button className="group px-6 py-3  bg-blue-400  rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/10 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
            <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-lg font-semibold hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Hero Visual */}
          <div className="relative max-w-5xl mx-auto mt-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />

            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              {/* Canvas Area */}
              <div className="lg:col-span-10">
                <div className="relative h-96 w-full bg-white rounded-2xl shadow-2xl aspect-video overflow-hidden">
                  <div className="absolute top-4 left-4 flex gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg"
                      />
                    ))}
                  </div>
                  {/* Grid Pattern */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #ddd 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Sample Drawing Elements */}
                  <svg className="absolute inset-0 w-full h-full">
                    {/* Animated Path */}
                    <path
                      d="M 100 150 Q 200 100 300 150 T 500 150"
                      stroke="#8B5CF6"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />

                    {/* Rectangle */}
                    <rect
                      x="150"
                      y="220"
                      width="120"
                      height="80"
                      stroke="#EC4899"
                      strokeWidth="3"
                      fill="none"
                      rx="8"
                      className="opacity-80"
                    />

                    {/* Circle */}
                    <circle
                      cx="450"
                      cy="260"
                      r="50"
                      stroke="#10B981"
                      strokeWidth="3"
                      fill="none"
                      className="opacity-80"
                    />

                    {/* Curved line */}
                    <path
                      d="M 350 100 C 400 80, 420 120, 450 100"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Animated Cursors */}
                  {cursors.map((cursor) => (
                    <div
                      key={cursor.id}
                      className="absolute transition-all duration-2000 ease-in-out"
                      style={{
                        left: `${cursor.x}%`,
                        top: `${cursor.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="drop-shadow-lg"
                      >
                        <path
                          d="M5 3L19 12L12 13L8 20L5 3Z"
                          fill={cursor.color}
                          stroke="white"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <div
                        className="absolute top-6 left-6 px-2 py-1 rounded-md text-xs font-medium text-white whitespace-nowrap shadow-lg"
                        style={{ backgroundColor: cursor.color }}
                      >
                        {cursor.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 py-24 px-6 bg-white/5 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-300">
              Powerful features for seamless collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
              >
                <div className="w-14 h-14 bg-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-6 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold">CollabBoard</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Blog
            </a>
          </div>
          <div className="text-sm text-slate-400">
            © 2025 CollabBoard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WhiteboardLanding;
