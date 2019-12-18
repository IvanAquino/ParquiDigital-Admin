import React, { useState, Fragment } from 'react'

import {
    Container, Card, CardBody
} from 'shards-react'

import MapGL, { Source, Layer, Marker } from '@urbica/react-map-gl';
import { useQuery } from 'react-apollo';
import { parkingFeesQuery } from '../graphql/parkingFee';
import { activeParkedCarsQuery, createdParkedCarSubscription } from '../graphql/parkedCar';
import { mapboxKey, mapboxStyle } from '../config/mapbox';

export default function ActiveParkedCars () {

    const { activeParkedCars } = useActiveParkedCars()
    const { parkingFees } = useParkingFees()

    const [viewport, setViewport] = useState({
        latitude: 17.067997,
        longitude: -96.720192,
        zoom: 16
    })

    const renderActiveParkedCars = function (activeParkedCars) {
        if ( !activeParkedCars ) return null

        return activeParkedCars.map((item, index) => {
            return (
                <Marker
                    key={`marker-${index}`}
                    latitude={item.location.coordinates[1]}
                    longitude={item.location.coordinates[0]}
                >
                    <div style={markerStyle}>
                        {item.licensePlate}
                    </div>
                </Marker>
            )
        })
    }
    const renderParkingFees = function (parkingFees) {
        if ( !parkingFees ) return null

        return parkingFees.map((item, index) => {
            return (
            <Fragment key={index}>
                <Source 
                    id={`geo-${index}`}
                    type="geojson" 
                    data={{
                        type: 'Feature',
                        geometry: {
                            type: item.area.type,
                            coordinates: item.area.coordinates
                        }
                    }} 
                />
                <Layer
                    id={`geo-${index}`}
                    type="fill"
                    source={`geo-${index}`}
                    paint={{
                        'fill-color': '#dd4b4b',
                        'fill-opacity': 0.3
                    }} 
                />
            </Fragment>
            )
        })
    }

    return (
        <Container style={{ marginTop: 20 }}>
            <Card>
                <MapGL
                    style={{ width: "100%", height: "700px" }}
                    mapStyle={mapboxStyle}
                    accessToken={mapboxKey}
                    {...viewport}
                    onViewportChange={(viewport) => setViewport(viewport)}
                >
                    { renderActiveParkedCars(activeParkedCars ) }
                    { renderParkingFees(parkingFees ) }
                </MapGL>
            </Card>
        </Container>
    )
}

function useActiveParkedCars () {
    const { data, error, loading, subscribeToMore } = useQuery(activeParkedCarsQuery, { pollInterval: (1000 * 60 * 5) })

    subscribeToMore({
        document: createdParkedCarSubscription,
        updateQuery: (prev, { subscriptionData }) => {
            return Object.assign({}, prev, {
                activeParkedCars: [subscriptionData.data.createdParkedCar, ...prev.activeParkedCars]
            })
        }
    })

    return {
        activeParkedCars: (!!data) ? data.activeParkedCars : null,
        errorActiveParkedCars: error,
        loadingActiveParkedCars: loading
    }
}
function useParkingFees () {
    const { data, error, loading } = useQuery(parkingFeesQuery)

    return {
        parkingFees: (!!data) ? data.parkingFees : null,
        errorParkingFees: error,
        loadingParkingFees: loading
    }
}

const markerStyle = {
    padding: '3px',
    color: '#fff',
    cursor: 'pointer',
    background: '#7C42FF',
    borderRadius: '6px',
    fontWeight: 'bold'
};