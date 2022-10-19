import React from 'react';
import './users.css'
import {
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider, FormControl,
    IconButton, InputLabel,
    List,
    ListItem,
    ListItemText, MenuItem, Select,
    Snackbar,
    TextField
} from "@mui/material";
import axios from "axios";
import Button from "@mui/material/Button";
import autoBind from "auto-bind";
import DeleteIcon from '@mui/icons-material/Delete';
import ApiService from "../services/ApiService.js";


class Users extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            users: [],
            user_types: [],
            open: false,
            form: {
                id: null,
                name: '',
                email: '',
                password: '',
                user_type_id: '',
                username: '',
            },
            display_error: false,
        };

        this.manage = this.manage.bind(this)
        this.destroy = this.destroy.bind(this)
    }

    async componentDidMount() {
        await this.users()
    }

    async users() {
        const request = await ApiService.get('/users')
        const users = []
        request.forEach(item => users.push(item))
        this.setState({ users, open: false, form: {
                id: null,
                name: '',
                email: '',
                password: '',
                user_type_id: '',
                username: '',
            }, })
    }

    async manage(id = null) {
        const user_types = await ApiService.get(`/user-types`)
        this.setState({user_types})
        if (id) {
            const item = await axios.get(`/api/users/${id}`)
            if ([200].includes(item.status) ) {
                this.setState({ form: item.data[0] })
                this.setState({ open: true })
            } else {
                this.setState({ display_error: true })
            }
        } else {
            this.setState({ open: true, form: { id: null, name: '', email: '', password: '', user_type_id: '', username: '' } })
        }
    }

    handleDialogClose() {
        this.setState({ open: false, form: { id: null, name: '', email: '', password: '', user_type_id: '', username: '' } })
    }

    handleName(event) {
        this.setState({ form: { ...this.state.form, name: event.target.value } })
        event.preventDefault();
    }

    handleUsername(event) {
        this.setState({ form: { ...this.state.form, username: event.target.value } })
        event.preventDefault();
    }

    handleEmail(event) {
        this.setState({ form: { ...this.state.form, email: event.target.value } })
        event.preventDefault();
    }

    handleUserType(event) {
        this.setState({ form: { ...this.state.form, user_type_id: event.target.value } })
        event.preventDefault();
    }

    handlePassword(event) {
        this.setState({ form: { ...this.state.form, password: event.target.value } })
        event.preventDefault();
    }

    async save() {
        const { name, username, email, password, user_type_id, id } = this.state.form
        if (!name || !username || !email || (!password && !id) || !user_type_id) {
            this.setState({display_error: true})
        } else {
            let item;
            if (id) {
                item = await axios.put(`/api/users/${id}`, {name, username, email, user_type_id, id})
            } else {
                item = await axios.post(`/api/users`, {name, username, email, password, user_type_id})
            }
            if ([201, 200].includes(item.status) ) {
                await this.users()
            } else {
                this.setState({ display_error: true })
            }
        }
    }

    handleClose(event) {
        this.setState({display_error: false});
        event.preventDefault();
    }

    async destroy(event, id) {
        const item = await axios.delete(`/api/users/${id}`)
        if ([200].includes(item.status) ) {
            await this.users()
        } else {
            this.setState({ display_error: true })
        }
        event.preventDefault()
    }

    render() {
        const list = this.state.users.map(user => (
            <>
                <ListItem button key={user.id.toString()}>
                    <ListItemText className="row" onClick={() => this.manage(user.id)}>
                        <div className="info">
                            {user.name}
                            <small> {user.type}</small>
                        </div>
                        <IconButton color="error" aria-label="delete" size="large" onClick={event => this.destroy(event, user.id)}>
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </ListItemText>
                </ListItem>
                <Divider />
            </>
        ))

        return (
            <>
                <section className="foods">
                    <Button onClick={() => this.manage()} variant="contained"> Adicionar </Button>
                    <List className="list" component="nav" aria-label="mailbox folders">
                        {list}
                    </List>
                </section>
                <Dialog open={this.state.open} maxWidth="xs" fullWidth onClose={this.handleDialogClose}>
                    { this.state.form &&
                        <>
                            <DialogTitle> { this.state?.form?.id ? 'Editar' : 'Adcionar' } </DialogTitle>
                            <DialogContent className="dialog-content">
                                <TextField
                                    autoFocus
                                    value={this.state.form.name}
                                    onChange={this.handleName}
                                    label="Nome"
                                    variant="standard"
                                    fullWidth
                                />
                                <TextField
                                    autoFocus
                                    value={this.state.form.username}
                                    onChange={this.handleUsername}
                                    label="Username"
                                    variant="standard"
                                    fullWidth
                                />
                                <TextField
                                    autoFocus
                                    value={this.state.form.email}
                                    onChange={this.handleEmail}
                                    label="Email"
                                    variant="standard"
                                    fullWidth
                                />
                                <FormControl fullWidth  variant="standard">
                                    <InputLabel id="demo-simple-select-label"> Type </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={this.state.form.user_type_id}
                                        label="User type"
                                        onChange={this.handleUserType}
                                    >
                                        { this.state.user_types.map(type => (<MenuItem key={'type-' + type.id} value={type.id}> { type.name } </MenuItem>)) }

                                    </Select>
                                </FormControl>
                                {
                                    !this.state.form.id &&
                                    <TextField
                                        autoFocus
                                        value={this.state.form.password}
                                        onChange={this.handlePassword}
                                        label="Senha"
                                        type="password"
                                        variant="standard"
                                        fullWidth
                                    />
                                }


                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleDialogClose}>Cancelar</Button>
                                <Button onClick={this.save}>Salvar</Button>
                            </DialogActions>
                        </>

                    }
                </Dialog>
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


export default Users
