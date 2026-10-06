CREATE SCHEMA IF NOT EXISTS toolbox;

CREATE TABLE IF NOT EXISTS toolbox.category (
    id          SERIAL       PRIMARY KEY,
    name        VARCHAR(50)     NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMP       NOT NULL
);

CREATE TABLE IF NOT EXISTS toolbox.product (
    id          SERIAL       PRIMARY KEY,
    categorie_id SERIAL NOT NULL,
    name        VARCHAR(100)    NOT NULL,
    description VARCHAR(500),
    price       NUMERIC(10, 2)  NOT NULL,
    stock       INTEGER         NOT NULL DEFAULT 0,
    created_at  TIMESTAMP       NOT NULL,
    updated_at  TIMESTAMP,
    CONSTRAINT categorie_fkey FOREIGN KEY (categorie_id) REFERENCES toolbox.category(id)
);

CREATE TABLE IF NOT EXISTS toolbox.utilisateur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    email VARCHAR(155) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS toolbox.commande (
    id SERIAL PRIMARY KEY,
    utilisateur_id SERIAL not null,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(50) DEFAULT 'En attente', -- Ex: Payée, Livrée, Annulée
    CONSTRAINT utilisateur_fkey FOREIGN KEY (utilisateur_id) REFERENCES toolbox.utilisateur(id)
);

CREATE TABLE IF NOT EXISTS toolbox.ligne_commande (
    id SERIAL PRIMARY KEY,
    commande_id SERIAL not null,
    produit_id SERIAL not null,
    quantite INTEGER NOT NULL CHECK (quantite > 0),
    prix_unitaire_capture DECIMAL(10, 2) NOT null,
    CONSTRAINT commande_fkey FOREIGN KEY (commande_id) REFERENCES toolbox.commande(id),
    CONSTRAINT produit_fkey FOREIGN KEY (produit_id) REFERENCES toolbox.product(id)
);