import React, { useState } from 'react'

import {
    Container, Row, Col,
    Card, CardBody, CardHeader,
    Form, FormGroup, FormInput, Button
} from 'shards-react'
import { Redirect } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import { createUserMutation, authenticateMutation } from '../graphql/auth'


export default function LoginRegister () {
    return (
        <Container>
            <br />
            <Row>
                <Col sm={{ size: 6 }}>
                    <LoginForm />
                </Col>
                <Col sm={{ size: 6 }}>
                    <RegisterForm />
                </Col>
            </Row>
        </Container>
    )
}

function LoginForm () {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [toHome, setToHome] = useState(false)

    const [authenticateAction, { loading }] = useMutation(authenticateMutation, {
        onCompleted: (data) => {
            console.log(data.authenticate)
            localStorage.setItem('auth', JSON.stringify({
                token: data.authenticate.token,
                expiresIn: (data.authenticate.expiresIn * 1000),
            }))
            setToHome(true)
        },
        onError: (error) => {
            console.log(error)
            alert("Ha ocurrido un erro al registrar su usuario")
        }
    })

    return (
        <>
        { toHome ? <Redirect to="/" />: null}
        <Card>
            <CardHeader>Ingresar</CardHeader>
            <CardBody>

                <Form
                    onSubmit={(e) => {
                        e.preventDefault(e)
                        authenticateAction({variables: {input: {
                            password, 
                            username: email, 
                            type: "user"
                        }}})
                    }}
                >
                    <FormGroup>
                        <label htmlFor="#email-login">Email</label>
                        <FormInput 
                            id="#email-login" 
                            type="email" 
                            placeholder="Email" 
                            required={true}
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#password-login">Contraseña</label>
                        <FormInput 
                            type="password" 
                            id="#password-login" 
                            placeholder="Contraseña" 
                            required={true}
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Button type="submit" disabled={loading}>Ingresar</Button>
                    </FormGroup>
                </Form>

            </CardBody>
        </Card>
        </>
    )
}

function RegisterForm () {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [createUserAction, { loading }] = useMutation(createUserMutation, {
        onCompleted: (data) => {
            console.log(data)
            alert("Ahora puede iniciar sesión")
        },
        onError: (error) => {
            console.log(error)
            alert("Ha ocurrido un erro al registrar su usuario")
        }
    })

    return (
        <Card>
            <CardHeader>Registro</CardHeader>
            <CardBody>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault()
                        createUserAction({variables: {input: {
                            name, email, password
                        }}})
                    }}
                >
                    <FormGroup>
                        <label htmlFor="#name-register">Nombre</label>
                        <FormInput 
                            id="#name-register" 
                            placeholder="Nombre" 
                            required={true} 
                            value={name} onChange={(e) => setName(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#email-register">Email</label>
                        <FormInput 
                            id="#email-register" 
                            type="email" 
                            placeholder="Email" 
                            required={true} 
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#password-register">Contraseña</label>
                        <FormInput 
                            type="password" 
                            id="#password-register" 
                            placeholder="Contraseña" 
                            required={true} 
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Button type="submit" disabled={loading}>Registrarse</Button>
                    </FormGroup>
                </Form>
            </CardBody>
        </Card>
    )
}