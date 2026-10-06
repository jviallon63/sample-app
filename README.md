### Prérequis

- Java 17+
- Maven 3.8+

### Lancer le projet

Le backend gère deux profils Spring :

| Profil | Base de données | Usage |
| --- | --- | --- |
| `local` (défaut) | SQLite, fichier `back/local.db` | Développement local, sans dépendance externe |
| `dev` | PostgreSQL | Environnement de dev partagé |

Avec le profil `local`, les tables (`back/src/main/resources/ddl-sqlite.sql`, équivalent SQLite de `ddl.sql`) et les données initiales (`data-sqlite.sql`, identiques à `data-postgresql.sql`) sont créées automatiquement au démarrage. Pour repartir de zéro, supprimer `back/local.db`.

In a terminal start **backend** (profil `local`) :

```bash
cd back
mvn spring-boot:run
```

Pour utiliser PostgreSQL (profil `dev`), créer au préalable le schéma avec `back/src/main/resources/ddl.sql` s'il n'existe pas, puis :

```bash
cd back

export DB_PASSWORD=XXX
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

In another terminal start **frontend**:
```bash
cd front

npm install -g @angular/cli@20.3.18
npm install
ng serve
```

### Accès

- **Frontend** : <http://localhost:4200>
- **Backend Swagger UI** : <http://localhost:8080/api/swagger-ui.html>
