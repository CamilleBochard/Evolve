# Projet

Site web de type portfolio.

- **Stack** : Astro (sortie statique) + islands React en TypeScript.
- **Structure** : projet Astro unique. Contenu en `.astro` (accueil, About, Contact, galerie de l'Atelier), interactivité en composants React montés en islands.
- **Serveur** : mode `hybrid` (adaptateur Node) uniquement pour la route proxy du chatbot. Tout le reste est prérendu en statique.
- **Hébergement** : VPS. Services lancés via Docker, reverse proxy Traefik.
- **CI/CD** : GitHub Actions. Dépôt GitHub public.

## Contexte fonctionnel

Le portfolio contient une section **Atelier** qui peut accueillir tout type de projet.
- Pages classiques : *About me* et *Contact*.
- Les projets d'ecrit ci dessous sont listés a titre d'information. IL NE SONT PAS A REALISER DANS CE PROJET.
- Premier projet annexe : un chatbot. C'est une UI React (island) 
- Deuxième type de projet : une scène 3D en Three.js via react-three-fiber, montée en island `client:only="react"`, isolée sur sa page pour ne pas alourdir le reste du site.


## Rôle attendu

Tu m'assistes pour coder les différentes parties du projet, en implémentant les fonctionnalités et fichiers au fur et à mesure.

---

## Git — INTERDICTION STRICTE

- Par défaut, aucun fichier n'est indexé au dépôt.
- Tu ne fais **jamais** de commit.
- Tu n'ajoutes **jamais** de fichier au dépôt.
- Tu ne lances **aucune** commande git.
- Tu peux faire des remarques sur git uniquement si c'est pertinent.

---

## Génération de code

- Respecte les bonnes pratiques Astro (pages, layouts, endpoints, choix de l'hydratation) et React (composants, hooks, islands).
- Sépare le code serveur (endpoints Astro, route proxy du chatbot) du code client (composants et islands React). Ne mélange pas les deux dans une même modification, même si cela casse ou empêche temporairement des tests.
- Modifications et créations courtes. Ne génère jamais un projet entier en une seule inférence. Procède par petites étapes.
- Priorité absolue à la lisibilité, pour le nommage des variables comme pour la logique.
- Pas de concaténations ni d'expressions compliquées. Un `if` explicite est préférable à une concaténation ou un ternaire dense.
- Pour les retours de fonction, passe par une variable intermédiaire nommée plutôt qu'un retour direct d'expression.
    - Préféré : `const response = 1 + 1; return response;`
    - À éviter : `return 1 + 1;`

### Hydratation des islands (règle Astro spécifique)

- Par défaut, une page est du HTML statique sans JavaScript. N'hydrate un composant React que s'il est réellement interactif.
- Choisis la directive `client:*` la plus économe possible :
    - `client:visible` pour ce qui devient interactif au scroll (par défaut préféré).
    - `client:idle` pour l'interactif non prioritaire.
    - `client:load` seulement si l'interactivité est nécessaire immédiatement.
    - `client:only="react"` pour ce qui ne peut pas être rendu côté serveur (Three.js / react-three-fiber, qui dépend d'API navigateur).
- Ne mets pas la scène 3D en island chargée globalement : elle reste cantonnée à sa page de l'Atelier.

### React (maîtrise plus faible, sois particulièrement rigoureux)

- Le respect des meilleures pratiques d'architecture est prioritaire : découpage des fichiers, organisation des dossiers, choix de ce qui est exporté (composants, hooks, fonctions).
- Utilise systématiquement TypeScript, y compris pour les endpoints Astro et les fichiers `.astro` avec frontmatter typé.
- À la génération de fichiers, ne produis que le squelette : structure, signatures, types, imports. Le corps des fonctions et composants reste vide avec un `// TODO: implémenter ...` décrivant ce qui doit y aller.
- N'implémente le code réel que sur demande explicite. Je donne au cas par cas les consignes indiquant quelle quantité de code implémenter.

<!-- TODO : préciser ici les conventions d'archi concrètes une fois arrêtées.
     Ex : structure par feature ou par type, emplacement des islands et des hooks,
     barrel files ou non, convention de nommage des composants,
     où vivent les endpoints serveur. -->

### Relecture et tests

- Relis le code généré avant de le présenter.
- Effectue de petits tests ciblés quand c'est utile pour vérifier qu'une brique fonctionne.
- Tests unitaires de composants ou d'utilitaires : rapides, libres.
- Tests end-to-end (navigateur, type Playwright) : coûteux, ne les lance pas de ta propre initiative. Sur demande seulement.
- Ne lance pas de longues séries de tests coûteuses en temps ou en tokens, en particulier sur le front. Reste sur des vérifications rapides et ponctuelles.

---

## Commandes

<!-- TODO : renseigner les commandes réelles du projet.
- Démarrage dev :
- Build (sortie statique / hybride) :
- Preview :
- Typecheck (astro check) :
- Lint :
- Tests unitaires :
- Tests e2e :

Docker :
- Démarrage de la stack :
- Logs :
-->

## Versions cibles

<!-- À vérifier et figer au démarrage (ne pas se fier de mémoire) : npm show <pkg> version.
     Repères relevés en sept. 2026, susceptibles d'avoir évolué :
     Astro 7.3.x, @react-three/fiber 9.7.x, Vercel AI SDK 7.x, Traefik v3.7.x. -->