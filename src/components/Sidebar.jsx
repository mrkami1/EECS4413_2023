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
    IconButton,
    MenuItem,
    Menu,
    Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import {
    Grade,
    ExpandLess,
    ExpandMore,
    BusinessCenter,
    AttachMoney,
    Palette,
    Sort,
} from "@mui/icons-material";

const Sidebar = ({
    sortType,
    setSortType,
    filterColor,
    setFilterColor,
    filterRate,
    setFilterRate,
    filterBrand,
    setFilterBrand,
    filterPrice,
    setFilterPrice,
}) => {
    const [sideBar, setSideBar] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [sortText, setSortText] = useState("Name: A to Z");
    const [sortAnchor, setSortAnchor] = useState(null);
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

    const clearAll= () => {
        setFilterColor("")
        setFilterRate("")
        setFilterBrand("")
        setFilterPrice("")
    }

    const list = (filterColor, filterRate, filterBrand, filterPrice) => (
        <Box sx={{ width: 250 }} role="presentation" onKeyDown={toggleDrawer(false)}>
            <List subheader={<ListSubheader>
                <span>Filtering</span>
                <span>
                    <Button style={{marginLeft: '100px'}} onClick={clearAll}>Clear
                    </Button>
                </span></ListSubheader>}>
                <ListItemButton onClick={() => setShowRating(!showRating)}>
                    <ListItemIcon>
                        <Grade />
                    </ListItemIcon>
                    <ListItemText primary="Rating" />
                    {showRating ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={showRating} timeout="auto" unmountOnExit>
                    <FormControl>
                        <RadioGroup
                            sx={{ pl: 4 }}
                            defaultValue="all"
                            value={filterRate ? filterRate : "all"}
                        >
                            <FormControlLabel
                                value="all"
                                control={<Radio />}
                                label="All ratings"
                                onChange={(e) => {
                                    setFilterRate("");
                                }}
                            />
                            <FormControlLabel
                                value="5"
                                control={<Radio />}
                                label="5 Stars"
                                onChange={(e) => {
                                    console.log(
                                        "this is the value: " + e.currentTarget.dataset.myValue
                                    );
                                    setFilterRate("5");
                                }}
                            />
                            <FormControlLabel
                                value="4"
                                control={<Radio />}
                                label="4 Stars"
                                onChange={(e) => {
                                    setFilterRate("4");
                                }}
                            />
                            <FormControlLabel
                                value="3"
                                control={<Radio />}
                                label="3 Stars"
                                onChange={(e) => {
                                    setFilterRate("3");
                                }}
                            />
                            <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="2 Stars"
                                onChange={(e) => {
                                    setFilterRate("2");
                                }}
                            />
                            <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="1 Star"
                                onChange={(e) => {
                                    setFilterRate("1");
                                }}
                            />
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
                        <RadioGroup
                            sx={{ pl: 4 }}
                            defaultValue="all"
                            value={filterBrand ? filterBrand : "all"}
                        >
                            <FormControlLabel
                                value="all"
                                control={<Radio />}
                                label="All brands"
                                onChange={(e) => {
                                    setFilterBrand("");
                                }}
                            />
                            <FormControlLabel
                                value="aka"
                                control={<Radio />}
                                label="aka"
                                onChange={(e) => {
                                    setFilterBrand("aka");
                                }}
                            />
                            <FormControlLabel
                                value="freedom"
                                control={<Radio />}
                                label="freedom"
                                onChange={(e) => {
                                    setFilterBrand("freedom");
                                }}
                            />
                            <FormControlLabel
                                value="sky"
                                control={<Radio />}
                                label="sky"
                                onChange={(e) => {
                                    setFilterBrand("sky");
                                }}
                            />
                            <FormControlLabel
                                value="spring"
                                control={<Radio />}
                                label="spring"
                                onChange={(e) => {
                                    setFilterBrand("spring");
                                }}
                            />
                            <FormControlLabel
                                value="zeelool"
                                control={<Radio />}
                                label="zeelool"
                                onChange={(e) => {
                                    setFilterBrand("zeelool");
                                }}
                            />
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
                        <RadioGroup
                            sx={{ pl: 4 }}
                            defaultValue="all"
                            value={filterPrice ? filterPrice : "all"}
                        >
                            <FormControlLabel
                                value="all"
                                control={<Radio />}
                                label="All prices"
                                onChange={(e) => {
                                    setFilterPrice("");
                                }}
                            />
                            <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="Under $25"
                                onChange={(e) => {
                                    setFilterPrice("1");
                                }}
                            />
                            <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="$25 to $50"
                                onChange={(e) => {
                                    setFilterPrice("2");
                                }}
                            />
                            <FormControlLabel
                                value="3"
                                control={<Radio />}
                                label="$50 to $100"
                                onChange={(e) => {
                                    setFilterPrice("3");
                                }}
                            />
                            <FormControlLabel
                                value="4"
                                control={<Radio />}
                                label="$100 & up"
                                onChange={(e) => {
                                    setFilterPrice("4");
                                }}
                            />
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
                        <RadioGroup
                            sx={{ pl: 4 }}
                            defaultValue="all"
                            value={filterColor ? filterColor : "all"}
                        >
                            <FormControlLabel
                                value="all"
                                control={<Radio />}
                                label="All colors"
                                onChange={(e) => {
                                    setFilterColor("");
                                }}
                            />
                            <FormControlLabel
                                value="black"
                                control={<Radio />}
                                label="Black"
                                onChange={(e) => {
                                    setFilterColor("black");
                                }}
                            />
                            <FormControlLabel
                                value="white"
                                control={<Radio />}
                                label="White"
                                onChange={(e) => {
                                    setFilterColor("white");
                                }}
                            />
                            <FormControlLabel
                                value="brown"
                                control={<Radio />}
                                label="Brown"
                                onChange={(e) => {
                                    setFilterColor("brown");
                                }}
                            />
                            <FormControlLabel
                                value="pink"
                                control={<Radio />}
                                label="pink"
                                onChange={(e) => {
                                    setFilterColor("pink");
                                }}
                            />
                            <FormControlLabel
                                value="red"
                                control={<Radio />}
                                label="red"
                                onChange={(e) => {
                                    setFilterColor("red");
                                }}
                            />
                            <FormControlLabel
                                value="green"
                                control={<Radio />}
                                label="green"
                                onChange={(e) => {
                                    setFilterColor("green");
                                }}
                            />
                            <FormControlLabel
                                value="blue"
                                control={<Radio />}
                                label="blue"
                                onChange={(e) => {
                                    setFilterColor("blue");
                                }}
                            />
                        </RadioGroup>
                    </FormControl>
                </Collapse>
                <Divider />
            </List>
        </Box>
    );

    const closeSort = (e) => {
        setShowSort(false);
        setSortAnchor(null);
        console.log("this is currentTarget dataset: " + e.currentTarget.dataset.myValue);
        setSortType(e.currentTarget.dataset.myValue);
        if (e.currentTarget.outerText !== "") {
            setSortText(e.currentTarget.outerText);
        }
    };

    // console.log("show color: "+FormControlLabelProps.value)
    const optionBar = () => (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar
                    variant="dense"
                    sx={{ justifyContent: "space-between", backgroundColor: "#757575" }}
                >
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
                                setSortAnchor(e.currentTarget);
                            }}
                            variant="text"
                        >
                            {sortText}&nbsp;
                            <Sort />
                        </Button>
                        <Button
                            variant="contained"
                            color="info"
                            onClick={() => window.location.assign("https://zeelool.com")}
                        >
                            images by zeelool
                        </Button>
                        <Menu
                            id="sort-options"
                            anchorEl={sortAnchor}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={showSort}
                            onClose={closeSort}
                        >
                            <MenuItem onClick={closeSort} data-my-value="PriceAscending">
                                Price: Low to high
                            </MenuItem>
                            <MenuItem onClick={closeSort} data-my-value="PriceDescending">
                                Price: High to low
                            </MenuItem>
                            <MenuItem onClick={closeSort} data-my-value="NameDescending">
                                Name: A to Z
                            </MenuItem>
                            <MenuItem onClick={closeSort} data-my-value="NameAscending">
                                Name: Z to A
                            </MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>

            <Drawer anchor={"left"} open={sideBar} onClose={toggleDrawer(false)}>
                {list(filterColor, filterRate, filterBrand, filterPrice)}
            </Drawer>
        </Box>
    );

    return <>{optionBar()}</>;
};

export default Sidebar;
