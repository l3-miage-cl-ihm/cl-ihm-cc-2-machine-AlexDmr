# CC2 CL&IHM : Cartographie

## Préambule

Faites des commits + push réguliers.
Vérifiez dans l'onglet git -> git graph que votre code a bien été poussé. Sera noté le dernier commit qui compile (avant l'heure de fin) qui a été poussé.

Vous pouvez ne pas faire les questions dans l'ordre.

Les points sont données à titre indicatif.

Vous pouvez consulter le cours : [https://ptf-ens-l3m.web.app/](https://ptf-ens-l3m.web.app/)
et vos projets précédents sur GitHub.

## Sujet

On vous demande de développer une application pour visualiser des adresses sur une carte.
A chaque adresse est associée une information sur ce qu'il y a à y faire (ramassage des `"poubelles"`, `"nettoyage"` des allées, `"livraison"` de colis).

Vous pouvez avoir une idée de ce qu'il y a à coder en consultant le site du résultat approximatif attendu : [https://l3-miage-cl-ihm.github.io/l3m-2023-2024-cc2-machine/](https://l3-miage-cl-ihm.github.io/l3m-2023-2024-cc2-machine/)

Les structures de données sont définies dans le fichier `src/app/data/adresse.ts`. Voir notamment l'interface **`InfoAdresse`** qui décrit les objets que vous allez manipuler.

## Q1) Composant racine

Dans le composant racine (app.component), lisez les commentaires dans la vue modèle afin de vous familiariser avec les données.

### Q1.A) Afficher toutes les adresses sur la carte du composant racine

Injectez le service **`AdresseService`** dans le composant racine.

Modifiez le calcul du signal dérivé `sigLayers` de sorte à y ajouter des marqueurs correspondants. Appuyez-vous sur la fonction `getMarker`, définie dans le fichier `data/marker.ts`, pour créer les marqueurs dans la vue modèle.

***Notez bien que pour cette question, vous n'avez pas besoin de modifier la vue.***

### Q1.B) Affichez les adresses dans une liste

Utilisez une liste HTML (balises `ul` et `li`) dans laquelle vous allez représenter les **`InfoAdresse`** dans le composant racine en utilisant le composant dédié à cela (**`AdresseComponent`**, dans le répertoire `src/app/adresse`). Complétez à minima le composant **`AdresseComponent`** avec une entrée pour représenter l'adresse (**indication :** voir le début de la question 2). Ne codez pas entièrement le composant **`AdresseComponent`**, ce sera l'objet de la question 2, faites juste ce qu'il faut pour avoir un affichage de l'adresse postale.

### Q1.C) Implémentez un formulaire permettant d'ajouter une nouvelle adresse

Définissez un formulaire permettant d'ajouter une nouvelle adresse. Ce formulaire permet de saisir une adresse postale dans un champs texte.

Vous pouvez vous inspirer du squelette de code suivant :

```html
<form>
    Ajouter une adresse : 
    <input #newAdresse name="newAdresse" />
</form>
```

Pour construire une instance d'`InfoAdresse` à partir de l'adresse postale, appuyez-vous sur la méthode `appendAdresse` du service `AdresseService`. Utilisez le résultat de cette méthode pour afficher un message d'erreur dans la console ("adresse non trouvée"). Dans tous les cas, réinitialiser le champs d'adresse à la chaine vide.

**Indication :** Ne modifiez pas le service, utilisez simplement les méthodes.

### Q1.D) Ajoutez un système de filtre pour n'afficher que les adresses liées à une activité donnée

Ajoutez un champ de saisie pour filtrer les adresses par activité. Vous pouvez aussi choisir de tout afficher (sélectionner toutes les activités).
Par défaut, affichez toutes les adresses.

Assurez-vous que le filtre s'applique bien à la liste ainsi qu'aux marqueurs sur la carte.

Vous pouvez implémentez la sélection du filtre en utilisant une balise `select`, voir l'exemple suivant sur StackBlitz : [https://stackblitz.com/edit/l3m-exemple-select](https://stackblitz.com/edit/l3m-exemple-select)

**Indication :** Cette question n'est pas nécessaire pour faire la suite, si vous avez du mal, vous pouvez passer aux questions suivante et revenir ici plus tard.

Pour aller plus vite, voici la vue de l'exemple du stackBlitz :

```html
Choisissez une option :
    <select [ngModel]="sigSomething()" (ngModelChange)="sigSomething.set($event)">
      <!-- Faites bien le data-binding de la valeur associée à l'option à l'aide de l'atttribut ngValue -->
      <option *ngFor="let opt of somethings" [ngValue]="opt">{{opt.label}}</option>
    </select>
    <br/><br/>
    Vous avez sélectionné un {{sigSomething().label}} qui dit "{{sigSomething().fct()}}"
```

et voici la vue-modèle :

```typescript
  readonly somethings: readonly SOMETHING[] = [
    { label: 'truc',   fct: () => 'je dit truc' },
    { label: 'machin', fct: () => 'bonjour machin' },
    { label: 'chose',  fct: () => 'voilà autre chose' },
  ];
  readonly sigSomething = signal<SOMETHING>(this.somethings[0]);
```

avec les définitions de types suivantes :

```typescript
type FCT = () => string;
type SOMETHING = { label: string; fct: FCT };
```

## Q2) Composant adresse

Vous devez maintenant compléter le composant **`AdresseComponent`**. Ce composant doit être un composant pur. Vous devrez compléter la vue et la vue-modèle, ne changez pas la structure de la vue (complétez le squelette de code existant, la feuille de style est basé sur cette structure).

En voici les entrées et les sorties :

* Une entrée requise `infoAdresse`, de type **`InfoAdresse`**.
* Une sortie `delete` qui émet **`void`**
* Une sortie `update` qui émet un **`UpdateInfoAdresse`**

### Q2.A) Afficher l'adresse et l'activité

Affichez l'adresse et l'activité dans les balises `label` prévues à ces effets. Gérer le bouton Supprimer pour émettre la demande de suppression de l'adresse via la sortie prévue à cet effet. Modifiez votre composant racine pour gérer la suppression effective de l'adresse.

### Q2.B) Afficher un marqueur sur la carte

Il y a une balise `div` avec un attribut *`leaflet`*, cette balise représente la carte affiché par le composant.
Si l'adresse a une position (attribut `latlng`), alors vous devrez :

* Centrer la carte sur l'adresse passée en entrée. Aidez vous du code existant dans le composant racine pour faire cela.
* Régler le niveau de zoom à 15.
* Ajouter un marqueur sur la carte, centré sur l'adresse.

### Q2.D) Gérer un mode édition

#### Q2.D.alpha) Ajoutez un bouton "Editer" qui permet de passer en mode édition

Lorsque le composant est en mode édition, alors le bouton "Editer" doit être remplacé par un bouton "Consulter". **La balise *section* racine de la vue du composant doit prendre la classe CSS `edition` si et seulement si le composant est en mode édition**. Le bouton "Consulter" doit permettre de revenir en mode consultation.

Vous n'avez à modifier que la balise racine section du composant **`AdresseComponent`** et à ajouter le ou les boutons nécessaire dans ce même composant.

#### Q2.D.beta) Afficher les informations en mode édition

En mode édition, vous devriez voir un champs texte permettant de saisir l'adresse, ainsi qu'un champs de sélection pour l'activité. Complétez ces balises pour afficher l'adresse et l'activité de l'`InfoAdresse` passée en entrée.

#### Q2.D.gamma) Gérer la modification de l'activité

Lorsque l'utilisateur change l'activité, vous devez émettre la demande de modification de l'activité via la sortie `update`. Modifiez votre composant racine pour gérer la modification effective de l'activité.

#### Q2.D.delta) Gérer la modification de l'adresse via le champs adresse

Lorsque l'utilisateur change l'adresse via le formulaire correspondant, vous devez émettre la demande de modification de l'adresse via la sortie `update`. Modifiez votre composant racine pour gérer la modification effective de l'adresse.

#### Q2.D.epsilon) Gérer la modification de l'adresse via la carte

Lorsque l'utilisateur clique sur la carte du composant **`AdresseComponent`** (attention, celle de ce composant, pas celle du composant racine) **et que le composant est en mode édition**, vous devez émettre la demande de modification de la position via la sortie `update`.

**Indication 1 :** Abonnez-vous à l'événement `leafletClick` sur la balise `div` représentant la carte. Les événements levés sont de type `LeafletMouseEvent`.

**Indication 2 :** Les événements `LeafletMouseEvent` ont un attribut `latlng`, c'est ce dont vous aurez besoin.

## Q3) Bonus : RxJS sur les composants `AdresseComponent`

Quand on bascule entre les modes édition et consultation, la carte ne reste pas centrée. Le but de cette question est de faire en sorte que ça le soit.

Conservez votre code précédent, le code bonus que vous allez ajouter devrait s'ajouter au code qui a été fait avant.

### Q3.A) Exposer l'infoAdresse en tant qu'observable

Utilisez la fonction `toObservable` pour exposer l'`infoAdresse` en tant qu'observable. Stockez la référence de cet observable dans un attribut privé en lecture seul `obsInfoAdresse`.

### Q3.B) Récupération des référence de la carte leaflet et de la balise div

Définissez un sujet RxJS privé en lecture `subjLeafletMap` qui permettra de publier des tuples de type :

```typescript
[m: LeafletMap, div: HTMLDivElement]
```

Définissez une méthode `registerMap` qui prend en paramètre un `LeafletMap` et un `HTMLElement`. Sa signature est donc :

```typescript
registerMap(m: LeafletMap, div: HTMLDivElement): void
```

Implémentez cette méthode de sorte à ce que le sujet `subjLeafletMap` publie un tuple contenant `m` et `div` quand elle est appelée.

Enfin, abonnez-vous à l'événement `leafletMapReady` de la carte pour appeler la méthode `registerMap` avec les arguments correspondants. **Indication :** L'événement levé par `leafletMapReady` est une référence à la carte elle-même. Vous pouvez récupérer facilement la référence à la balise `div` en utilisant la référence interne à la vue de cette dernière (définit avec `#markerMap`).

### Q3.C) Définition et utilisation d'un observable du redimensionnement de la carte

En utilisant :

* la fonction `getObsResize`, qui est définie dans le fichier `src/app/data/rxjs.ts`.
* les observables `subjLeafletMap` et `obsInfoAdresse`
* les fonctions RxJS [combineLatest](https://rxjs.dev/api/index/function/combineLatest) et [switchMap](https://rxjs.dev/api/operators/switchMap)

construisez un observable qui publie des objets de même type que le paramètre de la fonction `recenter` (fonction qui est définie dans le fichier `src/app/data/leaflet.utils.ts`), c'est à dire des objets de type :

```typescript
{ leafletMap: LeafletMap, latlng: LatLng }
```

avec `leafletMap` la référence à la carte leaflet et `latlng` les coordonnées de l'adresse que doit représenter le composant.

Abonnez vous ensuite à cet observable pour appeler la fonction `recenter` avec les objets publiés.

### Q3.D) Abonnement explicite et désabonnement lors de la destruction du composant

Conservez la référence de l'abonnement (cette référence est renvoyée par l'appel à la méthode `subscribe` des observables) à l'observable précédent dans un attribut privé en lecture seule.

Implémenter l'interface `OnDestroy` dans le composant. Dans la méthode `ngOnDestroy`, désabonnez-vous de l'abonnement à l'observable précédent (méthode `unsubscribe`).
