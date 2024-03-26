import { Observable } from "rxjs"

/**
 * Renvoie un observable des changements de taille d'un élément HTML
 * Cet observable émet la valeur v à chaque changement de taille de l'élément e
 * @param e L'élément HTML dont on veut observer les changements de taille
 * @param v La valeur à émettre à chaque changement de taille
 * @returns Un observable des changements de taille de l'élément
 */
export function getObsResize<T>(e: HTMLElement, v: T): Observable<T> {
    return new Observable<T>(subscriber => {
        const resizeObs = new ResizeObserver(() => subscriber.next(v))
        resizeObs.observe(e)
    })
}
