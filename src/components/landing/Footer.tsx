import { Logo } from "@/components/Logo";
import { useNavigate } from "react-router";

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="border-t py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-sm text-muted-foreground">
              Your AI-powered career development assistant. Transform your career in 60 seconds.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📍 HQ: Dublin, Ireland</li>
              <li>🔐 Data secured with AES-256 encryption</li>
              <li>🛡️ GDPR compliant</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate("/pricing")} className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/career-intelligence")} className="text-muted-foreground hover:text-primary transition-colors">
                  Career Intelligence
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground border-t pt-8">
          <p>© 2025 Evoluskill. Built with ❤️ to help you grow.</p>
        </div>
      </div>
    </footer>
  );
}
