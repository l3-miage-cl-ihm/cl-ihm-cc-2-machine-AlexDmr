import { Feature, FeatureCollection, Point } from "geojson";
import { LatLng } from "leaflet";

/**
 * Représente une adresse
 * @label Le libellé de l'adresse
 * @city Le nom de la ville de l'adresse
 */
export interface AdresseProperties {
    readonly postal: string,
}

/**
 * Représente une activité possible à faire à une adresse.
 */
export type Activity = "poubelles" | "nettoyage" | "livraison"

/**
 * Associe une adresse à une position géographique et à une activité
 */
export interface InfoAdresse extends AdresseProperties {
    id: number;
    latlng: LatLng
    todo: Activity
}

export const defaultAdresse = { id: -1, postal: "", latlng: new LatLng(0, 0), todo: "poubelles" };

/**
 * Représente une mise à jour à appliquer sur une InfoAdresse
 */
export type UpdateInfoAdresse   = { readonly type: "latlng", readonly latlng: LatLng }
                                | { readonly type: "todo"  , readonly todo: Activity }
                                | { readonly type: "postal", readonly postal: string }

/**
 * Renvoie les coordonnées géographiques d'un point géographique
 * @param pt Le point géographique dont on cherche les coordonnées
 * @returns Les coordonnées géographiques du point
 */
export function getLatLngFromFeaturePoint(pt: Feature<Point, AdresseProperties>): LatLng {
    return new LatLng(pt.geometry.coordinates[1], pt.geometry.coordinates[0]);
}

/**
* Renvoie la promesse des coordonnées géographiques correspondant à une adresse
* @param adresse L'adresse dont on cherche les coordonnées géographiques
* @returns La promesse des coordonnées géographiques correspondant à l'adresse ou undefined si il n'existe pas de coordonnées correspondantes
*/
export function getLatLngFromAdresse(adresse: string): Promise<LatLng | undefined> {
    return fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(adresse)}`).then(
        res => res.status >= 200 && res.status < 400 ? res.json() as Promise<FeatureCollection<Point, AdresseProperties>> : undefined,
        err => { console.error("getLatLngFromAdresse", adresse, "=>", err);  return undefined}
    ).then(
        res => res?.features.find(f => f.type === "Feature" && f.geometry.type === "Point")
    ).then(
        f => f?.geometry.coordinates as [number, number]
    ).then(
        pt => pt ? new LatLng(pt[1], pt[0]) : pt
    );
}


/**
* Renvoie la promesse de l'adresse correspondant à une position géographique
* Limite de 50 appels / seconde/ IP
* @latlng Les coordonnées géographiques du point dont on cherche l'adresse 
* @returns La promesse de l'adresse correspondant à la position géographique ou undefined si il n'existe pas d'adresse correspondante
*/
export function getAdresseFromLatLong({ lat, lng }: LatLng): Promise < string | undefined > {
    return fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${lng}&lat=${lat}`).then(
        res => res.status >= 200 && res.status < 400 ? res.json() as Promise<FeatureCollection<Point, {label: string}>> : undefined,
        err => { console.error("getAdresseFromLatLong", lat, lng, "=>", err);  return undefined}
    ).then(
        res => res?.features.find(f => f.type === "Feature" && f.geometry.type === "Point")?.properties.label
    );
}
