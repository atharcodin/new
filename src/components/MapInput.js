import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet'

import L from 'leaflet'; // Same as `import * as L from 'leaflet'` with webpack
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapInput({position, setPosition, changeable}) {
    const center = {
        lat: 2.994384493228549,
        lng: 101.71957969665529,
    }
useEffect(() => {
    if(!changeable) return
    setPosition(center)
    
}, [])
  
    function DraggableMarker() {

        const [draggable, setDraggable] = useState(true)
        const markerRef = useRef(null)
        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current
                    if (marker != null) {
                        setPosition(marker.getLatLng())
                    }
                },
            }),
            [],
        )
        const toggleDraggable = useCallback(() => {
            setDraggable((d) => !d)
        }, [])

        return (
            <Marker
                draggable={changeable}
                eventHandlers={eventHandlers}
                position={position}
                //get marker zoom 

                ref={markerRef}>
                {/* <Popup minWidth={90}>
                    <span onClick={toggleDraggable}>
                        {draggable
                            ? 'Marker is draggable'
                            : 'Click here to make marker draggable'}
                    </span>
                </Popup> */}
            </Marker>
        )
    }
    return (
        <div style={{ height: '400px', borderRadius:'10px', marginTop:'20px' }}>
                                 <label className="form-label text-sm inline-block mb-2 text-gray-500">{changeable ? 'Drag marker to location' : 'Crime location'}</label>

            <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker />
            </MapContainer>
        </div>
    )

}

export default MapInput