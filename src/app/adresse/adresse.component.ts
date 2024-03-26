import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, computed, ViewChild, ElementRef, OnDestroy, effect } from '@angular/core';
import { Activity, InfoAdresse, UpdateInfoAdresse, getLatLngFromAdresse } from '../data/adresse';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FormsModule } from '@angular/forms';
import { LatLng, Layer, LeafletMouseEvent, Map as LeafletMap, Marker, tileLayer } from 'leaflet';
import { getMarker } from '../data/marker';
import { toObservable, toSignal } from "@angular/core/rxjs-interop"
import { BehaviorSubject, Observable, ReplaySubject, Subject, combineLatest, delay, distinctUntilChanged, filter, map, startWith, switchMap, tap } from 'rxjs';
import { recenter } from '../data/leaflet.utils';
import { getObsResize } from '../data/rxjs';

@Component({
  selector: 'app-adresse',
  standalone: true,
  imports: [
    CommonModule, LeafletModule, FormsModule
  ],
  templateUrl: "./adresse.component.html",
  styleUrl: './adresse.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdresseComponent {
  // La liste des activités possibles
  readonly todos: readonly Activity[] = ["poubelles", "nettoyage", "livraison"];

  readonly sigLayers = computed<Layer[]>(() => [
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
  ]);

}
