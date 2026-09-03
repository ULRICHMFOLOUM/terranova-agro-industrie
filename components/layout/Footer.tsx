import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Leaf,
  Award,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-clay-950 text-sand-100 border-t border-clay-800 relative overflow-hidden">
      {/* Subtle background ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-terracotta-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-harvest-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner: Trust badges */}
      <div className="border-b border-clay-800/80 py-8 bg-clay-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-clay-800 border border-harvest-400/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-harvest-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sand-50 uppercase tracking-wider">Qualité Certifiée</h4>
                <p className="text-[11px] text-sand-400">Contrôle agronomique et sanitaire strict</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-clay-800 border border-terracotta-500/30 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-terracotta-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sand-50 uppercase tracking-wider">Origine Directe</h4>
                <p className="text-[11px] text-sand-400">De nos domaines à votre exploitation</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-clay-800 border border-sage-400/30 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-sage-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sand-50 uppercase tracking-wider">Paiement Sécurisé</h4>
                <p className="text-[11px] text-sand-400">Fapshi (OM / MTN MoMo) & Facture PDF</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-clay-800 border border-sand-400/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-sand-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sand-50 uppercase tracking-wider">Support Réactif</h4>
                <p className="text-[11px] text-sand-400">Équipe commerciale disponible 6j/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-clay-800 border border-harvest-400/40 flex items-center justify-center">
                <span className="font-serif font-bold text-harvest-400 text-base">T</span>
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-widest text-sand-50">TERRANOVA</span>
                <span className="block text-[10px] tracking-widest text-harvest-400 uppercase font-semibold">Agro-Industrie</span>
              </div>
            </div>

            <p className="text-xs text-sand-300 leading-relaxed max-w-sm">
              Entreprise agro-pastorale intégrée alliant la richesse de la terre aux standards de la précision industrielle. Vente directe de céréales d&apos;élite, semences certifiées, bétail sélectionné, produits laitiers et matériel agricole.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/237690000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-xs font-medium border border-[#25D366]/30 transition-colors"
              >
                <span>Commander sur WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 3: Familles de produits */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-sand-50 tracking-wider">Filières & Produits</h4>
            <ul className="space-y-2 text-xs text-sand-300">
              <li>
                <Link href="/catalogue?category=cereales-grains" className="hover:text-terracotta-400 transition-colors">
                  Céréales & Grains
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=elevage-betail" className="hover:text-terracotta-400 transition-colors">
                  Élevage & Bétail
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=produits-laitiers" className="hover:text-terracotta-400 transition-colors">
                  Produits Laitiers Fermiers
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=intrants-semences" className="hover:text-terracotta-400 transition-colors">
                  Intrants & Semences Bio
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=materiel-equipements" className="hover:text-terracotta-400 transition-colors">
                  Matériel & Équipements
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Liens utiles & Admin */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-sand-50 tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs text-sand-300">
              <li>
                <Link href="/catalogue" className="hover:text-terracotta-400 transition-colors">
                  Catalogue complet
                </Link>
              </li>
              <li>
                <Link href="/#valeurs" className="hover:text-terracotta-400 transition-colors">
                  Nos engagements & valeurs
                </Link>
              </li>
              <li>
                <Link href="/#tracabilite" className="hover:text-terracotta-400 transition-colors">
                  Traçabilité & Certifications
                </Link>
              </li>
              <li>
                <Link href="/compte" className="hover:text-terracotta-400 transition-colors">
                  Espace Client / Factures
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-harvest-400 transition-colors font-medium">
                  🔒 Espace Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Coordonnées de la firme */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-sand-50 tracking-wider">Siège & Domaines</h4>
            <div className="space-y-2.5 text-xs text-sand-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-terracotta-500 shrink-0 mt-0.5" />
                <span>Domaines Agricoles du Noun & Siège Administratif, Douala, Cameroun</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-harvest-400 shrink-0" />
                <span>+237 690 00 00 00 / 670 00 00 00</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sage-400 shrink-0" />
                <span>contact@terranova.agri</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-clay-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sand-400 gap-4">
          <p>© {new Date().getFullYear()} TERRANOVA AGRO-INDUSTRIE. Tous droits réservés.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>Plateforme PWA & E-Commerce Haute Précision</span>
            <span>WCAG AA Conforme</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
