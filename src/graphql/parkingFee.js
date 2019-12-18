import gql from 'graphql-tag'

export const createParkingFeeMutation = gql`
mutation createParkingFee ($input: CreateParkingFeeRequest) {
    createParkingFee (input: $input) {
        _id
    }
}
`

export const deleteParkingFeeMutation = gql`
mutation deleteParkingFee ($input: DeleteParkingFeeRequest) {
    deleteParkingFee (input: $input)
}
`

export const parkingFeesQuery = gql`
query parkingFees {
    parkingFees {
        _id
        area {
            type
            coordinates
        }
        name
        perHour
    }
}
`