import React from 'react';
import Button from '@mui/material/Button';
import { Alert, IconButton, Snackbar, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './login.css'
import ApiService from "../services/ApiService.js";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            password: '',
            display_password: false,
            display_error: false,
        };

        this.handleUser = this.handleUser.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        localStorage.removeItem('user')
    }

    handleUser(event) {
        this.setState({user: event.target.value});
    }

    handlePassword(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event) {

        const { password, user } = this.state;
        if (!password || !user) {
            return this.setState({ display_error: true });
        }
        ApiService.post(`/login?user=${user}&password=${password}`)
            .then((res) => {
                localStorage.setItem('user', JSON.stringify(res))
                if (res.user_type === 'admin') {
                    window.location.replace('/admin')
                }
                if (res.user_type === 'garcom') {
                    window.location.replace('/garcom')
                }
                if (res.user_type === 'cozinheiro') {
                    window.location.replace('/cozinha')
                }
                if (res.user_type === 'chef') {
                    window.location.replace('/cozinha')
                }
                if (res.user_type === 'bartender') {
                    window.location.replace('/bartender')
                }
                if (['commins', 'maitre'].includes(res.user_type)) {
                    window.location.replace('/')
                }
            })
            .catch((e) => {
                console.log(e)
                this.setState({ display_error: true })
            })

        event.preventDefault();
    }

    handleClickShowPassword(event) {
        this.setState({display_password: !this.state.display_password});
        event.preventDefault();
    }

    handleClose(event) {
        this.setState({display_error: false});
        event.preventDefault();
    }

    render() {
        return (
            <>
                <h1>Restaurante X</h1>
                <form>
                    <TextField value={this.state.user} onChange={this.handleUser} label="Usuário" variant="standard" />
                    <TextField
                        value={this.state.password}
                        type={this.state.display_password ? 'text' : 'password'}
                        onChange={this.handlePassword}
                        label="Senha"
                        variant="standard"
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={this.handleClickShowPassword}
                                    edge="end"
                                >
                                    {this.state.display_password ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            )
                        }}
                    />
                    <Button variant="contained" type="button" onClick={this.handleSubmit}> Entrar </Button>
                </form>
                <Snackbar
                    anchorOrigin={{ horizontal: "center", vertical: "top" }}
                    autoHideDuration={3000}
                    open={this.state.display_error}
                    onClose={this.handleClose}
                    key="topcenter"
                >
                    <Alert severity="error" sx={{ width: '100%' }}>
                        Dados incorretos
                    </Alert>
                </Snackbar>
            </>
        );
    }
}


export default Login
