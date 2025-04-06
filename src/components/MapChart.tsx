import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ProjectData } from '@/types';
import { Box, CircularProgress } from '@mui/material';

// Add type definitions for GeoJSON features
interface GeoJSONFeature {
  type: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
}

interface MapChartProps {
  data: ProjectData[];
}

export default function MapChart({ data }: MapChartProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!data || !mapRef.current) return;
    
    // Load Leaflet CSS
    if (typeof window !== 'undefined' && !document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    
    // Initialize the map with a delay to ensure container is ready
    setTimeout(() => {
      if (!mapRef.current) return;
      
      // Clear any existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
      
      // Create new map
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [23.5, 80], // Center of India
        zoom: 4.5,
        zoomControl: true,
        scrollWheelZoom: false,
      });
      
      // Add tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
      
      console.log("Map initialized");
      
      // Use a direct public URL to access the GeoJSON file
      const geoJsonPath = '/data/india_states.geojson';
      console.log("Loading GeoJSON from:", geoJsonPath);
      
      // Use raw fetch instead of L.geoJSON to diagnose issues
      fetch(geoJsonPath)
        .then(response => {
          console.log("GeoJSON response status:", response.status);
          if (!response.ok) {
            throw new Error(`Failed to fetch GeoJSON: ${response.status}`);
          }
          return response.json();
        })
        .then(geojson => {
          setIsLoading(false);
          console.log("GeoJSON loaded, features:", geojson.features?.length || 0);
          
          // Create a project count by state
          const stateCount = {};
          data.forEach(project => {
            if (project.State) {
              stateCount[project.State] = (stateCount[project.State] || 0) + 1;
            }
          });
          
          // Add the GeoJSON with enhanced styling
          L.geoJSON(geojson, {
            style: feature => {
              const stateName = feature.properties?.name;
              const count = stateCount[stateName] || 0;
              
              return {
                fillColor: '#8884d8',
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: count > 0 ? Math.min(0.3 + (count / 100) * 0.6, 0.8) : 0.2
              };
            },
            onEachFeature: (feature, layer) => {
              const stateName = feature.properties?.name;
              const count = stateCount[stateName] || 0;
              
              layer.bindTooltip(
                `<strong>${stateName}</strong><br>${count} projects`,
                { sticky: true }
              );
              
              // Add interactivity
              layer.on({
                mouseover: e => {
                  const layer = e.target;
                  layer.setStyle({
                    weight: 3,
                    color: '#FFFFFF',
                    dashArray: '',
                    fillOpacity: 0.9
                  });
                },
                mouseout: e => {
                  const layer = e.target;
                  const stateName = feature.properties?.name;
                  const count = stateCount[stateName] || 0;
                  
                  layer.setStyle({
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    fillOpacity: count > 0 ? Math.min(0.3 + (count / 100) * 0.6, 0.8) : 0.2
                  });
                }
              });
            }
          }).addTo(mapInstanceRef.current);
          
          console.log("GeoJSON added to map");
        })
        .catch(error => {
          setIsLoading(false);
          console.error("Error loading GeoJSON:", error);
          
          // Fallback: Add a simple marker for top states if GeoJSON fails
          if (mapInstanceRef.current) {
            // Create a project count by state
            const stateCount = {};
            data.forEach(project => {
              if (project.State) {
                stateCount[project.State] = (stateCount[project.State] || 0) + 1;
              }
            });
            
            // India state coordinates (approximate)
            const stateCoordinates = {
              "Maharashtra": [19.7515, 75.7139],
              "Gujarat": [22.2587, 71.1924],
              "Karnataka": [15.3173, 75.7139],
              "Tamil Nadu": [11.1271, 78.6569],
              "Rajasthan": [27.0238, 74.2179],
              "Uttar Pradesh": [26.8467, 80.9462],
              "Andhra Pradesh": [15.9129, 79.7400],
              "Telangana": [17.1232, 79.2088],
              "Haryana": [29.0588, 76.0856],
              "Punjab": [31.1471, 75.3412]
            };
            
            // Add circle markers for top states
            Object.entries(stateCount)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .forEach(([state, count]) => {
                const coords = stateCoordinates[state];
                if (coords && mapInstanceRef.current) {
                  L.circleMarker(coords as [number, number], {
                    radius: Math.min(10 + (count / 20), 30),
                    fillColor: '#8884d8',
                    color: '#ffffff',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                  })
                    .bindTooltip(`<strong>${state}</strong><br>${count} projects`)
                    .addTo(mapInstanceRef.current);
                }
              });
            
            console.log("Fallback markers added");
          }
        });
    }, 500);
    
    return () => {
      // Clean up
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <div style={{ position: 'relative', height: '340px', width: '100%' }}>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '340px',
          borderRadius: '4px',
          opacity: isLoading ? 0.6 : 1
        }} 
      />
      {isLoading && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)'
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </div>
  );
} 