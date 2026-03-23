# Boules Tracker — Web App

Suivi des performances en pétanque, installable sur iPhone et Android.

## Fonctionnalités

- **Saisie rapide** : tir (touchée/ratée → poussée/pâlée/carreau magueul) ou pointé (qualité × technique)
- **Stats complètes** : taux de carreaux, résultats des tirs, croisement résultats × techniques pour les pointés
- **Historique** avec horodatage
- **Données sauvegardées** sur l'appareil (localStorage) — fonctionne hors ligne
- **Installable** sur écran d'accueil (PWA)

---

## Installation en 2 minutes sur GitHub Pages (gratuit)

### Étape 1 — Créer un dépôt GitHub
1. Va sur [github.com](https://github.com) → connecte-toi ou crée un compte
2. Clique sur **"New repository"**
3. Nom : `boules-tracker` (ou ce que tu veux)
4. Laisse en **Public**, coche **"Add a README file"**
5. Clique **"Create repository"**

### Étape 2 — Uploader les fichiers
1. Dans ton dépôt, clique **"Add file" → "Upload files"**
2. Glisse-dépose **tous les fichiers** de ce dossier :
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - le dossier `icons/` avec `icon-192.png` et `icon-512.png`
3. Clique **"Commit changes"**

### Étape 3 — Activer GitHub Pages
1. Va dans **Settings** de ton dépôt
2. Clique sur **"Pages"** dans le menu gauche
3. Sous "Source", sélectionne **"Deploy from a branch"**
4. Branche : **main**, dossier : **/ (root)**
5. Clique **"Save"**

Après ~1 minute, ton app est en ligne à :
`https://TON-PSEUDO.github.io/boules-tracker/`

---

## Installer l'app sur ton téléphone

### Sur iPhone (Safari)
1. Ouvre l'URL dans **Safari** (pas Chrome)
2. Appuie sur le bouton **Partager** (carré avec flèche ↑)
3. Fais défiler et tape **"Sur l'écran d'accueil"**
4. Tape **"Ajouter"**
→ L'icône apparaît sur ton écran d'accueil comme une vraie app !

### Sur Android (Chrome)
1. Ouvre l'URL dans **Chrome**
2. Chrome affiche automatiquement une bannière **"Ajouter à l'écran d'accueil"**
   (ou menu ⋮ → "Ajouter à l'écran d'accueil")
3. Tape **"Installer"**

---

## Fonctionnement hors ligne
Une fois installée et ouverte une première fois, l'app fonctionne **sans connexion internet**.
Les données sont sauvegardées localement sur ton téléphone.
