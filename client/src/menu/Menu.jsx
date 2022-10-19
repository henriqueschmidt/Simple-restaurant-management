import React from 'react';
import './menu.css'
import { Box, Divider, IconButton, List, ListItem, ListItemText, Tab, Tabs } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete.js";

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'entradas',
            tabs: [],
            cardapio: {},
        };

        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        const tabs_request = await axios.get('/api/menu-tabs')
        this.setState({tabs: tabs_request.data.map(tab => tab.system_id)})
        const cardapio_request = await axios.get('/api/cardapio')
        const cardapio = {}
        tabs_request.data.forEach(tab => cardapio[tab.system_id] = [])
        cardapio_request.data.forEach(item => {
            cardapio[item.system_id].push(item)
        })
        this.setState({cardapio})
    }

    handleChange(event, newValue) {
        this.setState({tab: newValue});
    }

    render() {
        const listRender = (tab) => {
            if (!this.state.cardapio[tab]) {
                return []
            }
            return this.state.cardapio[tab].map((z, key) => (
                <>
                    <ListItem button key={'menu'+key}>
                        <ListItemText className="row">
                            <div className="info">
                                {z.name}
                                <small> ingredientes: {z.foods}</small>
                            </div>
                            <small>{z.price}</small>
                        </ListItemText>
                    </ListItem>
                    <Divider />
                </>
            ))
        }

        const tabsRender = this.state.tabs.map(tab => (
            <TabPanel
                key={tab}
                value={ tab }
            >

                <List className="list" component="nav" aria-label="mailbox folders">
                    { listRender(tab) }
                </List>
            </TabPanel>))

        return (
            <>
                <Box sx={{ margin: 'auto', marginTop: '5rem', background: '#fff', padding: '1rem', borderRadius: '10px', maxWidth: '500px', width: '100%', typography: 'body1' }}>
                    <TabContext value={this.state.tab}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={this.handleChange} aria-label="lab API tabs example">
                                <Tab label="Entradas" value="entradas" />
                                <Tab label="Pratos principais" value="pratos-principais" />
                                <Tab label="Sobremesas" value="sobremesas" />
                                <Tab label="Bebidas" value="bebidas" />
                            </TabList>
                        </Box>
                        {tabsRender}
                    </TabContext>
                </Box>
            </>
        );
    }
}


export default Menu
