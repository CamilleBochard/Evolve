# Evolve

Portfolio de Camille Bochard, développeur. Onze ans de couvreur-zingueur, puis un changement de classe vers le développement web : le site raconte ce parcours sous la forme d'une interface de RPG.

Site : _à venir_

## Stack

- [Astro](https://astro.build) en sortie statique, avec des islands [React](https://react.dev) en TypeScript pour les parties interactives.
- Image Docker servie derrière Traefik sur un VPS.
- CI/CD avec GitHub Actions.

## Lancer le projet en local

Prérequis : Node 22 (la version est fixée dans `.nvmrc`).

```sh
nvm use
npm ci
npm run dev
```

Le site est alors disponible sur `http://localhost:4321`.

| Commande          | Action                                         |
| :---------------- | :--------------------------------------------- |
| `npm run dev`     | Serveur de développement                       |
| `npm run build`   | Construction du site statique dans `dist/`     |
| `npm run preview` | Prévisualisation du build                      |

## Licence

Le code est sous licence MIT. Le contenu (textes, images, design) reste sous tous droits réservés. Le détail est dans [LICENSE](LICENSE).
