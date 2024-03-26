import { CommonModule } from '@angular/common';
import { Component, Signal, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LatLng, Layer, latLng, tileLayer } from 'leaflet';
import { AdresseService } from './adresse.service';
import { getMarker } from './data/marker';
import { Activity, InfoAdresse, UpdateInfoAdresse } from './data/adresse';
import { AdresseComponent } from './adresse/adresse.component';
import { FormsModule } from '@angular/forms';

type FctFilter = (info: InfoAdresse) => boolean

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, LeafletModule, AdresseComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Signal primaire permettant d'initialiser le niveau de zoom de la carte
  readonly sigZoom   = signal<number>(11);

  // Signal primaire permettant de fixer le centre de la carte sur un point géographique.
  readonly sigCenter = signal<LatLng>(latLng(45.184947, 5.735399));

  // Signal primaire contenant une liste de couches à afficher sur la carte
  // Ne pas le modifier, ce signal permet d'obtenir la carte de base
  private readonly _sigLayerMap = signal<readonly Layer[]>([
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
  ]);

  // Signal dérivé permettant de construire la liste de toutes les couches (Layers) à afficher sur la carte
  // Utilisez ce signal pour ajouter les marqueurs (qui sont des Layers particuliers)
  readonly sigLayers = computed<Layer[]>(() => [
    ...this._sigLayerMap(),
    // Insérer les marqueurs ici
  ]);

  constructor() { }
  
}
