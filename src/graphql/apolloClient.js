import ApolloClient from "apollo-client";
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context'


const wsurl = "ws://localhost:9000/graphql";
const httpurl = "http://localhost:9000/graphql";

const wsLink = new WebSocketLink({
    uri: wsurl,
    options: {
        reconnect: true,
        connectionParams: async () => {
            let authData = localStorage.getItem('auth')
            if (!authData) return {}
            
            try {
                let auth = JSON.parse(authData)
                return {
                    authorization: auth.token
                }
            } catch (err) {
                return {}
            }
        }
    }
});
const httpLink = new HttpLink({
    uri: httpurl,
    credentials: 'same-origin'
});

const authLink = setContext(request => new Promise((resolve, reject) => {
    let authData = localStorage.getItem('auth')
    if (!authData) return resolve({ headers: {} })
    let auth = JSON.parse(authData)
    resolve({
        headers: { authorization: auth.token }
    })
}))

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink),
)

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
});

export default client;