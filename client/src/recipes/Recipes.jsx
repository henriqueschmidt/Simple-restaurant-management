import React from 'react';
import './recipes.css'
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
    ListItemText, MenuItem, OutlinedInput, Select,
    Snackbar,
    TextField
} from "@mui/material";
import axios from "axios";
import Button from "@mui/material/Button";
import autoBind from "auto-bind";
import DeleteIcon from '@mui/icons-material/Delete';

class Recipes extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            recipes: [],
            open: false,
            form: {
                id: null,
                name: '',
                price: 0,
                menu_tab_id: 0,
                foods: [],
            },
            display_error: false,
            tabs: [],
            foods: [],
        };

        this.manage = this.manage.bind(this)
        this.destroy = this.destroy.bind(this)
    }

    async componentDidMount() {
        await this.recipes()
    }

    async recipes() {
        const recipes_request = await axios.get('/api/recipes')
        const recipes = []
        recipes_request.data.forEach(item => recipes.push(item))
        this.setState({ recipes, open: false })
    }

    async manage(id = null) {
        const tabs = await axios.get('/api/menu-tabs')
        this.setState({ tabs: tabs.data })
        const foods = await axios.get('/api/foods')
        this.setState({ foods: foods.data })
        if (id) {
            const item = await axios.get(`/api/recipes/${id}`)
            if ([200].includes(item.status) ) {
                const data = item.data[0]
                data.foods.forEach(z => z.food_id = z.food_id+'')
                this.setState({ form: data })
                this.setState({ open: true })
            } else {
                this.setState({ display_error: true, form: { id: null, name: '', qtd: 0, foods: [] } })
            }
        } else {
            this.setState({ open: true, form: { id: null, name: '', qtd: 0, foods: [] } })
        }
    }

    handleDialogClose() {
        this.setState({ open: false, form: { id: null, name: '', qtd: 0, foods: [] } })
    }

    handleName(event) {
        this.setState({ form: { ...this.state.form, name: event.target.value } })
        event.preventDefault();
    }

    async save() {
        const { name, price, foods, menu_tab_id, id } = this.state.form
        if (!name || !price || foods.length === 0 || !menu_tab_id) {
            this.setState({display_error: true})
        } else {
            let item;
            if (id) {
                item = await axios.put(`/api/recipes/${id}`, {id, name, price, foods, menu_tab_id})
            } else {
                item = await axios.post(`/api/recipes`, {name, price, foods, menu_tab_id})
            }
            if ([201, 200].includes(item.status) ) {
                await this.recipes()
            } else {
                this.setState({ display_error: true })
            }
        }
    }

    handleClose(event) {
        this.setState({display_error: false});
        event.preventDefault();
    }

    handleTab(event) {
        this.setState({ form: { ...this.state.form, menu_tab_id: event.target.value } });
        event.preventDefault();
    }

    handlePrice(event) {
        this.setState({ form: { ...this.state.form, price: event.target.value } });
        event.preventDefault();
    }

    async destroy(event, id) {
        const item = await axios.delete(`/api/recipes/${id}`)
        if ([200].includes(item.status) ) {
            await this.recipes()
        } else {
            this.setState({ display_error: true })
        }
        event.preventDefault()
    }

    addFood(event) {
        const foods = this.state.form.foods
        foods.push({ id: null, qtd: 1 })
        this.setState({form: { ...this.state.form, foods}})
        event.preventDefault()
    }

    handleFood(event, key) {
        const foods = this.state.form.foods
        foods[key].food_id = event.target.value
        this.setState({form: { ...this.state.form, foods}})
        event.preventDefault()
    }

    handleFoodQtd(event, key) {
        const foods = this.state.form.foods
        foods[key].qtd = event.target.value
        this.setState({form: { ...this.state.form, foods}})
        event.preventDefault()
    }

    destroyFood(event, key) {
        const foods = this.state.form.foods
        foods.splice(key, 1)
        this.setState({form: { ...this.state.form, foods}})
        event.preventDefault()
    }

    render() {
        const list = this.state.recipes.map(food => (
            <>
                <ListItem button key={food.id.toString()}>
                    <ListItemText className="row" onClick={() => this.manage(food.id)}>
                        <div className="info">
                            {food.name}
                            <small> ingredientes: {food.foods}</small>
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
                <section className="recipes">
                    <Button onClick={() => this.manage()} variant="contained"> Adicionar </Button>
                    <List className="list" component="nav" aria-label="mailbox folders">
                        {list}
                    </List>
                </section>
                <Dialog open={this.state.open} maxWidth="md" fullWidth onClose={this.handleDialogClose}>
                    <DialogTitle> { this.state.form.id ? 'Editar' : 'Adcionar' } </DialogTitle>
                    <DialogContent className="dialog-content">
                        <div className="info">
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
                                value={this.state.form.price}
                                onChange={this.handlePrice}
                                label="Preço"
                                variant="standard"
                                fullWidth
                            />
                            <FormControl fullWidth  variant="standard">
                                <InputLabel id="demo-simple-select-label"> Tab </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={this.state.form.menu_tab_id}
                                    label="Tab"
                                    onChange={this.handleTab}
                                >
                                    { this.state.tabs.map(tab => (<MenuItem key={'tab-' + tab.id} value={tab.id}> { tab.name } </MenuItem>)) }

                                </Select>
                            </FormControl>
                        </div>
                        <div className="foods">
                            <Button variant="contained" onClick={this.addFood}> Adicionar ingrediente </Button>
                            {
                                this.state.form.foods.map((food, key) => (
                                    <>
                                        <div className="food" key={'foood-'+food}>
                                            <FormControl fullWidth  variant="standard">
                                                <InputLabel id="demo-simple-select-label"> Tab </InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={this.state.form.foods[key].food_id || ''}
                                                    label="Tab"
                                                    onChange={event => this.handleFood(event, key)}
                                                >
                                                    { this.state.foods.map(food2 => (<MenuItem key={'food-' + food2.id} value={food2.id}> { food2.name } </MenuItem>)) }

                                                </Select>
                                            </FormControl>

                                            <TextField
                                                autoFocus
                                                value={this.state.form.foods[key].qtd || 1}
                                                onChange={event => this.handleFoodQtd(event, key)}
                                                label="Quantidade"
                                                variant="standard"
                                                fullWidth
                                            />
                                            <IconButton color="error" aria-label="delete" size="large" onClick={event => this.destroyFood(event, key)}>
                                                <DeleteIcon fontSize="inherit" />
                                            </IconButton>
                                        </div>
                                    </>
                                ))
                            }
                        </div>
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


export default Recipes
