-- Équivalent SQLite de ddl.sql (pas de schéma toolbox, SERIAL remplacé par INTEGER AUTOINCREMENT)

CREATE TABLE IF NOT EXISTS category (
    id          INTEGER         PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR(50)     NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMP       NOT NULL
);

-- categorie_id n'est pas mappé par l'entité Product : la valeur par défaut remplace le SERIAL de PostgreSQL
CREATE TABLE IF NOT EXISTS product (
    id           INTEGER         PRIMARY KEY AUTOINCREMENT,
    categorie_id INTEGER         NOT NULL DEFAULT 1,
    name         VARCHAR(100)    NOT NULL,
    description  VARCHAR(500),
    price        NUMERIC(10, 2)  NOT NULL,
    stock        INTEGER         NOT NULL DEFAULT 0,
    created_at   TIMESTAMP       NOT NULL,
    updated_at   TIMESTAMP,
    CONSTRAINT categorie_fkey FOREIGN KEY (categorie_id) REFERENCES category(id)
);

CREATE TABLE IF NOT EXISTS utilisateur (
    id               INTEGER      PRIMARY KEY AUTOINCREMENT,
    nom              VARCHAR(100),
    email            VARCHAR(155) UNIQUE NOT NULL,
    mot_de_passe     VARCHAR(255) NOT NULL,
    date_inscription TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now'))
);

CREATE TABLE IF NOT EXISTS commande (
    id             INTEGER     PRIMARY KEY AUTOINCREMENT,
    utilisateur_id INTEGER     NOT NULL,
    date_commande  TIMESTAMP   DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
    statut         VARCHAR(50) DEFAULT 'En attente', -- Ex: Payée, Livrée, Annulée
    CONSTRAINT utilisateur_fkey FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id)
);

CREATE TABLE IF NOT EXISTS ligne_commande (
    id                    INTEGER        PRIMARY KEY AUTOINCREMENT,
    commande_id           INTEGER        NOT NULL,
    produit_id            INTEGER        NOT NULL,
    quantite              INTEGER        NOT NULL CHECK (quantite > 0),
    prix_unitaire_capture DECIMAL(10, 2) NOT NULL,
    CONSTRAINT commande_fkey FOREIGN KEY (commande_id) REFERENCES commande(id),
    CONSTRAINT produit_fkey FOREIGN KEY (produit_id) REFERENCES product(id)
);
