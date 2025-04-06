import { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { ProjectData } from '@/types';

// Define types for Leaflet imports
type LeafletMapInstance = any; // Use 'any' for map instance to avoid complex type definitions
type LeafletCleanupFn = () => void;
type StateCoordinates = Record<string, [number, number]>;
type StateCount = Record<string, number>;

interface MapChartProps {
  data: ProjectData[];
}

export default function MapChart({ data }: MapChartProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);

  // First useEffect just to check for DOM element readiness
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkElement = () => {
      if (mapRef.current && 
          mapRef.current.offsetWidth > 0 && 
          mapRef.current.offsetHeight > 0) {
        setMapInitialized(true);
      } else {
        setTimeout(checkElement, 200);
      }
    };

    checkElement();
  }, []);

  // Second useEffect to initialize map
  useEffect(() => {
    if (!mapInitialized || typeof window === 'undefined') return;

    // Add Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    let mapInstance: LeafletMapInstance = null;
    let cleanupFn: LeafletCleanupFn | null = null;

    // Import Leaflet and create map
    import('leaflet').then((L) => {
      if (!mapRef.current) return;
      
      try {
        // Define bounds for India
        const indiaBounds = L.latLngBounds(
          L.latLng(8.0883, 68.7786),  // Southwest corner
          L.latLng(35.6745, 97.3956)  // Northeast corner
        );
        
        // Create map with pan and zoom bounds
        mapInstance = L.map(mapRef.current, {
          center: [23.5, 80.5], // Center of India
          zoom: 5,
          minZoom: 4,          // Limit how far user can zoom out
          maxZoom: 8,          // Limit how far user can zoom in
          maxBounds: indiaBounds.pad(0.1), // Add some padding to the bounds
          maxBoundsViscosity: 1.0,  // How "hard" the bounds are (1.0 = can't go outside)
          zoomControl: true,
          scrollWheelZoom: true,    // Enable scroll wheel zoom
          dragging: true,           // Enable panning/dragging
        });
        
        // Add tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
          bounds: indiaBounds,  // Restrict tiles to India bounds
        }).addTo(mapInstance);
        
        // State coordinates
        const stateCoordinates: StateCoordinates = {
          "Maharashtra": [19.7515, 75.7139],
          "Gujarat": [22.2587, 71.1924],
          "Karnataka": [15.3173, 75.7139],
          "Tamil Nadu": [11.1271, 78.6569],
          "Rajasthan": [27.0238, 74.2179],
          "Andhra Pradesh": [15.9129, 79.7400],
          "Telangana": [17.1232, 79.2088],
          "Uttar Pradesh": [26.8467, 80.9462],
          "Madhya Pradesh": [22.9734, 78.6569],
          "Haryana": [29.0588, 76.0856],
          "Punjab": [31.1471, 75.3412],
          "Bihar": [25.0961, 85.3131],
          "West Bengal": [22.9868, 87.8550],
          "Odisha": [20.9517, 85.0985],
          "Chhattisgarh": [21.2787, 81.8661],
          "Jharkhand": [23.6102, 85.2799],
          "Delhi": [28.7041, 77.1025]
        };
        
        // Count projects by state
        const stateCount: StateCount = {};
        data.forEach(project => {
          if (project.State) {
            stateCount[project.State] = (stateCount[project.State] || 0) + 1;
          }
        });
        
        // Add markers for states with projects
        const allMarkers: any[] = [];
        
        Object.entries(stateCount)
          .filter(([state]) => state in stateCoordinates)
          .forEach(([state, count]) => {
            const coords = stateCoordinates[state];
            if (!coords) return;
            
            // Calculate radius based on project count
            const radius = Math.min(10 + (Number(count) / 20), 30);
            
            // Add circle marker
            const marker = L.circleMarker([coords[0], coords[1]], {
              radius,
              fillColor: '#8884d8',
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8
            })
              .bindPopup(`<b>${state}</b><br>${count} projects`)
              .addTo(mapInstance);
              
            allMarkers.push(marker);
          });
        
        // Create a bounds object containing all markers
        if (allMarkers.length > 0) {
          const group = L.featureGroup(allMarkers);
          const markerBounds = group.getBounds();
          
          // Only fit bounds if they're valid
          if (markerBounds.isValid()) {
            mapInstance.fitBounds(markerBounds, {
              padding: [30, 30],  // Add padding around the bounds
              maxZoom: 7          // Don't zoom in too far when fitting bounds
            });
          }
        }
        
        // Add zoom control to top-right
        L.control.zoom({
          position: 'topright'
        }).addTo(mapInstance);
        
        // Stop loading
        setIsLoading(false);
        
        // Set up resize handler
        const handleResize = () => {
          if (mapInstance) mapInstance.invalidateSize();
        };
        
        window.addEventListener('resize', handleResize);
        
        // Handle cleanup
        cleanupFn = () => {
          window.removeEventListener('resize', handleResize);
          if (mapInstance) mapInstance.remove();
        };
      } catch (error) {
        console.error("Error creating map:", error);
        setIsLoading(false);
      }
    }).catch(err => {
      console.error("Error loading Leaflet:", err);
      setIsLoading(false);
    });

    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, [mapInitialized, data]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '340px',
        borderRadius: '4px',
        background: '#1a2235',
        overflow: 'hidden'
      }}
    >
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%'
        }} 
      />
      {isLoading && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
} 