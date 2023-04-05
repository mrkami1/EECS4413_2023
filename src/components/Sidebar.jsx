import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    Collapse,
    Divider,
    Drawer,
    FormControl,
    FormControlLabel,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    RadioGroup,
    Radio,
    TextField,
    ListItem,
    IconButton,
    MenuItem,
    Menu,
    Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu"

import {
    MoveToInbox,
    Mail,
    Grade,
    ExpandLess,
    ExpandMore,
    BusinessCenter,
    AttachMoney,
    Palette,
    Sort,
} from "@mui/icons-material";

function Sidebar() {
    const [sideBar, setSideBar] = useState(false);

    const [showSort, setShowSort] = useState(false);
    const [sortAnchor, setSortAnchor] = useState(null)
    const [showRating, setShowRating] = useState(false);
    const [showBrand, setShowBrand] = useState(false);
    const [showPrice, setShowPrice] = useState(false);
    const [showColor, setShowColor] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }
        setSideBar(open);
    };

    const list = () => (
        <Box sx={{ width: 250 }} role="presentation" onKeyDown={toggleDrawer(false)}>
            <List subheader={<ListSubheader>Filtering</ListSubheader>}>
                <ListItemButton onClick={() => setShowRating(!showRating)}>
                    <ListItemIcon>
                        <Grade />
                    </ListItemIcon>
                    <ListItemText primary="Rating" />
                    {showRating ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={showRating} timeout="auto" unmountOnExit>
                    <FormControl>
                        <RadioGroup sx={{ pl: 4 }} defaultValue="all">
                            <FormControlLabel value="all" control={<Radio />} label="All ratings" />
                            <FormControlLabel value="5" control={<Radio />} label="5 Stars" />
                            <FormControlLabel value="4" control={<Radio />} label="4 Stars" />
                            <FormControlLabel value="3" control={<Radio />} label="3 Stars" />
                            <FormControlLabel value="2" control={<Radio />} label="2 Stars" />
                            <FormControlLabel value="1" control={<Radio />} label="1 Star" />
                        </RadioGroup>
                    </FormControl>
                </Collapse>
                <Divider />
                <ListItemButton onClick={() => setShowBrand(!showBrand)}>
                    <ListItemIcon>
                        <BusinessCenter />
                    </ListItemIcon>
                    <ListItemText primary="Brand" />
                    {showBrand ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={showBrand} timeout="auto" unmountOnExit>
                    <FormControl>
                        <RadioGroup sx={{ pl: 4 }} defaultValue="all">
                            <FormControlLabel value="all" control={<Radio />} label="All brands" />
                            <FormControlLabel value="1" control={<Radio />} label="brand 1" />
                            <FormControlLabel value="2" control={<Radio />} label="brand 2" />
                            <FormControlLabel value="3" control={<Radio />} label="brand 3" />
                            <FormControlLabel value="4" control={<Radio />} label="brand 4" />
                            <FormControlLabel value="5" control={<Radio />} label="brand 5" />
                        </RadioGroup>
                    </FormControl>
                </Collapse>
                <Divider />
                <ListItemButton onClick={() => setShowPrice(!showPrice)}>
                    <ListItemIcon>
                        <AttachMoney />
                    </ListItemIcon>
                    <ListItemText primary="Price" />
                    {showPrice ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={showPrice} timeout="auto" unmountOnExit>
                    <FormControl>
                        <RadioGroup sx={{ pl: 4 }} defaultValue="all">
                            <FormControlLabel value="all" control={<Radio />} label="All prices" />
                            <FormControlLabel value="1" control={<Radio />} label="Under $25" />
                            <FormControlLabel value="2" control={<Radio />} label="$25 to $50" />
                            <FormControlLabel value="3" control={<Radio />} label="$50 to $100" />
                            <FormControlLabel value="4" control={<Radio />} label="$100 & up" />
                        </RadioGroup>
                    </FormControl>
                </Collapse>
                <Divider />
                <ListItemButton onClick={() => setShowColor(!showColor)}>
                    <ListItemIcon>
                        <Palette />
                    </ListItemIcon>
                    <ListItemText primary="Color" />
                    {showColor ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={showColor} timeout="auto" unmountOnExit>
                    <FormControl>
                        <RadioGroup sx={{ pl: 4 }} defaultValue="all">
                            <FormControlLabel value="all" control={<Radio />} label="All colors" />
                            <FormControlLabel value="1" control={<Radio />} label="Black" />
                            <FormControlLabel value="2" control={<Radio />} label="White" />
                            <FormControlLabel value="3" control={<Radio />} label="Brown" />
                            <FormControlLabel value="4" control={<Radio />} label="Others" />
                        </RadioGroup>
                    </FormControl>
                </Collapse>
                <Divider />
            </List>
        </Box>
    );

    const closeSort = () => {
        setShowSort(false);
        setSortAnchor(null);
    }

    const optionBar = () => (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar variant="dense" sx={{justifyContent: "space-between", backgroundColor: "#757575"}}>
                    <IconButton 
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div>
                        <Button 
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="sort"
                            aria-controls="sort-options"
                            aria-haspopup="true"
                            sx={{ mr: 2 }}
                            onClick={(e) => {
                                setShowSort(!showSort);
                                setSortAnchor(e.currentTarget)
                            }}
                            variant="text"
                        >
                            Sort&nbsp;
                            <Sort />
                        </Button>
                        <Menu
                            id="sort-options"
                            anchorEl={sortAnchor}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={showSort}
                            onClose={closeSort}
                        >
                            <MenuItem onClick={closeSort}>Price: Low to high</MenuItem>
                            <MenuItem onClick={closeSort}>Price: High to low</MenuItem>
                            <MenuItem onClick={closeSort}>Name: A to Z</MenuItem>
                            <MenuItem onClick={closeSort}>Name: Z to A</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            
            <Drawer anchor={"left"} open={sideBar} onClose={toggleDrawer(false)}>
                {list()}
            </Drawer>
        </Box>
    );

    return <>{optionBar()}</>;
}

export default Sidebar;
