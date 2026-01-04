import { Link } from "react-router-dom";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck,
  ChevronRight 
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-900 border-t border-gray-800 text-amber-50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-white to-blue-600 bg-clip-text text-transparent drop-shadow-lg tracking-tighter">
              MY TEAM
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sri Lanka's premier sports identity platform. Connecting players and organizers in one digital ecosystem.
            </p>
            <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck size={18} />
              Verified Sports Network
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-6 pb-2 border-b border-gray-800 w-fit">
              Navigation
            </h4>
            <ul className="space-y-3">
              {["Home", "Event", "Live-Scores", "News", "Team"].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase()}`} 
                    className="group flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium"
                  >
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-6 pb-2 border-b border-gray-800 w-fit">
              Support
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <div className="p-2 bg-gray-800 rounded-lg text-blue-500">
                  <Mail size={16} />
                </div>
                support@myteam.lk
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <div className="p-2 bg-gray-800 rounded-lg text-blue-500">
                  <Phone size={16} />
                </div>
                +94 112 345 678
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <div className="p-2 bg-gray-800 rounded-lg text-blue-500">
                  <MapPin size={16} />
                </div>
                Colombo, Sri Lanka
              </li>
            </ul>
          </div>

          {/* Connect & Community */}
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-6 pb-2 border-b border-gray-800 w-fit">
              Connect
            </h4>
            <div className="flex gap-4 mb-6">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="p-3 bg-gray-800 rounded-xl text-gray-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-loose">
              Join our community to stay updated on upcoming tournaments.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <p>© {currentYear} MY TEAM - Official Identity Platform</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Powered By</span>
            <span className="text-xs font-bold text-gray-400">Sri Lanka Sports Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
}