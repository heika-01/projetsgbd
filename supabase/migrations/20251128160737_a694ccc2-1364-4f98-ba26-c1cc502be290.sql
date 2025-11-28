-- Création de la table Postes
CREATE TABLE IF NOT EXISTS public.postes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codeposte TEXT NOT NULL UNIQUE,
  libelle TEXT NOT NULL,
  indice INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Création de la table Personnel
CREATE TABLE IF NOT EXISTS public.personnel (
  idpers SERIAL PRIMARY KEY,
  nompers TEXT NOT NULL,
  prenompers TEXT NOT NULL,
  adrpers TEXT,
  villepers TEXT,
  telpers BIGINT,
  d_embauche DATE,
  login TEXT UNIQUE,
  motp TEXT,
  codeposte TEXT REFERENCES public.postes(codeposte),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Création de la table Clients
CREATE TABLE IF NOT EXISTS public.clients (
  noclt SERIAL PRIMARY KEY,
  nomclt TEXT NOT NULL,
  prenomclt TEXT,
  adrclt TEXT,
  code_postal INTEGER,
  villecit TEXT,
  telclt BIGINT,
  adrmail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Création de la table Articles
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  refart TEXT NOT NULL UNIQUE,
  designation TEXT NOT NULL,
  prixa DECIMAL(10,2),
  prixv DECIMAL(10,2),
  codetva INTEGER,
  categorie TEXT,
  qtestk INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Création de la table Commandes
CREATE TABLE IF NOT EXISTS public.commandes (
  nocde SERIAL PRIMARY KEY,
  noclt INTEGER REFERENCES public.clients(noclt),
  etatcde TEXT,
  datecde DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Création de la table Lignes de Commandes
CREATE TABLE IF NOT EXISTS public.ligcdes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nocde INTEGER REFERENCES public.commandes(nocde),
  refart TEXT REFERENCES public.articles(refart),
  qtecde INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Création de la table Livraisons
CREATE TABLE IF NOT EXISTS public.livraisoncom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nocde INTEGER REFERENCES public.commandes(nocde),
  dateliv DATE,
  livreur INTEGER REFERENCES public.personnel(idpers),
  modepay TEXT,
  etatliv TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Création de la table Historique Commandes Annulées
CREATE TABLE IF NOT EXISTS public.hcommandesannulees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nocde INTEGER,
  noclt INTEGER,
  nbrart INTEGER,
  montantc DECIMAL(10,2),
  datecde DATE,
  dateannulation DATE,
  code_postal INTEGER,
  avantliv TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.postes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ligcdes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livraisoncom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hcommandesannulees ENABLE ROW LEVEL SECURITY;

-- Policies publiques pour application interne (à ajuster selon vos besoins de sécurité)
CREATE POLICY "Allow all operations on postes" ON public.postes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on personnel" ON public.personnel FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on commandes" ON public.commandes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on ligcdes" ON public.ligcdes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on livraisoncom" ON public.livraisoncom FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on hcommandesannulees" ON public.hcommandesannulees FOR ALL USING (true) WITH CHECK (true);

-- Insertion des données Postes
INSERT INTO public.postes (codeposte, libelle, indice) VALUES 
  ('ADM', 'Administrateur', 10),
  ('MAG', 'Magasinier', 5),
  ('CHLIV', 'Chef Livreur', 7),
  ('LIV', 'Livreur', 3);

-- Insertion des données Personnel
INSERT INTO public.personnel (nompers, prenompers, adrpers, villepers, telpers, d_embauche, login, motp, codeposte) VALUES 
  ('heikal', 'azzouna', '1 rue Centrale', 'nabeul', 20373057, '2020-01-01', 'A.Heikal', 'pass1234', 'ADM'),
  ('hend', 'azzouna', '5 rue Commerce', 'nabeul', 88888888, '2021-03-15', 'M.Hend', 'pass1234', 'MAG'),
  ('mohamed', 'azzouna', '10 rue Logistic', 'nabeul', 77777777, '2022-07-20', 'C.Mohamed', 'pass1234', 'CHLIV'),
  ('latifa', 'essaid', '2 av. Ouest', 'maamoura', 66666666, '2023-01-10', 'L.Latifa', 'pass1234', 'LIV'),
  ('daylem', 'lajmi', '3 av. Nord', 'dar chaaban', 55555555, '2023-01-11', 'L.Daylem', 'pass1234', 'LIV'),
  ('Livreur', 'Nadia', '4 av. Sud', 'Marseille', 44444444, '2023-01-12', 'L.Nadia', 'pass1234', 'LIV'),
  ('Livreur', 'Sam', '5 av. Est', 'Paris', 33333333, '2023-01-13', 'L.Sam', 'pass1234', 'LIV');

-- Insertion des données Clients
INSERT INTO public.clients (nomclt, prenomclt, adrclt, code_postal, villecit, telclt, adrmail) VALUES 
  ('Martin', 'Sophie', '25 rue des Fleurs', 75001, 'Paris', 61234567, 'sophie.m@net.fr'),
  ('Bernard', 'Paul', '10 av. Liberté', 69002, 'Lyon', 78901234, 'paul.b@net.fr'),
  ('Dubois', 'Léa', '3 Impasse Verte', 31000, 'Toulouse', 56789012, 'lea.d@net.fr'),
  ('SARL Tech', NULL, '99 Bld. de l''Est', 13008, 'Marseille', 89012345, 'sarl.t@net.fr'),
  ('Petit', 'Chloé', '17 Rue des Lilas', 34000, 'Montpellier', 67890123, 'chloe.p@net.fr'),
  ('Robert', 'David', '42 Chemin des Bois', 59000, 'Lille', 54321098, 'david.r@net.fr'),
  ('Richard', 'Émilie', '8 Place Rouge', 44000, 'Nantes', 47654321, 'emilie.r@net.fr'),
  ('Durand', 'Lucas', '5 Rue du Port', 35000, 'Rennes', 87654321, 'lucas.d@net.fr'),
  ('Leroy', 'Emma', '1 Bld. Océan', 33000, 'Bordeaux', 98765431, 'emma.l@net.fr'),
  ('Moreau', 'Hugo', '30 Av. de la Gare', 67000, 'Strasbourg', 60987654, 'hugo.m@net.fr'),
  ('Gros', 'Pierre', '12 rue Paris', 75001, 'Paris', 60123456, 'p.gros@net.fr'),
  ('SARL Bati', NULL, '44 av. Briques', 75001, 'Paris', 60998877, 'sarl.b@net.fr');

-- Insertion des données Articles
INSERT INTO public.articles (refart, designation, prixa, prixv, codetva, categorie, qtestk) VALUES 
  ('LAP1', 'Ordinateur Portable A', 800.00, 1000.00, 1, 'INFORMAT', 50),
  ('MON2', 'Écran 27 pouces', 150.00, 250.00, 1, 'INFORMAT', 120),
  ('KBD3', 'Clavier Mécanique', 40.00, 70.00, 1, 'INFORMAT', 200),
  ('SPO4', 'Smartphone Z', 500.00, 750.00, 2, 'TELECOM', 80),
  ('TAB5', 'Tablette 10 pouces', 200.00, 320.00, 2, 'TELECOM', 150),
  ('CBL6', 'Câble HDMI 2m', 5.00, 15.00, 1, 'ACCESSOI', 500),
  ('PRT7', 'Imprimante Laser', 120.00, 180.00, 2, 'BUREAU', 70),
  ('MOU8', 'Souris sans fil', 10.00, 25.00, 1, 'ACCESSOI', 300),
  ('AUD9', 'Casque Audio', 60.00, 100.00, 2, 'AUDIO', 100),
  ('WEBX', 'Webcam HD', 25.00, 45.00, 1, 'ACCESSOI', 180),
  ('MEMY', 'Carte Mémoire 64G', 15.00, 30.00, 1, 'ACCESSOI', 250);

-- Insertion des données Commandes
INSERT INTO public.commandes (noclt, etatcde, datecde) VALUES 
  (1, 'PR', '2025-12-01'), 
  (2, 'PR', '2025-12-02'), 
  (4, 'EC', '2025-12-03'), 
  (1, 'PR', '2025-12-04'), 
  (11, 'PR', '2025-12-05'), 
  (5, 'PR', '2025-12-06'), 
  (6, 'PR', '2025-12-07'),
  (12, 'PR', '2025-12-08'), 
  (7, 'EC', '2025-12-09'), 
  (8, 'EC', '2025-12-10'), 
  (9, 'AN', '2025-12-11');

-- Insertion des données Lignes de Commandes
INSERT INTO public.ligcdes (nocde, refart, qtecde) VALUES 
  (1, 'LAP1', 1),
  (1, 'MON2', 1),
  (2, 'KBD3', 2),
  (3, 'SPO4', 1),
  (3, 'TAB5', 1),
  (4, 'PRT7', 1),
  (5, 'MOU8', 5),
  (6, 'AUD9', 2),
  (7, 'LAP1', 1),
  (8, 'WEBX', 3),
  (9, 'MEMY', 10),
  (11, 'MON2', 1);

-- Insertion des données Livraisons
INSERT INTO public.livraisoncom (nocde, dateliv, livreur, modepay, etatliv) VALUES 
  (1, '2025-12-05', 4, 'avant_livraison', 'EC'),
  (4, '2025-12-05', 4, 'apres_livraison', 'EC'),
  (5, '2025-12-05', 4, 'avant_livraison', 'EC'),
  (8, '2025-12-05', 7, 'apres_livraison', 'EC'),
  (2, '2025-12-05', 5, 'avant_livraison', 'LI'),
  (6, '2025-12-06', 3, 'apres_livraison', 'EC'),
  (7, '2025-12-06', 6, 'avant_livraison', 'EC'),
  (2, '2024-01-01', 5, 'avant_livraison', 'LI'),
  (9, '2024-01-02', 4, 'apres_livraison', 'LI'),
  (10, '2024-01-03', 6, 'avant_livraison', 'LI'),
  (3, '2024-01-04', 7, 'apres_livraison', 'LI');

-- Insertion des données Historique Commandes Annulées
INSERT INTO public.hcommandesannulees (nocde, noclt, nbrart, montantc, datecde, dateannulation, code_postal, avantliv) VALUES 
  (11, 9, 1, 250.00, '2025-12-01', '2025-12-02', 33000, 'V'),
  (20, 1, 2, 1500.00, '2024-01-01', '2024-01-02', 75001, 'V'),
  (21, 2, 1, 70.00, '2024-02-01', '2024-02-05', 69002, 'F'),
  (22, 3, 3, 500.00, '2024-03-01', '2024-03-10', 31000, 'V'),
  (23, 4, 1, 100.00, '2024-04-01', '2024-04-01', 13008, 'V'),
  (24, 5, 5, 200.00, '2024-05-01', '2024-05-03', 34000, 'V'),
  (25, 6, 1, 1000.00, '2024-06-01', '2024-06-04', 59000, 'F'),
  (26, 7, 2, 50.00, '2024-07-01', '2024-07-02', 44000, 'V'),
  (27, 8, 3, 400.00, '2024-08-01', '2024-08-05', 35000, 'V'),
  (28, 10, 4, 650.00, '2024-09-01', '2024-09-03', 67000, 'V');