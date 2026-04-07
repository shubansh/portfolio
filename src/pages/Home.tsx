import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Videos from '../components/Videos';
import Resume from '../components/Resume';
import { supabase } from '../lib/supabase';

const Home = () => {
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        // Fetch Profile
        const { data: profileData } = await supabase.from('profile').select('*').single();
        if (profileData) {
          setProfile(profileData);
        } else {
          // Fallback if not setup
          setProfile({
            name: "Shubhanshu Bilgaiyan",
            roles: ["Developer", "Video Editor", "Gamer", "Streamer"],
            bio: "Passionate about building games, developing web apps, and creating engaging content.",
            resume_url: null
          });
        }

        // Fetch Projects
        const { data: projData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (projData) setProjects(projData);

        // Fetch Videos
        const { data: vidData } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
        if (vidData) setVideos(vidData);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  return (
    <div className="w-full">
      <Hero profile={profile} loading={loading} />
      <Skills />
      
      {/* Dynamic Rule: Projects/videos ONLY show if added via admin */}
      {!loading && projects.length > 0 && <Projects items={projects} />}
      {!loading && videos.length > 0 && <Videos items={videos} />}
      
      {/* Dynamic Rule: Resume button ONLY show if uploaded */}
      {!loading && profile?.resume_url && <Resume resumeUrl={profile.resume_url} />}
    </div>
  );
};

export default Home;
