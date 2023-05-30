# ig3_projet_web_back

Partie backend d'un projet réalisé au sein de la filière Informatique et Gestion de Polytech Montpellier.

## A propos

L'application proposée est une plateforme de veille technologique et de partage d'expérience pour les développeurs informatique leur permetant de proposer des ressources, et de créer ou de participer à des évènements aux Etats-Unis.

## Tester l'application

Le projet de ce repository a été déployé et peut être testé à l'adresse suivante [Learn'n Teach](https://learn-n-teach.cluster-ig3.igpolytech.fr/)

## Les technologies utilisées

**Backend :** NodeJS

**Router :** Express

**ORM :** Sequelize (configuré pour une connexion avec une base de données PostgreSQL)

**Gestion upload des fichiers :** Multer

**Gestion des tokens d'authentification :** JsonWebToken

**Autres dépendances :** cf ``package.json``

## La structure des fichiers

**controllers/ :** Contient le code responsable de la gestion des entrées utilisateur, de l'interaction avec les modèles et du renvoi des réponses appropriées.

**models/ :** Contient la logique pour interagir avec la base de données et ses tables.

**routes/ :** Contient les définitions des routes permettant d'intéragir via les contrôlleurs.

**app.js :** Initialise l'application, configure les middlewares et les routes. Ce fichier sert de point central pour configurer l'application.

**server.js :** Le point d'entrée de l'application, responsable du démarrage du serveur et de l'écoute des requêtes entrantes.

## Installation et exécution de l'application

### Prérequis

Installer Node.js : https://nodejs.org/

### Exécution en local

1.  Accéder à la racine du projet et installer les paquets et leurs dépendances :

        npm install

2. Installer postgresql sur une machine

3. Créer une base de données dans postgresql

4. Créer un fichier .env à la racine du projet et y ajouter les différentes variables d'environnement :

        DATABASE_URL=postgres://<username>:<password>@localhost:5432/<database_name>
        CLIENT_URL = ...
        PORT = 3002
        JWT_SECRET = ...
        EMAIL = ... # optionnel
        EMAIL_PWD = ... # optionnel
        SUPERADMIN_EMAIL = ... # optionnel

5.  Démarrer l'application :

        npm run dev

6.  Entrer http://localhost:3002 (ou le port spécifié dans le .env) dans un navigateur pour accéder à l'application.