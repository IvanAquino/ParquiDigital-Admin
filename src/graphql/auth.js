import gql from 'graphql-tag'

export const authenticateMutation = gql`
mutation authentication ($input: AuthenticationRequest) {
  authenticate (input:$input) {
    expiresIn
    token
  }
}
`
export const createUserMutation = gql`
mutation createUser ($input: CreateUserRequest) {
  createUser(input: $input) {
    _id
    name
  }
}
`