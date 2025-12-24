"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js (if you ever add markers)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapAreaPicker = ({ points = [], onChangePoints, mapKey }) => {
    const mapContainerRef = useRef(null); // The DIV element
    const mapInstanceRef = useRef(null); // The Leaflet Map instance
    const polygonLayerRef = useRef(null); // To track the drawn polygon
    const searchMarkerRef = useRef(null); // To track search result marker

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Search for locations using Nominatim (OpenStreetMap's geocoding service)
    const searchLocation = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    query
                )}&limit=5&countrycodes=in`
            );
            const data = await response.json();
            setSearchResults(data);
            setShowResults(true);
        } catch (error) {
            console.error("Search failed:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle search input with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 3) {
                searchLocation(searchQuery);
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle selecting a search result
    const selectLocation = (result) => {
        if (!mapInstanceRef.current) return;

        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        // Pan and zoom to the selected location
        mapInstanceRef.current.setView([lat, lng], 15);

        // Remove existing search marker
        if (searchMarkerRef.current) {
            mapInstanceRef.current.removeLayer(searchMarkerRef.current);
        }

        // Add a marker at the searched location
        searchMarkerRef.current = L.marker([lat, lng])
            .addTo(mapInstanceRef.current)
            .bindPopup(result.display_name)
            .openPopup();

        // Clear search
        setSearchQuery("");
        setSearchResults([]);
        setShowResults(false);
    };

    // 1. Initialize Map (Runs once per mount)
    useEffect(() => {
        if (mapInstanceRef.current) return; // PREVENTS THE CRASH

        // Create map
        const map = L.map(mapContainerRef.current).setView(
            [28.6139, 77.209], // Default Delhi
            12
        );

        // Add Tile Layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        // Click Handler
        map.on("click", (e) => {
            // We need to access the LATEST points, so we use a functional update
            // or rely on the parent updating the prop.
            // Since this closure is stale, we will trigger the callback directly.
            // We can't access 'points' state here easily without re-initializing map,
            // so we pass the new coordinate up to the parent.
            if (onChangePoints) {
                // We must rely on the parent to merge this new point with existing ones
                // But wait, onChangePoints expects the FULL array.
                // We will handle this by not using the stale 'points' inside this callback.
                // See step 3 for how we sync state.
                // DISPATCH EVENT: We'll use a custom event or ref, but easier:
                // We will access the current points via a ref if needed,
                // OR simpler: The parent function should handle the update.
            }
        });

        mapInstanceRef.current = map;

        // Cleanup on unmount
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []); // Empty dependency array = run once on mount

    // 2. Handle Click Events (Keeps 'points' fresh)
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        // We unbind the old click handler and bind a new one that knows the current 'points'
        mapInstanceRef.current.off("click");
        mapInstanceRef.current.on("click", (e) => {
            const newPoint = { lat: e.latlng.lat, lng: e.latlng.lng };
            onChangePoints([...points, newPoint]);
        });
    }, [points, onChangePoints]);

    // 3. Draw Polygon Updates
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        const map = mapInstanceRef.current;

        // Remove existing polygon layer if it exists
        if (polygonLayerRef.current) {
            map.removeLayer(polygonLayerRef.current);
        }

        if (points.length > 0) {
            const latLngs = points.map((p) => [p.lat, p.lng]);

            // Re-center map if points exist and it's the first load (optional)
            // if (points.length === 1) map.panTo(latLngs[0]);

            if (points.length >= 3) {
                // Draw closed Polygon
                polygonLayerRef.current = L.polygon(latLngs, {
                    color: "blue",
                }).addTo(map);
            } else {
                // Draw Polyline (line) for < 3 points
                polygonLayerRef.current = L.polyline(latLngs, {
                    color: "blue",
                }).addTo(map);
            }
        }
    }, [points]);

    // 4. Force Reset when mapKey changes
    useEffect(() => {
        if (mapKey && mapInstanceRef.current) {
            // If you need to completely reset the map view/state based on key
            // You can do it here, or rely on the parent unmounting/remounting this component.
            // If the parent uses key={mapKey} on the component itself,
            // this component will unmount and remount automatically, triggering step 1.
        }
    }, [mapKey]);

    return (
        <div className="space-y-2">
            {/* Search Bar */}
            <div className="relative">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for a location..."
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <svg
                                    className="animate-spin h-4 w-4 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((result, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => selectLocation(result)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                            >
                                <div className="font-medium text-gray-900 truncate">
                                    {result.display_name.split(",")[0]}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                    {result.display_name}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {showResults &&
                    searchQuery.length >= 3 &&
                    searchResults.length === 0 &&
                    !isSearching && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-gray-500">
                            No locations found
                        </div>
                    )}
            </div>

            <div className="rounded-xl border border-gray-200 overflow-hidden">
                {/* The map attaches to this DIV */}
                <div
                    ref={mapContainerRef}
                    style={{ width: "100%", height: "340px" }}
                    className="z-0" // Ensure z-index doesn't overlap modals
                />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                <span>Click on map to add points (min 3 for polygon).</span>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => onChangePoints(points.slice(0, -1))}
                        disabled={points.length === 0}
                        className="btn-secondary px-3 py-1 text-xs disabled:opacity-60"
                    >
                        Undo
                    </button>
                    <button
                        type="button"
                        onClick={() => onChangePoints([])}
                        disabled={points.length === 0}
                        className="btn-secondary px-3 py-1 text-xs disabled:opacity-60"
                    >
                        Clear
                    </button>
                </div>
                {points.length > 0 && (
                    <span className="text-gray-500">
                        Points: {points.length}
                    </span>
                )}
            </div>
        </div>
    );
};

export default MapAreaPicker;
