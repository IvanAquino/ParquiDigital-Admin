import React from 'react'
import PropTypes from 'prop-types'

import {
    Container,
    Card, CardBody,
    Button
} from 'shards-react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import { parkingFeesQuery, deleteParkingFeeMutation } from '../../graphql/parkingFee'

export default function List () {
    const {data, loading } = useQuery(parkingFeesQuery)

    return (
        <Container style={{ marginTop: 10 }}>
            <div className="text-right margin-top20">
                <Link to="/parking-fee-form">Agregar tarifa</Link>
            </div>

            <Card>
                <CardBody>
                    { loading && (
                        <h3 className="text-center">Obteniendo tarifas</h3>
                    )}

                    { !loading && (
                        <TableParkingFees parkingFees={data.parkingFees}/>
                    )}
                </CardBody>
            </Card>
        </Container>
    )
}

function TableParkingFees ({ parkingFees }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Por hora</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {parkingFees.map((item, index) => {
                    return (
                        <RowParkingFee data={item} key={index}/>
                    )
                })}
            </tbody>
        </table>
    )
}
TableParkingFees.propTypes = {
    parkingFees: PropTypes.array.isRequired
}

function RowParkingFee ({ data }) {
    const [ deleteParkingFeeAction, { loading }] = useMutation(deleteParkingFeeMutation, {
        onCompleted: (data) => {
            alert(data.deleteParkingFee)
        },
        onError: (err) => {
            alert("Ha ocurrido un error al eliminar la tarifa")
        },
        refetchQueries: [
            { query: parkingFeesQuery }
        ]
    })
    return (
        <tr>
            <td>{ data.name }</td>
            <td>$ { data.perHour}</td>
            <td className="text-right">
                <Button
                    theme="danger"
                    size="sm"
                    squared
                    disabled={loading}
                    onClick={() => {
                        let confirm = window.confirm("¿Desea eliminar la tarifa?")
                        if ( confirm ) {
                            deleteParkingFeeAction({variables: {input: {
                                parkingFeeId: data._id
                            }}})
                        }
                    }}
                >Eliminar</Button>
            </td>
        </tr>
    )
}
RowParkingFee.propTypes = {
    data: PropTypes.object.isRequired
}