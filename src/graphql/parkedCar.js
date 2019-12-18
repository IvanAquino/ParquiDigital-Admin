import gql from 'graphql-tag'

export const activeParkedCarsQuery = gql`
query activeParkedCars {
    activeParkedCars {
        client {
            name
        }
        finishAt
        licensePlate
        location {
            type
            coordinates
        }
    }
}
`

export const createdParkedCarSubscription = gql`
subscription createdParkedCar {
    createdParkedCar {
        client {
            name
        }
        finishAt
        licensePlate
        location {
            type
            coordinates
        }
    }
}
`