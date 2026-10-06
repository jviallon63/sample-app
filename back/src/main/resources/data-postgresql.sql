-- Insertion de données initiales pour les produits

-- Insertion de catégories
INSERT INTO toolbox.category (id, name, description, created_at) VALUES
(1, 'Ordinateurs', 'Ordinateurs portables et de bureau', CURRENT_TIMESTAMP),
(2, 'Smartphones', 'Téléphones mobiles intelligents', CURRENT_TIMESTAMP),
(3, 'Audio', 'Équipements audio et casques', CURRENT_TIMESTAMP),
(4, 'Accessoires', 'Accessoires informatiques', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO toolbox.product (id, categorie_id, name, description, price, stock, created_at, updated_at) VALUES
(1, 1, 'Laptop Dell XPS 15', 'Ordinateur portable haute performance avec écran 4K', 1599.99, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 'iPhone 15 Pro', 'Smartphone Apple dernière génération avec puce A17', 1199.00, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 2, 'Samsung Galaxy S24', 'Smartphone Android flagship avec intelligence artificielle', 999.00, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 'MacBook Air M3', 'Ordinateur portable Apple ultra-léger et performant', 1499.00, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 3, 'Sony WH-1000XM5', 'Casque audio sans fil avec réduction de bruit active', 399.99, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 1, 'iPad Pro 12.9', 'Tablette Apple professionnelle avec puce M2', 1299.00, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 4, 'Logitech MX Master 3S', 'Souris ergonomique sans fil pour professionnels', 99.99, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 4, 'Dell UltraSharp U2723DE', 'Écran 27 pouces QHD USB-C Hub', 599.00, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO toolbox.utilisateur (id, nom, email, mot_de_passe) VALUES 
(1, 'Jean Dupont', 'jean.dupont@email.com', 'password123'),
(2, 'Alice Martin', 'alice.m@email.com', 'secure456'),
(3, 'Bob Smith', 'bob.smith@email.com', 'qwerty789')
ON CONFLICT (id) DO NOTHING;

INSERT INTO toolbox.commande (id, utilisateur_id, statut) VALUES
(1, 1, 'Livrée'),
(2, 2, 'En attente'),
(3, 1, 'Payée')
ON CONFLICT (id) DO NOTHING;

INSERT INTO toolbox.ligne_commande (id, commande_id, produit_id, quantite, prix_unitaire_capture) VALUES 
(1, 1, 1, 1, 799.00),
(2, 1, 2, 1, 199.00),
(3, 1, 4, 3, 25.00),
(4, 2, 5, 1, 59.00),
(5, 3, 8, 1, 120.00)
ON CONFLICT (id) DO NOTHING;
