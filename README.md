### Prérequis

- Java 21 ou version ultérieure
- Maven 3.8 ou version ultérieure
- Node.js 22 ou version ultérieure et npm

### Lancement du projet

Le back-end utilise deux profils Spring :

| Profil | Base de données | Utilisation |
| --- | --- | --- |
| `local` (par défaut) | SQLite, fichier `/data/local.db` | Développement local, sans dépendance externe |
| `dev` | PostgreSQL | Environnement de développement partagé |

Avec le profil `local`, les tables (`back/src/main/resources/ddl-sqlite.sql`, équivalent SQLite de `ddl.sql`) et les données initiales (`data-sqlite.sql`, identiques à `data-postgresql.sql`) sont créées automatiquement au démarrage. Pour repartir de zéro, supprimez `back/local.db`.

Dans un terminal, démarrez le **back-end** avec le profil `local` :

```bash
cd back
mvn spring-boot:run
```

Pour utiliser PostgreSQL avec le profil `dev`, créez d'abord le schéma à partir de `back/src/main/resources/ddl.sql` s'il n'existe pas, puis lancez :

```bash
cd back

export DB_PASSWORD=XXX
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Dans un autre terminal, configurez l'URL du back-end et démarrez le **front-end** :

```bash
cd front

npm install -g @angular/cli@20.3.18
npm install
export BACKEND_URL=http://localhost:8080
cat > src/assets/config.js <<EOF
window.dynamicConf = {
	BACKEND_URL: "${BACKEND_URL}"
};
EOF
ng serve
```

Le front-end lit cette valeur dans `src/assets/config.js`. Le chemin `/api` est ajouté automatiquement par l'application : indiquez donc l'URL de base du back-end, sans `/api`.

### Accès

- **Front-end** : <http://localhost:4200>
- **Interface Swagger du back-end** : <http://localhost:8080/api/swagger-ui.html>
