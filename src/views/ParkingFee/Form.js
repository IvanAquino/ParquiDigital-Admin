import React, { useState } from 'react'

import {
    Container,
    Card, CardHeader, CardBody,
    Form, FormGroup, FormInput,
    Button
} from 'shards-react'
import { withRouter } from 'react-router-dom'

import MapGL from '@urbica/react-map-gl';
import Draw from '@urbica/react-map-gl-draw';

import { useMutation } from 'react-apollo';
import { createParkingFeeMutation, parkingFeesQuery } from '../../graphql/parkingFee';
import { mapboxKey, mapboxStyle } from '../../config/mapbox';

function FormParkingFee (props) {

    const [area, setArea] = useState(null)
    const [name, setName] = useState('')
    const [perHour, setPerHour] = useState('')
    const [viewport, setViewport] = useState({
        latitude: 17.067997,
        longitude: -96.720192,
        zoom: 16
    })
    const [drawMode, setDrawMode] = useState("simple_select")
    const [drawControlRef, setDrawControlRef] = useState("simple_select")
    const [ createParkingFeeAction, { loading }] = useMutation(createParkingFeeMutation, {
        onCompleted: (data) => {
            console.log(data)
            props.history.push("/parking-fee")
        },
        onError: (error) => {
            console.log(error)
            alert("Ha ocurrido un error al registrar la tarifa")
        },
        refetchQueries: [
            { query: parkingFeesQuery }
        ]
    })

    return (
        <Container style={{ marginTop: 20 }}>
            <Card>
                <CardHeader>Nueva Tarifa</CardHeader>
                <CardBody>
                    <Form onSubmit={(e) => {
                        e.preventDefault()
                        createParkingFeeAction({variables: {input: {
                            name,
                            perHour: parseFloat(perHour),
                            area: area.geometry
                        }}})
                    }}>
                        <FormGroup>
                            <label htmlFor="#name">Nombre tarifa</label>
                            <FormInput 
                                id="#name" 
                                placeholder="Nombre tarifa" 
                                required={true} 
                                value={name} onChange={(e) => setName(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label htmlFor="#perhour">Tarifa por hora</label>
                            <FormInput 
                                id="#perhour" 
                                type="number" step="0.01"
                                placeholder="Tarifa por hora" 
                                required={true}
                                value={perHour} onChange={(e) => setPerHour(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <p className="text-center">
                                Dibuja el área en donde se aplicará la tarifa
                            </p>
                            <div className="text-center">
                                { drawMode !== "draw_polygon" && !area && (
                                    <Button onClick={() => setDrawMode('draw_polygon')} type="button">Comenzar a dibujar</Button>
                                )}
                                { drawMode === "draw_polygon" && !area && (
                                    <>
                                    <p className="text-center">Para finalizar el dibujo haz doble clic</p>
                                    <Button onClick={() => setDrawMode('simple_select')} type="button" theme="warning">Cancelar</Button>
                                    </>
                                )}
                                { drawMode !== "draw_polygon" && !!area && (
                                    <Button theme="danger" onClick={() => {
                                        drawControlRef._draw.deleteAll()
                                        setArea(null)
                                    }} type="button">Eliminar area</Button>
                                )}
                            </div>
                            <MapGL
                                style={{ width: "100%", height: "400px" }}
                                mapStyle={mapboxStyle}
                                accessToken={mapboxKey}
                                {...viewport}
                                onViewportChange={(viewport) => setViewport(viewport)}
                            >
                                <Draw
                                    ref={draw => setDrawControlRef(draw)}
                                    mode={drawMode}
                                    combineFeaturesControl={false}
                                    lineStringControl={false}
                                    pointControl={false}
                                    polygonControl={false}
                                    trashControl={false}
                                    uncombineFeaturesControl={false}
                                    onDrawModeChange={({ mode }) => setDrawMode(mode)}
                                    onDrawCreate={({features}) => setArea(features[0])}
                                    onDrawUpdate={({features}) => setArea(features[0])}
                                />
                            </MapGL>
                        </FormGroup>

                        <FormGroup className="text-center">
                            <Button type="submit" theme="success" disabled={loading}>Guardar tarifa</Button>
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
        </Container>
    )
}

export default withRouter(FormParkingFee)