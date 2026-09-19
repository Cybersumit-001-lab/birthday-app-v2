import Link from "next/link";
import { Globe, MapPin, Phone, Mail, Heart, ChevronRight } from "lucide-react";

function ITOriginLogo() {
  return (
    <div className="inline-flex items-center gap-1 font-extrabold tracking-wider">
      <span className="text-white text-xl tracking-tighter">IT</span>
      <div className="relative w-6 h-6 rounded-full bg-gradient-to-tr from-rose-600 via-red-600 to-red-500 flex items-center justify-center p-0.5 shadow-lg shadow-red-600/40">
        <Globe className="w-full h-full text-white stroke-[2.2]" />
      </div>
      <span className="text-white text-xl tracking-tighter">RIGIN</span>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-[#04060a] pt-12 pb-8">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800/80 text-sm">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <ITOriginLogo />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Internal employee birthday celebration and recognition platform for the ITOrigin team.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span>8/14, Sahid Nagar, Wing-A, Kolkata - 700078</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span>+91-7439490434</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <a href="mailto:connect@itorigin.com" className="hover:text-red-400 transition">
                  connect@itorigin.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {[
                { href: "/", label: "Dashboard & Overview" },
                { href: "/directory", label: "Company Directory" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-red-400 transition flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-red-400 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Credits */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Credits &amp; Acknowledgements
            </h4>
            <div className="p-4 rounded-2xl bg-[#0a0e17] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-red-400 text-xs font-semibold">
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                <span>Built with love by ITOrigin</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Created &amp; developed by{" "}
                <span className="font-[family-name:var(--font-cursive)] text-lg font-bold bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 bg-clip-text text-transparent tracking-wide inline-block px-1">
                  Sumit Kumar Ram
                </span>{" "}
                &amp; the <strong className="text-slate-300">ITOrigin Team</strong> to celebrate every team member&apos;s special milestone.
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Next.js", "TypeScript", "Nodemailer", "Tailwind CSS"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-300 border border-red-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} ITOrigin. Crafted by{" "}
            <span className="font-[family-name:var(--font-cursive)] text-sm font-bold text-red-400 tracking-wide">
              Sumit Kumar Ram
            </span>
            . All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Automated Birthday Mailer Active</span>
            </span>
            <span>•</span>
            <span>Birthday Hub v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
