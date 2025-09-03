import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { LatLngExpression, LatLng, Icon } from 'leaflet';
import { HiHome, HiOfficeBuilding, HiLocationMarker, HiTruck, HiClock } from 'react-icons/hi';
import { FaCar } from 'react-icons/fa';
import IconWrapper from './IconWrapper';
import 'leaflet/dist/leaflet.css';

// Import des icônes custom
import homeCustomIcon from '../assets/icons/home-custom.svg';
import entrepriseCustomIcon from '../assets/icons/entreprise-custom.svg';
import routeCustomIcon from '../assets/icons/route-custom.svg';
import timeCustomIcon from '../assets/icons/time-custom.svg';

// Fix pour les icônes Leaflet par défaut
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuration des icônes par défaut
const DefaultIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icône personnalisée pour la maison (noire)
const HomeIcon = new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#141414">
      <path fill-rule="evenodd" d="M2.52 7.823C2 8.77 2 9.915 2 12.203v1.522c0 3.9 0 5.851 1.172 7.063S6.229 22 10 22h4c3.771 0 5.657 0 6.828-1.212S22 17.626 22 13.725v-1.521c0-2.289 0-3.433-.52-4.381c-.518-.949-1.467-1.537-3.364-2.715l-2-1.241C14.111 2.622 13.108 2 12 2s-2.11.622-4.116 1.867l-2 1.241C3.987 6.286 3.038 6.874 2.519 7.823M11.25 18a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-1.5 0z" clip-rule="evenodd"/>
    </svg>
  `)}`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Icône personnalisée pour l'entreprise (rose)
const OfficeIcon = new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#E91E63">
      <path fill-rule="evenodd" d="M21.25 8.5c0-1.404 0-2.107-.337-2.611a2 2 0 0 0-.552-.552c-.441-.295-1.034-.332-2.115-.336q.005.438.004.91V7.25h1a.75.75 0 0 1 0 1.5h-1v1.5h1a.75.75 0 0 1 0 1.5h-1v1.5h1a.75.75 0 0 1 0 1.5h-1v6.5h-1.5V6c0-1.886 0-2.828-.586-3.414S14.636 2 12.75 2h-2c-1.886 0-2.828 0-3.414.586S6.75 4.114 6.75 6v15.25h-1.5v-6.5h-1a.75.75 0 0 1 0-1.5h1v-1.5h-1a.75.75 0 0 1 0-1.5h1v-1.5h-1a.75.75 0 0 1 0-1.5h1V5.91q-.001-.47.004-.91c-1.081.005-1.674.042-2.115.337a2 2 0 0 0-.552.552C2.25 6.393 2.25 7.096 2.25 8.5v12.75h-.5a.75.75 0 0 0 0 1.5h20a.75.75 0 0 0 0-1.5h-.5zM9 11.75a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75m0 3a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75m2.75 3.5a.75.75 0 0 1 .75.75v2.25H11V19a.75.75 0 0 1 .75-.75M9 6.25a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4A.75.75 0 0 1 9 6.25m0 3a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4A.75.75 0 0 1 9 9.25" clip-rule="evenodd"/>
    </svg>
  `)}`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

interface Coordinates {
  lat: number;
  lng: number;
}

interface InteractiveMapProps {
  userAddress: string;
}

interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}

// Type pour le mode de transport (voiture uniquement)
type TransportMode = 'driving';

// Interface pour les résultats de routing OSRM
interface OSRMRoute {
  distance: number; // en mètres
  duration: number; // en secondes
  geometry: string; // polyline encodée
}

interface OSRMResponse {
  routes: OSRMRoute[];
  code: string;
}

// Résultat de trajet calculé
interface RouteResult {
  distance: number; // en km
  duration: number; // en minutes
  polyline: LatLng[]; // points du tracé
  mode: TransportMode;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ userAddress }) => {
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [recruiterAddress, setRecruiterAddress] = useState('');
  const [recruiterCoords, setRecruiterCoords] = useState<Coordinates | null>(null);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fonction de géocodage utilisant Nominatim (OpenStreetMap)
  const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`
      );
      const data: GeocodingResult[] = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      return null;
    }
  };

  // Décoder une polyline encodée (format Google/OSRM)
  const decodePolyline = (encoded: string): LatLng[] => {
    const points: LatLng[] = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b: number;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push(new LatLng(lat / 1e5, lng / 1e5));
    }

    return points;
  };

  // Calculer la route avec OSRM (mode voiture uniquement)
  const calculateRoute = async (start: Coordinates, end: Coordinates): Promise<RouteResult | null> => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=polyline`;
      
      const response = await fetch(url);
      const data: OSRMResponse = await response.json();
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const polyline = decodePolyline(route.geometry);
        
        return {
          distance: route.distance / 1000, // convertir en km
          duration: route.duration / 60, // convertir en minutes
          polyline,
          mode: 'driving'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors du calcul de route:', error);
      return null;
    }
  };

  // Géocoder l'adresse utilisateur au chargement
  useEffect(() => {
    const initializeMap = async () => {
      setIsLoading(true);
      setError(null);
      
      const coords = await geocodeAddress(userAddress);
      if (coords) {
        setUserCoords(coords);
      } else {
        setError('Impossible de localiser votre adresse');
      }
      
      setIsLoading(false);
    };

    if (userAddress) {
      initializeMap();
    }
  }, [userAddress]);

  // Rechercher l'adresse du recruteur et calculer la route
  const handleRecruiterSearch = async () => {
    if (!recruiterAddress.trim() || !userCoords) return;
    
    setSearchLoading(true);
    setError(null);
    
    const coords = await geocodeAddress(recruiterAddress);
    if (coords) {
      setRecruiterCoords(coords);
      
      // Calculer la route en voiture
      try {
        const result = await calculateRoute(userCoords, coords);
        setRouteResult(result);
      } catch (error) {
        console.error('Erreur lors du calcul de la route:', error);
        setError('Erreur lors du calcul du trajet');
        setRouteResult(null);
      }
    } else {
      setError('Adresse du recruteur non trouvée');
      setRecruiterCoords(null);
      setRouteResult(null);
    }
    
    setSearchLoading(false);
  };

  // Réinitialiser la recherche
  const handleReset = () => {
    setRecruiterAddress('');
    setRecruiterCoords(null);
    setRouteResult(null);
    setError(null);
  };

  // Formater la durée en heures et minutes
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`;
    }
  };

  if (isLoading) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>Localisation de votre adresse...</p>
      </div>
    );
  }

  if (!userCoords) {
    return (
      <div className="map-error">
        <IconWrapper IconComponent={HiLocationMarker} size={48} color="#ef4444" />
        <p>Impossible de localiser l'adresse : {userAddress}</p>
      </div>
    );
  }

  // Centre de la carte
  const center: LatLngExpression = recruiterCoords 
    ? [(userCoords.lat + recruiterCoords.lat) / 2, (userCoords.lng + recruiterCoords.lng) / 2]
    : [userCoords.lat, userCoords.lng];

  return (
    <div className="interactive-map">
      {/* Sections en ligne */}
      <div className="sections-map-container">
        {/* Section Mon Adresse */}
        <div className="address-section-black">
          <div className="address-item">
            <div className="address-icon-container">
              <img src={homeCustomIcon} alt="Mon adresse" className="address-icon" />
            </div>
            <span className="address-value">{userAddress}</span>
          </div>
        </div>

        {/* Section Votre Entreprise */}
        <div className="company-section-black">
          <div className="company-item">
            <div className="company-icon-container">
              <img src={entrepriseCustomIcon} alt="Votre entreprise" className="company-icon" />
            </div>
            <div className="company-input-group">
              <input
                type="text"
                value={recruiterAddress}
                onChange={(e) => setRecruiterAddress(e.target.value)}
                placeholder="Entrez l'adresse de l'entreprise..."
                className="address-input"
                onKeyPress={(e) => e.key === 'Enter' && handleRecruiterSearch()}
              />
              
            </div>
          </div>
          
          
        </div>
        <div className="search-buttons">
                <button 
                  onClick={handleRecruiterSearch}
                  disabled={!recruiterAddress.trim() || searchLoading}
                  className="search-btn"
                >
                  {searchLoading ? 'Recherche...' : 'Calculer le trajet'}
                </button>
                {(recruiterCoords || routeResult) && (
                  <button onClick={handleReset} className="reset-btn">
                    Effacer
                  </button>
                )}
              </div>
              {error && (
            <div className="map-error-message">
              {error}
            </div>
          )}
      </div>

      {/* Carte */}
      <div className="map-container">
        <MapContainer
          center={center}
          zoom={recruiterCoords ? 11 : 13}
          style={{ height: '400px', width: '100%' }}
          className="leaflet-map grayscale-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Marqueur domicile */}
          <Marker position={[userCoords.lat, userCoords.lng]} icon={HomeIcon}>
            <Popup>
              <div className="popup-content">
                <div className="popup-header">
                  <IconWrapper IconComponent={HiHome} style={{ marginRight: '0.5rem' }} />
                  <strong>Mon domicile</strong>
                </div>
                <p>{userAddress}</p>
              </div>
            </Popup>
          </Marker>

          {/* Marqueur entreprise */}
          {recruiterCoords && (
            <Marker position={[recruiterCoords.lat, recruiterCoords.lng]} icon={OfficeIcon}>
              <Popup>
                <div className="popup-content">
                  <div className="popup-header">
                    <IconWrapper IconComponent={HiOfficeBuilding} style={{ marginRight: '0.5rem' }} />
                    <strong>Entreprise</strong>
                  </div>
                  <p>{recruiterAddress}</p>
                  {routeResult && (
                    <>
                      <p><strong>Distance :</strong> {routeResult.distance.toFixed(1)} km</p>
                      <p><strong>Temps (voiture) :</strong> {formatDuration(routeResult.duration)}</p>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          )}

          {/* Tracé de la route */}
          {routeResult && routeResult.polyline.length > 0 && (
            <Polyline
              pathOptions={{
                color: '#E91E63',
                weight: 5,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round'
              }}
              positions={routeResult.polyline}
            />
          )}
        </MapContainer>
      </div>

      {/* Section résultats de trajet en bas de la carte */}
      {routeResult && (
        <div className="route-results-section">
          <div className="route-results-content">
            <div className="route-results-icon-container">
            <img src={routeCustomIcon} alt="Voiture" className="custom-icon" />
            <span className="route-results-title">En voiture</span>
            </div>
            <div className="route-stats-container">
            <div className="route-stat-distance">
              <span className="route-stat-value">{routeResult.distance.toFixed(1)} km</span>
            </div>
            <div className="route-stat">
              <img src={timeCustomIcon} alt="Temps" className="custom-icon-time" />
              <span className="route-stat-value">{formatDuration(routeResult.duration)}</span>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
