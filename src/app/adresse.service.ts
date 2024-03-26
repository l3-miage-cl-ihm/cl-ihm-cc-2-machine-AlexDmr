import { Injectable, signal } from '@angular/core';
import { Feature, FeatureCollection, Point } from 'geojson';
import { LatLng } from 'leaflet';
import { Activity, AdresseProperties, InfoAdresse, UpdateInfoAdresse, getAdresseFromLatLong, getLatLngFromAdresse } from './data/adresse';

let idAdresse = 1;

@Injectable({
  providedIn: 'root'
})
export class AdresseService {

  // Signal primaire contenant des adresses
  private readonly _sigInfoAdresse = signal<readonly InfoAdresse[]>([
    { id: idAdresse++, todo: "livraison", postal: "UFR IM²AG, campus de saint martin d'hères", latlng: new LatLng(45.19382808998559, 5.768334614350211) },
    { id: idAdresse++, todo: "nettoyage", postal: "Tour Perret, Grenoble", latlng: new LatLng(45.18494177186437, 5.735391709511463) }
  ]);

  // Expose le signal primaire en tant que signal dérivé
  // sigInfoAdresse est un Signal (contrairement à _sigInfoAdresse qui est un WritableSignal)
  readonly sigInfoAdresse = this._sigInfoAdresse.asReadonly();

  readonly getLatLngFromAdresse = getLatLngFromAdresse;
  readonly getAdresseFromLatLong = getAdresseFromLatLong;

  async appendAdresse(adresse: string, todo: Activity): Promise<undefined | InfoAdresse> {
    const latlng = await getLatLngFromAdresse(adresse);
    if (latlng !== undefined) {
      const ia: InfoAdresse = {
        id: idAdresse++,
        postal: adresse,
        latlng,
        todo
      }
      this._sigInfoAdresse.update(L => [...L, ia])
      return ia;
    }
    return undefined
  }

  removeAdresse(ia: InfoAdresse) {
    this._sigInfoAdresse.update(L => L.filter(ia2 => ia2 !== ia))
  }

  /**
   * Met à jour l'adresse ia avec la mise à jour up.
   * La mise à jour up peut être de trois types:
   * - "latlng": on donne une nouvelle longitude-latitude, il faut alors trouver l'adresse postale correspondante.
   *             Attention il se peut que l'adresse postale ne soit pas trouvée.
   * - "todo": on change l'activité à faire à cette adresse.
   * - "postal": on donne une nouvelle adresse postale, il faut alors trouver la longitude-latitude correspondante.
   *             Attention il se peut que la longitude-latitude ne soit pas trouvée.
   * Une nouvelle adresse est construite, qui porte le même identifiant que ia.
   * Cette nouvelle adresse remplace l'ancienne dans la liste des adresses.
   * Si la mise à jour est impossible (si on ne trouve pas d'adresse postale ou de longitude-latitude) alors les adresse ne sont pas modifiées.
   * Le type de retour de la méthode n'est pas pécisé, vous pouvez utiliser ce qui vous arrange.
   * @param ia Une InfoAdresse
   * @param up Une mise à jour à appliquer sur l'adresse ia
   */
  async updateInfoAdresse(ia: InfoAdresse, up: UpdateInfoAdresse) {
    // console.error("Il faut implémenter la méthode updateInfoAdresse du service AdresseService")
    let ad: InfoAdresse;
    switch (up.type) {
      case "latlng":
        const postal = await this.getAdresseFromLatLong(up.latlng);
        ad = postal ? { ...ia, latlng: up.latlng, postal } : ia;
        break;
      case "todo":
        ad = { ...ia, todo: up.todo };
        break;
      case "postal":
        const latlng = await this.getLatLngFromAdresse(up.postal);
        ad = latlng ? { ...ia, latlng, postal: up.postal } : ia;
        break;
    }
    if (ad !== ia) {
      this._sigInfoAdresse.update(L => L.map(e => e === ia ? ad : e))
    }
  }

}
