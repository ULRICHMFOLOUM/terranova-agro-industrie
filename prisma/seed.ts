import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage de l'initialisation de la base de données TERRANOVA...");

  // Nettoyage préalable
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.siteSetting.deleteMany({});

  // 1. Paramètres globaux du site
  await prisma.siteSetting.createMany({
    data: [
      { key: "FIRM_NAME", value: "TERRANOVA AGRO-INDUSTRIE" },
      { key: "FIRM_TAGLINE", value: "Excellence Agro-Pastorale & Précision Industrielle" },
      { key: "FIRM_PHONE", value: "+237 690 00 00 00" },
      { key: "FIRM_WHATSAPP", value: "237690000000" },
      { key: "FIRM_EMAIL", value: "contact@terranova.agri" },
      { key: "FIRM_LOCATION", value: "Complexe Agro-Industriel & Domaines du Noun, Cameroun" },
      { key: "CURRENCY", value: "FCFA" },
    ],
  });

  // 2. Utilisateurs : Administrateur et Client de test
  const adminPasswordHash = await bcrypt.hash("AdminTerra2026!", 10);
  const clientPasswordHash = await bcrypt.hash("ClientTerra2026!", 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@terranova.agri",
      passwordHash: adminPasswordHash,
      name: "Directeur Général TERRANOVA",
      phone: "+237 690 12 34 56",
      role: "ADMIN",
      city: "Douala",
      address: "Siège Administratif & Commercial, Bonanjo",
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      email: "client@terranova.agri",
      passwordHash: clientPasswordHash,
      name: "Coopérative Agro-Pastorale Unie",
      phone: "+237 670 98 76 54",
      role: "CLIENT",
      city: "Bafoussam",
      address: "Route de Foumbot, Secteur 4",
    },
  });

  console.log(`✅ Utilisateurs créés : Admin (${adminUser.email}), Client (${clientUser.email})`);

  // 3. Catégories dynamiques
  const catCereales = await prisma.category.create({
    data: {
      name: "Céréales & Grains",
      slug: "cereales-grains",
      description: "Maïs jaune de qualité supérieure, soja certifié non-OGM, sorgho blanc et riz de plaine rigoureusement calibrés pour meuneries, provenderies et grossistes.",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200&auto=format&fit=crop",
      order: 1,
      active: true,
    },
  });

  const catElevage = await prisma.category.create({
    data: {
      name: "Élevage & Bétail",
      slug: "elevage-betail",
      description: "Génisses et taureaux de races sélectionnées (Goudali, Charolais, métis laitiers), porcelets sevrés vigoureux et volailles fermières suivies par nos vétérinaires.",
      image: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1200&auto=format&fit=crop",
      order: 2,
      active: true,
    },
  });

  const catLaitiers = await prisma.category.create({
    data: {
      name: "Produits Laitiers & Dérivés",
      slug: "produits-laitiers",
      description: "Lait cru et pasteurisé de traite quotidienne, beurre fermier pur baratté et fromages artisanaux affinés au sein de nos ateliers de transformation.",
      image: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?q=80&w=1200&auto=format&fit=crop",
      order: 3,
      active: true,
    },
  });

  const catIntrants = await prisma.category.create({
    data: {
      name: "Intrants & Semences",
      slug: "intrants-semences",
      description: "Semences hybrides à haut taux de germination (98%+), engrais organiques compostés enrichis et solutions de fertilisation adaptées aux sols tropicaux.",
      image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?q=80&w=1200&auto=format&fit=crop",
      order: 4,
      active: true,
    },
  });

  const catMateriel = await prisma.category.create({
    data: {
      name: "Matériel & Équipements Agricoles",
      slug: "materiel-equipements",
      description: "Motoculteurs diesel tout-terrain, kits complets d'irrigation goutte-à-goutte, broyeurs-mélangeurs polyvalents et pulvérisateurs ergonomiques.",
      image: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?q=80&w=1200&auto=format&fit=crop",
      order: 5,
      active: true,
    },
  });

  console.log("✅ 5 Catégories dynamiques créées.");

  // 4. Produits riches et techniques
  const productsData = [
    // --- CÉRÉALES & GRAINS ---
    {
      name: "Maïs Jaune Grade A (Séchage Industriel)",
      slug: "mais-jaune-grade-a",
      categoryId: catCereales.id,
      shortDesc: "Grains de maïs dur nettoyés et séchés en silos thermo-régulés. Humidité < 13%.",
      description: "Notre maïs jaune Grade A est cultivé sur les plateaux fertiles du Noun selon un itinéraire technique rigoureux. Chaque récolte passe par notre complexe de triage densimétrique et de séchage industriel pour garantir un taux d'humidité optimal de 12,5%, une absence totale de moisissures et un taux de pureté de 99,2%. Idéal pour les fabricants d'aliments de volaille, les meuneries et les coopératives.",
      price: 18500,
      unit: "sac 50kg",
      stock: 450,
      sku: "CER-MAIS-50KG",
      featured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1000&auto=format&fit=crop"
      ]),
      specs: JSON.stringify({
        "Humidité": "12.5% max",
        "Pureté variétale": "99.2%",
        "Impuretés / Brisures": "< 1.5%",
        "Conditionnement": "Sac PP micro-perforé 50 kg",
        "Origine": "Domaines Agricoles du Noun"
      })
    },
    {
      name: "Soja Biologique Haute Protéine (Non-OGM)",
      slug: "soja-biologique-haute-proteine",
      categoryId: catCereales.id,
      shortDesc: "Graines de soja riches en matières protéiques (> 38%), idéales pour provenderies et tourteaux.",
      description: "Graines entières de soja jaune issues d'une agriculture sans pesticides de synthèse. Titrant un minimum de 38,5% de protéines brutes sur matière sèche, ce soja offre une digestibilité exemplaire pour la nutrition animale et la fabrication de tourteaux à haute valeur nutritive.",
      price: 24000,
      unit: "sac 50kg",
      stock: 320,
      sku: "CER-SOJ-50KG",
      featured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=1000&auto=format&fit=crop"
      ]),
      specs: JSON.stringify({
        "Teneur en protéines": "≥ 38.5%",
        "Teneur en huile": "≥ 19%",
        "Statut OGM": "Non-OGM Certifié",
        "Conditionnement": "Sac double épaisseur 50 kg"
      })
    },
    {
      name: "Sorgho Blanc Égrené Extra-Pur",
      slug: "sorgho-blanc-egrene-extra-pur",
      categoryId: catCereales.id,
      shortDesc: "Céréale rustique nettoyée, sans tannin, adaptée aux meuneries et brasseries artisanales.",
      description: "Sorgho blanc sans tannin sélectionné pour sa digestibilité et son rendement en mouture. Séché au soleil puis passé au séparateur à air pour éliminer toute poussière et brisure.",
      price: 16500,
      unit: "sac 50kg",
      stock: 180,
      sku: "CER-SRG-50KG",
      featured: false,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=1000&auto=format&fit=crop"
      ]),
      specs: JSON.stringify({
        "Humidité": "12.0%",
        "Taux de tannin": "0.0% (Non-tannique)",
        "Conditionnement": "Sac 50 kg"
      })
    },

    // --- ÉLEVAGE & BÉTAIL ---
    {
      name: "Génisse Goudali Sélectionnée (Gestation Confirmée)",
      slug: "genisse-goudali-selectionnee",
      categoryId: catElevage.id,
      shortDesc: "Génisse zébu Goudali rustique et productive, gestante de 4 mois, carnet vaccinal complet.",
      description: "Issues de notre programme d'amélioration génétique pastorale, nos génisses Goudali allient résistance aux tiques, excellente conformation bouchère et aptitudes laitières stables en climat tropical. Vendu avec certificat vétérinaire, échographie de gestation et passeport sanitaire individuel.",
      price: 450000,
      unit: "tête",
      stock: 15,
      sku: "ELV-GEN-GOUD",
      featured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=1000&auto=format&fit=crop"
      ]),
      specs: JSON.stringify({
        "Race": "Zébu Goudali Pur",
        "Âge": "24 à 28 mois",
        "Poids moyen": "320 - 360 kg",
        "Statut": "Gestante (échographie positive)",
        "Statut Sanitaire": "Vaccinée CBPP, Charbon, déparasitée"
      })
    },
    {
      name: "Taureau Reproducteur Métis Charolais-Goudali",
      slug: "taureau-reproducteur-metis-charolais-goudali",
      categoryId: catElevage.id,
      shortDesc: "Reproducteur d'élite à forte musculature, vigueur hybride garantie pour croisement en élevage.",
      description: "Taureau F1 né de père Charolais et mère Goudali. Combine la musculature développée et le gain moyen quotidien (GMQ) du Charolais avec la tolérance à la chaleur et aux maladies tropicales du zébu.",
      price: 750000,
      unit: "tête",
      stock: 6,
      sku: "ELV-TAU-CHAR",
      featured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1000&auto=format&fit=crop"
      ]),
      specs: JSON.stringify({
        "Croisement": "50% Charolais / 50% Goudali",
        "Âge": "30 mois",
        "Poids": "540 kg",
        "Aptitude": "Test de fertilité et spermiogramme valide"
      })
    },
    {
      name: "Lot de 10 Porcelets Sevrés Large White x Landrace",
      slug: "lot-porcelets-sevres-large-white",
      categoryId: catElevage.id,
      shortDesc: "Porcelets sevrés à 35 jours (10-12 kg), queue coupée, fer injecté, sevrage progressif garanti.",
      description: "Lot homogène de 10 porcelets sevrés vigoureux issus de lignées maternelles prolifiques et rustiques. Élevés sur caillebotis assainis, ayant reçu leur supplémentation en fer et un protocole de vaccination rigoureux.",
      price: 280000,
      unit: "lot de 10",
      stock: 12,
      sku: "ELV-PORC-LOT10",
      featured: false,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=1000&auto=format&fit=crop"
      ]),
      specs: JSON.stringify({
        "Race": "Large White x Landrace",
        "Poids moyen unitaire": "10 à 12 kg",
        "Âge au sevrage": "35 jours",
        "Soins reçus": "Fer dextran, vermifuge, vaccins antipesteux"
      })
    },
    {
      name: "Poulets Fermiers Goliath Prêts à l'Abattage",
      slug: "poulets-fermiers-goliath-elevage-plein-air",
      categoryId: catElevage.id,
      shortDesc: "Volailles lourdes de race Goliath élevées en liberté, chair ferme et savoureuse (2.2 à 2.8 kg).",
      description: "Poulets fermiers de souche Goliath élevés pendant 90 jours minimum en parcours herbeux ombragé, nourris avec nos céréales de ferme. Chair dense, faible teneur en graisse et saveur authentique de terroir.",
      price: 4500,
      unit: "tête",
      stock: 250,
      sku: "ELV-VOL-GOL",
      featured: false,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000&auto=format&fit=crop"
      ]),
      specs: JSON.stringify({
        "Souche": "Goliath Amélioré",
        "Mode d'élevage": "Plein air (90 jours)",
        "Poids vif": "2.2 à 2.8 kg",
        "Alimentation": "100% céréales & protéines végétales de la ferme"
      })
    },

    // --- PRODUITS LAITIERS ---
    {
      name: "Lait Pasteurisé Entier de Ferme (Bidon 10L)",
      slug: "lait-pasteurise-entier-10l",
      categoryId: catLaitiers.id,
      shortDesc: "Lait frais entier pasteurisé à basse température, non homogénéisé, riche en crème naturelle.",
      description: "Récolté lors de la traite du matin sur nos vaches nourries à l'herbe et au foin de luzerne. Pasteurisé doucement pour préserver toutes ses vitamines et son goût riche. Conditionné en bidon hermétique qualité alimentaire.",
      price: 9000,
      unit: "bidon 10L",
      stock: 80,
      sku: "LAIT-ENT-10L",
      featured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?q=80&w=1000&auto=format&fit=crop"
      ]),
      specs: JSON.stringify({
        "Matière Grasse": "≥ 3.8%",
        "Traitement": "Pasteurisation douce (72°C - 15s)",
        "Conservation": "+4°C (7 jours)",
        "Conditionnement": "Bidon PEHD 10 Litres"
      })
    },
    {
      name: "Beurre Fermier Pur Baratté Traditionnel (1 kg)",
      slug: "beurre-fermier-pur-baratte-1kg",
      categoryId: catLaitiers.id,
      shortDesc: "Beurre doux artisanal fabriqué à partir de crème maturée, arôme de noisette intense.",
      description: "Fabriqué dans notre atelier de transformation laitière selon la méthode traditionnelle de barattage de crème fraîche affinée. Sans conservateur ni additif.",
      price: 6500,
      unit: "plaquette 1kg",
      stock: 95,
      sku: "LAIT-BEUR-1KG",
      featured: false,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=1000&auto=format&fit=crop"
      ]),
      specs: JSON.stringify({
        "Teneur en matière grasse": "82%",
        "Sel": "Doux (non salé)",
        "Conditionnement": "Papier sulfurisé aluminium 1 kg"
      })
    },

    // --- INTRANTS & SEMENCES ---
    {
      name: "Semences Hybrides de Maïs Jaune (Taux Germination 98%)",
      slug: "semences-hybrides-mais-jaune",
      categoryId: catIntrants.id,
      shortDesc: "Semences traitées et certifiées, cycle 105 jours, potentiel de rendement jusqu'à 8 T/ha.",
      description: "Semences certifiées de première génération sélectionnées pour leur résistance aux foreurs de tiges et à la cercosporiose. Excellente vigueur au démarrage et épi compact à gros grains réguliers.",
      price: 32000,
      unit: "sac 25kg",
      stock: 140,
      sku: "INT-SEM-MAIS25",
      featured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?q=80&w=1000&auto=format&fit=crop"
      ]),
      specs: JSON.stringify({
        "Taux de germination": "≥ 98%",
        "Pureté variétale": "99.8%",
        "Cycle végétatif": "105 - 110 jours",
        "Potentiel de rendement": "7 à 8.5 Tonnes / Hectare"
      })
    },
    {
      name: "Engrais Bio-Compost Enrichi en Matière Organique (50 kg)",
      slug: "engrais-bio-compost-enrichi-50kg",
      categoryId: catIntrants.id,
      shortDesc: "Fertilisant organique 100% naturel issu de fientes et fumier de bovins compostés à chaud.",
      description: "Compost microbien affiné pendant 6 mois avec aération contrôlée. Améliore la structure du sol, régule la rétention hydrique et libère progressivement les éléments N-P-K essentiels.",
      price: 8500,
      unit: "sac 50kg",
      stock: 400,
      sku: "INT-FERT-BIO50",
      featured: false,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=1000&auto=format&fit=crop"
      ]),
      specs: JSON.stringify({
        "Matière Organique": "> 65%",
        "Formule NPK": "3.5 - 2.8 - 3.2 + Oligo-éléments",
        "pH": "6.8 - 7.2",
        "Granulométrie": "Poudre meuble tamisée 5mm"
      })
    },

    // --- MATÉRIEL AGRICOLE ---
    {
      name: "Motoculteur Diesel Professionnel 10 CV avec Rotovator",
      slug: "motoculteur-diesel-10cv-rotovator",
      categoryId: catMateriel.id,
      shortDesc: "Moteur diesel refroidi par air, démarrage électrique, boîte 3 vitesses + marche arrière.",
      description: "Engin robuste conçu pour le labour, le fraisage et le sarclage intensif de parcelles maraîchères et céréalières de 1 à 5 hectares. Fourni complet avec son jeu de fraises rotatives réglables (largeur 80-110 cm), charrue brabant et roues agraires larges.",
      price: 950000,
      unit: "unité",
      stock: 8,
      sku: "MAT-MOTO-10CV",
      featured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?q=80&w=1000&auto=format&fit=crop"
      ]),
      specs: JSON.stringify({
        "Motorisation": "Diesel 4 temps 10 CV (406 cc)",
        "Démarrage": "Électrique (batterie 12V) + Lanceur manuel",
        "Transmission": "Engrenages bain d'huile",
        "Accessoires inclus": "Fraises rotatives 110cm, Charrue réversible, Roues agraires 5.00-12",
        "Garantie": "1 an pièces et main d'œuvre"
      })
    },
    {
      name: "Kit Complet d'Irrigation Goutte-à-Goutte Solaire 1/2 Hectare",
      slug: "kit-irrigation-goutte-a-goutte-solaire",
      categoryId: catMateriel.id,
      shortDesc: "Kit autonome avec pompe solaire immergée, tuyaux goutte-à-goutte autorégulants et filtre à disques.",
      description: "Système complet prêt à installer permettant d'irriguer avec précision jusqu'à 5 000 m² de cultures en lignes. Réduit la consommation d'eau de 60% par rapport à l'arrosage manuel.",
      price: 680000,
      unit: "kit complet",
      stock: 12,
      sku: "MAT-IRR-SOL05",
      featured: false,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1000&auto=format&fit=crop"
      ]),
      specs: JSON.stringify({
        "Superficie couverte": "5 000 m² (0.5 Ha)",
        "Pompe": "Solaire immergée DC 48V + Panneaux 600W",
        "Goutteurs": "Autorégulants 2L/h espacés de 30 cm",
        "Filtration": "Double filtre à disques 120 mesh"
      })
    }
  ];

  for (const p of productsData) {
    await prisma.product.create({ data: p });
  }

  console.log(`✅ ${productsData.length} Produits détaillés créés avec caractéristiques techniques.`);

  // 5. Sections de page dynamiques (CMS)
  const sectionsData = [
    {
      type: "HERO",
      title: "L'Excellence de la Terre, la Puissance de l'Industrie",
      subtitle: "Production agro-pastorale de haute précision, transformation industrielle et vente directe aux coopératives, éleveurs et entreprises.",
      badge: "Domaines & Usines Certifiés",
      content: "TERRANOVA allie tradition agronomique et technologies modernes pour livrer des céréales d'élite, du bétail sélectionné, des intrants certifiés et des équipements agricoles endurants.",
      mediaUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600&auto=format&fit=crop",
      metadata: JSON.stringify({
        primaryCtaText: "Découvrir le Catalogue",
        primaryCtaLink: "/catalogue",
        secondaryCtaText: "Commander par WhatsApp",
        secondaryCtaLink: "https://wa.me/237690000000",
        statsBadge: "99.2% Pureté Certifiée"
      }),
      order: 1,
      visible: true,
    },
    {
      type: "CATEGORIES_HIGHLIGHT",
      title: "Nos Grandes Familles de Produits",
      subtitle: "Une offre complète et modulable pour répondre aux exigences des professionnels et des particuliers.",
      badge: "Filières Maîtrisées",
      content: "Chaque filière fait l'objet d'un contrôle qualité continu, depuis la sélection génétique et l'itinéraire cultural jusqu'au conditionnement en entrepôt thermo-régulé.",
      mediaUrl: null,
      metadata: JSON.stringify({
        layout: "grid-5",
      }),
      order: 2,
      visible: true,
    },
    {
      type: "STORY_VALUES",
      title: "De la Terre Fertile à la Rigueur Industrielle",
      subtitle: "Plus de 2 500 hectares sous conduite agronomique durable et 15 000 tonnes de capacité de stockage sécurisé.",
      badge: "Notre Savoir-Faire",
      content: "Fondée avec la vision d'une souveraineté alimentaire d'excellence, TERRANOVA déploie des infrastructures de pointe : silos ventilés, fermes d'insémination artificielle, unités de calibrage optique et laboratoires de contrôle sanitaire.",
      mediaUrl: "https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?q=80&w=1200&auto=format&fit=crop",
      secondaryMediaUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1200&auto=format&fit=crop",
      metadata: JSON.stringify({
        points: [
          { title: "Génétique Pastorale Élite", desc: "Croisements contrôlés pour une robustesse et une productivité laitière/bouchère maximales." },
          { title: "Zéro Perte Post-Récolte", desc: "Silos métalliques thermo-régulés garantissant un grain intact sans aflatoxines." },
          { title: "Pratiques Éco-Responsables", desc: "Restitution des matières organiques, jachères tournantes et gestion raisonnée de l'eau." }
        ]
      }),
      order: 3,
      visible: true,
    },
    {
      type: "KEY_METRICS",
      title: "L'Agro-Industrie en Chiffres Concrets",
      subtitle: "Des résultats mesurables bâtis sur la confiance de nos partenaires institutionnels et privés.",
      badge: "Performance & Échelle",
      content: "Nos indicateurs clés témoignent de notre engagement quotidien envers l'excellence opérationnelle et la satisfaction client.",
      mediaUrl: null,
      metadata: JSON.stringify({
        metrics: [
          { value: "2 500+", label: "Hectares Exploités", sub: "Céréales & cultures fourragères" },
          { value: "18 000 T", label: "Volume Annuel Produit", sub: "Maïs, soja, sorgho & dérivés" },
          { value: "98.8%", label: "Taux de Germination", sub: "Sur nos semences hybrides certifiées" },
          { value: "1 250+", label: "Clients Professionnels", sub: "Provenderies, éleveurs & coopératives" }
        ]
      }),
      order: 4,
      visible: true,
    },
    {
      type: "QUALITY_TRACEABILITY",
      title: "Traçabilité Absolue & Rigueur Sanitaire",
      subtitle: "Chaque lot de céréales ou tête de bétail est identifié par un code unique traçable du champ jusqu'à la livraison.",
      badge: "Garantie de Qualité",
      content: "Nos ingénieurs agronomes et docteurs vétérinaires appliquent des protocoles d'inspection stricts à chaque étape de la chaîne de valeur.",
      mediaUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1200&auto=format&fit=crop",
      metadata: JSON.stringify({
        certifications: [
          { name: "Contrôle Phytosanitaire", desc: "Analyses de laboratoire garantissant l'absence de résidus chimiques nocifs." },
          { name: "Suivi Vétérinaire Individuel", desc: "Passeport sanitaire et historique vaccinal complet pour chaque animal vendu." },
          { name: "Conditionnement Normalisé", desc: "Emballages étanches préservant la pureté et la fraîcheur des intrants et grains." }
        ]
      }),
      order: 5,
      visible: true,
    },
    {
      type: "TESTIMONIALS",
      title: "La Confiance de Nos Partenaires",
      subtitle: "Ceux qui font tourner les usines, les fermes et les marchés partagent leur retour d'expérience avec TERRANOVA.",
      badge: "Témoignages & Preuve Sociale",
      content: null,
      mediaUrl: null,
      metadata: JSON.stringify({
        testimonials: [
          {
            quote: "Le maïs jaune fourni par TERRANOVA présente une régularité de séchage et une pureté inégalées. Nos rendements en provende ont augmenté de 12% dès le premier trimestre d'approvisionnement.",
            author: "Ing. Michel Kamga",
            role: "Directeur Technique, Nutri-Agro Provenderie",
            location: "Bafoussam"
          },
          {
            quote: "Nous avons acquis 8 génisses Goudali et 1 taureau de monte. La vitalité des bêtes et le suivi vétérinaire post-achat sont d'un niveau digne des plus grands élevages internationaux.",
            author: "Dr. Oumarou Sali",
            role: "Président de la Fédération Pastorale du Nord",
            location: "Garoua"
          },
          {
            quote: "Le service de commande en ligne avec paiement instantané Orange Money / MTN MoMo et réception directe de la facture PDF nous fait gagner un temps précieux dans notre gestion comptable.",
            author: "Clarisse Ngo Bikoi",
            role: "Gérante des Établissements Bio-Vivres",
            location: "Douala"
          }
        ]
      }),
      order: 6,
      visible: true,
    },
    {
      type: "GALLERY",
      title: "Immersion au Cœur de Nos Exploitations",
      subtitle: "Découvrez en images la vie de nos domaines, nos installations industrielles et le soin apporté à chaque récolte.",
      badge: "Galerie Photographique",
      content: null,
      mediaUrl: null,
      metadata: JSON.stringify({
        photos: [
          { url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800&auto=format&fit=crop", title: "Cultures de céréales en terrasses" },
          { url: "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=800&auto=format&fit=crop", title: "Pâturages bovins de haute altitude" },
          { url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800&auto=format&fit=crop", title: "Conditionnement certifié en entrepôt" },
          { url: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=800&auto=format&fit=crop", title: "Irrigation solaire automatisée" }
        ]
      }),
      order: 7,
      visible: true,
    },
    {
      type: "CTA_BANNER",
      title: "Prêt à Collaborer avec le Leader Agro-Industriel ?",
      subtitle: "Que vous soyez une coopérative, une agro-industrie ou un éleveur passionné, commandez en ligne en 2 minutes ou échangez avec nos ingénieurs agronomes.",
      badge: "Approvisionnement Sécurisé",
      content: null,
      mediaUrl: null,
      metadata: JSON.stringify({
        primaryBtn: { text: "Commander en Ligne", link: "/catalogue" },
        secondaryBtn: { text: "Contacter le Service Commercial", link: "https://wa.me/237690000000" }
      }),
      order: 8,
      visible: true,
    }
  ];

  for (const s of sectionsData) {
    await prisma.section.create({ data: s });
  }

  console.log(`✅ ${sectionsData.length} Sections CMS dynamiques créées.`);

  // 6. Création d'une première commande exemple pour tester l'historique et la facturation
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: "TRN-20260901-8421",
      userId: clientUser.id,
      customerName: "Coopérative Agro-Pastorale Unie",
      customerEmail: "client@terranova.agri",
      customerPhone: "+237 670 98 76 54",
      shippingAddress: "Route de Foumbot, Secteur 4",
      shippingCity: "Bafoussam",
      subtotal: 78500,
      taxAmount: 0,
      shippingFee: 5000,
      totalAmount: 83500,
      status: "PAID",
      paymentMethod: "FAPSHI_MOMO",
      paymentStatus: "SUCCESS",
      paymentRef: "FPSH-TEST-2026-9901",
      invoiceNumber: "FACT-20260901-8421",
      invoiceUrl: "/api/orders/TRN-20260901-8421/invoice",
      items: {
        create: [
          {
            productName: "Maïs Jaune Grade A (Séchage Industriel)",
            unitPrice: 18500,
            quantity: 3,
            unit: "sac 50kg",
            totalRow: 55500,
          },
          {
            productName: "Semences Hybrides de Maïs Jaune (Taux Germination 98%)",
            unitPrice: 23000,
            quantity: 1,
            unit: "sac 25kg",
            totalRow: 23000,
          },
        ],
      },
    },
  });

  console.log(`✅ Commande exemple ${sampleOrder.orderNumber} créée avec succès.`);
  console.log("🌾 Base de données TERRANOVA initialisée avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur de seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
