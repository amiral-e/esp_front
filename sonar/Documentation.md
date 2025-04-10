# Documentation SonarQube Docker

## Prérequis

- Docker Desktop installé sur votre machine

## Étapes de configuration

### 1. Lancer SonarQube avec Docker

Utilisez le fichier `docker-compose.yml` pour lancer SonarQube et PostgreSQL :

```bash
cd sonar
docker-compose up -d
```


Cela lancera deux conteneurs :
- `sonarqube_db` (PostgreSQL)
- `sonarqube` (SonarQube)

### 2. Vérifier les conteneurs

Vérifiez que les conteneurs sont en cours d'exécution.


### 3. Accéder à l'interface SonarQube

Ouvrez votre navigateur web à l'adresse :

```
http://localhost:9000
```


### 4. Créer un token d'accès

Pour créer un token d'accès :

1. Connectez-vous à l'interface SonarQube avec l'utilisateur par défaut :
   - Username: `admin`
   - Password: `admin`

2. Crée un projet local

   ![Alt text](/sonar/local_project.png)

3. utilliser la config global

   ![Alt text](/sonar/setting.png)

4. analyse de methode chosir en local
   ![Alt text](/sonar/method.png)

5. Donnez un nom au token et cliquez sur `Generate`

6. Copiez le token généré

### 5. Configurer le fichier sonar-project.properties

Modifiez le fichier `sonar-project.properties` avec vos informations :

```properties
# exemple
sonar.projectKey=frontend
sonar.projectName=frontend
sonar.projectVersion=1.0

# Chemin vers le code source
sonar.sources=./src

# Configuration du serveur SonarQube
sonar.host.url=http://sonarqube:9000
```

### 6. Lancer le scanner

Allez au root du repo, puis utilisew la commande suivante pour scanner tous les fichiers : 

```bash
docker run --rm --network=sonarnet -e SONAR_TOKEN=your_token_here -v ".:/usr/src" sonarsource/sonar-scanner-cli
```