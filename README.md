# Quizer - Application de Quiz Éducatif avec IA

Quizer est une application web qui utilise l'intelligence artificielle (OpenAI API) pour générer des questions de quiz éducatifs sur des sujets choisis par l'utilisateur. L'application permet à l'utilisateur de choisir le niveau de difficulté et d'ajuster ce niveau en fonction de ses performances.

## 🚀 Démo en ligne

Une version déployée de l'application est disponible à l'adresse: [Quizer App](https://votre-lien-render.onrender.com)

## ✨ Fonctionnalités

- **Sélection de sujet personnalisée** : L'utilisateur peut choisir parmi des sujets populaires ou entrer un sujet personnalisé.
- **Niveaux de difficulté ajustables** : Quatre niveaux de difficulté disponibles (Facile, Moyen, Difficile, Expert).
- **Questions générées par IA** : Utilisation de l'API OpenAI (GPT-3.5) pour générer des questions pertinentes et adaptées.
- **Explications détaillées** : Chaque réponse est accompagnée d'une explication pour favoriser l'apprentissage.
- **Demande d'informations supplémentaires** : Possibilité de demander plus de détails sur chaque question.
- **Suggestion d'ajustement de difficulté** : En fonction des performances, l'application peut suggérer d'ajuster le niveau de difficulté.
- **Questions variées** : Génération de questions différentes à chaque fois, même sur le même sujet.

## 🛠️ Technologies utilisées

- **Next.js** : Framework React avec rendu côté serveur
- **TypeScript** : Pour un code typé et plus robuste
- **Tailwind CSS** : Pour le styling moderne et responsive
- **OpenAI API** : Pour la génération de questions et d'explications

## ⚙️ Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-username/quizer-app.git
   cd quizer-app
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Créez un fichier `.env.local` à la racine du projet avec votre clé API OpenAI :
   ```
   OPENAI_API_KEY=votre_cle_api_ici
   ```

4. Lancez l'application en mode développement :
   ```bash
   npm run dev
   ```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🚀 Déploiement

Pour construire l'application pour la production :

```bash
npm run build
```

Puis pour démarrer le serveur de production :

```bash
npm start
```

## 📝 Configuration pour Render

Cette application est configurée pour être facilement déployée sur Render. Le fichier de configuration nécessaire est inclus dans ce dépôt.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request. 