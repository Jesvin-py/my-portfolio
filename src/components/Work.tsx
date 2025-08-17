import React, { useState, useEffect } from 'react';
import ImageCarousel from './ImageCarousel';

const Work: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('work');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const projects = [
    {
      icon: '🚁',
      title: 'AI-Powered Autonomous Drone',
      description: 'Advanced drone system with computer vision capabilities for autonomous navigation and real-time object detection using machine learning algorithms.',
      tech: ['Computer Vision', 'Machine Learning', 'ROS', 'Python', 'OpenCV'],
      link: '#',
      github: '#'
    },
    {
      title: 'AIDLINK Disaster Response Platform',
      description: 'Comprehensive disaster management system connecting victims, volunteers, and authorities with real-time coordination and resource allocation.',
      tech: ['Flutter', 'Firebase', 'Flask', 'Python', 'Real-time DB'],
      link: '#',
      github: '#',
      // AidLink app screenshots - you can replace these with your actual images
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
      ]
    },
    {
      icon: '🛡️',
      title: 'Smart Crime Management System',
      description: 'Intelligent crime reporting and management platform with data analytics and automated case tracking for law enforcement agencies.',
      tech: ['Flask', 'MySQL', 'HTML/CSS', 'JavaScript', 'Bootstrap'],
      link: '#',
      github: '#'
    }
  ];

  return (
    <section id="work" className="py-20 relative bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Work</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A showcase of my recent projects and innovations
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`group transition-all duration-1000 delay-${index * 200} ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Project Image/Icon */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 flex items-center justify-center overflow-hidden">
                  {/* Use ImageCarousel for AIDLINK project, icon for others */}
                  {project.title === 'AIDLINK Disaster Response Platform' && project.images ? (
                    <ImageCarousel images={project.images} interval={4000} />
                  ) : (
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
                      {project.icon}
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-blue-600/80 to-purple-600/80 flex items-center justify-center transition-all duration-300 ${
                    hoveredProject === index ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="flex gap-4">
                      <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                        View Live
                      </button>
                      <button className="px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300">
                        GitHub
                      </button>
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Project Links */}
                  <div className="flex gap-3">
                    <a 
                      href={project.link}
                      className="flex-1 text-center py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      View Project
                    </a>
                    <a 
                      href={project.github}
                      className="flex-1 text-center py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;

