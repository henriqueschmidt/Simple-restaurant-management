import React from 'react';
import './foods.css'
import {
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    TextField
} from "@mui/material";
import axios from "axios";
import Button from "@mui/material/Button";
import autoBind from "auto-bind";
import DeleteIcon from '@mui/icons-material/Delete';
import ApiService from "../services/ApiService.js";


class Foods extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            foods: [],
            open: false,
            form: {
                id: null,
                name: '',
                qtd: 0,
            },
            display_error: false,
        };

        this.manage = this.manage.bind(this)
        this.destroy = this.destroy.bind(this)
    }

    async componentDidMount() {
        await this.foods()
    }

    async foods() {
        const foods_request = await ApiService.get('/foods')
        const foods = []
        foods_request.forEach(item => foods.push(item))
        this.setState({ foods, open: false })
    }

    async manage(id = null) {
        if (id) {
            const item = await axios.get(`/api/foods/${id}`)
            if ([200].includes(item.status) ) {
                this.setState({ form: item.data[0] })
                this.setState({ open: true })
            } else {
                this.setState({ display_error: true })
            }
        } else {
            this.setState({ open: true, form: { id: null, name: '', qtd: 0 } })
        }
    }

    handleDialogClose() {
        this.setState({ open: false, form: { id: null, name: '', qtd: 0 } })
    }

    handleName(event) {
        this.setState({ form: { ...this.state.form, name: event.target.value } })
        event.preventDefault();
    }

    handleQtd(event) {
        this.setState({ form: { ...this.state.form, qtd: event.target.value } })
        event.preventDefault();
    }

    async save() {
        const { name, qtd, id } = this.state.form
        if (!name || (!qtd && qtd !== 0)) {
            this.setState({display_error: true})
        } else {
            let item;
            if (id) {
                item = await axios.put(`/api/foods/${id}`, {id, name, qtd})
            } else {
                item = await axios.post(`/api/foods`, {name, qtd})
            }
            if ([201, 200].includes(item.status) ) {
                await this.foods()
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
        const item = await axios.delete(`/api/foods/${id}`)
        if ([200].includes(item.status) ) {
            await this.foods()
        } else {
            this.setState({ display_error: true })
        }
        event.preventDefault()
    }

    render() {
        const list = this.state.foods.map(food => (
            <>
                <ListItem button key={food.id.toString()}>
                    <ListItemText className="row" onClick={() => this.manage(food.id)}>
                        <div className="info">
                            {food.name}
                            <small>quantidade: {food.qtd}</small>
                        </div>
                        <IconButton color="error" aria-label="delete" size="large" onClick={event => this.destroy(event, food.id)}>
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
                    <DialogTitle> { this.state.form.id ? 'Editar' : 'Adcionar' } </DialogTitle>
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
                            value={this.state.form.qtd}
                            onChange={this.handleQtd}
                            label="Quantidade"
                            variant="standard"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogClose}>Cancelar</Button>
                        <Button onClick={this.save}>Salvar</Button>
                    </DialogActions>
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


export default Foods
