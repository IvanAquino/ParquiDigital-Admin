import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import "./App.css"
import { ApolloProvider } from 'react-apollo'
import apolloClient from './graphql/apolloClient'

import LoginRegister from './views/LoginRegister'

import DashboardLayout from './layouts/Dashboard'
import ParkingFeeList from './views/ParkingFee/List'
import ParkingFeeForm from './views/ParkingFee/Form'
import ActiveParkedCars from './views/ActiveParkedCars'

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <div>
          <Switch>
            <Route exact path="/">
              <Redirect to="/parking-fee"/>
            </Route>

            <PrivateRoute path="/parking-fee">
              <DashboardLayout>
                <ParkingFeeList />
              </DashboardLayout>
            </PrivateRoute>
            <PrivateRoute path="/parking-fee-form">
              <DashboardLayout>
                <ParkingFeeForm />
              </DashboardLayout>
            </PrivateRoute>
            <PrivateRoute path="/active-parked-cars">
              <DashboardLayout>
                <ActiveParkedCars />
              </DashboardLayout>
            </PrivateRoute>

            <Route path="/login-register">
              <LoginRegister />
            </Route>
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  );
}

function isAuthenticated () {
  let authData = localStorage.getItem('auth')
    if (!authData) return false
    let auth = JSON.parse(authData)
    if ( auth.expiresIn <= Date.now() ) {
      localStorage.clear()
      return false
    }

    return true
}

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login-register",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}