import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Select, Typography, Button, Icon } from 'antd';
import attractions from '../data/attractions.json';
import places from '../data/places.json';
import Unsplash, { toJson } from 'unsplash-js';
import BackgroundSlider from 'react-background-slider';
import {
    filter,
    isEmpty,
} from 'lodash';
const fetchUrl = require("fetch").fetchUrl;

const LOTLogo = require('../static/logo_lot_en.svg')

const unsplash = new Unsplash({
    applicationId: "60bd3cb41b4ce4c3f984e0b577dc379854334c7eba448ca5b452aff7cf4c119e",
    secret: "f0a17a135eb476a8c046fd559fc24a5be15b2a9e54de42b00c4d0d8d3ad17fd7"
});

const { Title } = Typography;
const { Option } = Select;

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;

const PanelWrapper = styled.div`
    min-width: 50vw;
    max-width: 950px;
    max-height: 90vh;
    padding: 30px 70px 60px 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: linear-gradient(180deg,rgba(255,255,255,0.9) 31%,rgba(255,255,255,0.5) 100%);
    backdrop-filter: blur(10px) saturate(300%);
    box-shadow: 0 70px 80px rgba(0, 0, 0, 0.4);
    position: absolute;
    &.panel {
        transition: 0.6s all cubic-bezier(0.445, 0.05, 0.55, 0.95);
        transform: translate(0, -30vh);
        opacity: 0;
        pointer-events: none;
        &.active {
            transform: translate(0, 0);
            opacity: 1;
            pointer-events: all;
        }
    }
`;

const Logo = styled.img`
    width: 200px;
    height: auto;
    margin-bottom: 20px;
`;

const ScrollWrapper = styled.div`
    overflow: auto;
`;

class Wizard extends Component {
    state = {
        step: 'START',
        attractions,
        places,
        selectedPlace: undefined,
        selectedPlaceName: undefined,
        selectedPlaceDescription: undefined,
        selectedAttraction: undefined,
        backgroundPhotos: [{
            "urls": {
                "raw": "https://images.unsplash.com/photo-1544413695-46b2aa55efeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "full": "https://images.unsplash.com/photo-1544413695-46b2aa55efeb?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "regular": "https://images.unsplash.com/photo-1544413695-46b2aa55efeb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "small": "https://images.unsplash.com/photo-1544413695-46b2aa55efeb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "thumb": "https://images.unsplash.com/photo-1544413695-46b2aa55efeb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ"
            }
        }, {
            "urls": {
                "raw": "https://images.unsplash.com/photo-1544413526-87d1ea5ccc41?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "full": "https://images.unsplash.com/photo-1544413526-87d1ea5ccc41?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "regular": "https://images.unsplash.com/photo-1544413526-87d1ea5ccc41?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "small": "https://images.unsplash.com/photo-1544413526-87d1ea5ccc41?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "thumb": "https://images.unsplash.com/photo-1544413526-87d1ea5ccc41?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ"
            },
        }, {
            "urls": {
                "raw": "https://images.unsplash.com/photo-1544413611-73915c47be20?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "full": "https://images.unsplash.com/photo-1544413611-73915c47be20?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "regular": "https://images.unsplash.com/photo-1544413611-73915c47be20?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "small": "https://images.unsplash.com/photo-1544413611-73915c47be20?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "thumb": "https://images.unsplash.com/photo-1544413611-73915c47be20?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ"
            },
        }, {
            "urls": {
                "raw": "https://images.unsplash.com/photo-1544413660-299165566b1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "full": "https://images.unsplash.com/photo-1544413660-299165566b1d?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "regular": "https://images.unsplash.com/photo-1544413660-299165566b1d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "small": "https://images.unsplash.com/photo-1544413660-299165566b1d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "thumb": "https://images.unsplash.com/photo-1544413660-299165566b1d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ"
            },
        }, {
            "urls": {
                "raw": "https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "full": "https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "regular": "https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "small": "https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ",
                "thumb": "https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjkxNTIzfQ"
            },
        }],
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedPlace !== this.state.selectedPlace) {
            // unsplash.search.photos(`${placeName} city`, 1, 5)
            //     .then(toJson)
            //     .then(({ results }) => {
            //         this.setState({
            //             backgroundPhotos: results,
            //         })
            //     });
        }
        if (prevState.step !== this.state.step && this.state.step === 'INFO') {
            fetchUrl(
                `https://api.foursquare.com/v2/venues/search?near=${this.state.selectedPlaceName}&categoriId=${this.state.selectedAttraction}&client_id=KYPYMMKZMVNIDXKPIPIBECPBCOA5G1EOQ3NH5X1TEXDRX2ZS&client_secret=SQJYJ44OGKPK34C5CI4ISHSBF3Y0XMN0ZUKMR2IVGH0R3RA0&v=20190915`,
                { method: 'GET' },
                (error, meta, body) => {
                    if (body) {
                        console.log(body.toString());
                    } else {
                        console.log('no body');
                        
                    }
                }
            )
        }
    }

    componentDidMount() {
        console.log(this.state)
    }

    updateAttraction = (selectedAttraction) => {
        const selectedAttractionObj = filter(
            this.state.attractions,
            attraction => attraction.id === selectedAttraction
        )[0];
        const selectedAttractionName = selectedAttractionObj.name;
        this.setState({
            selectedAttraction,
            selectedAttractionName,
        })
    }

    updatePlace = (selectedPlace) => {
        const selectedPlaceObj = filter(
            this.state.places,
            place => place.id === selectedPlace
        )[0];
        const selectedPlaceName = selectedPlaceObj.name;
        const selectedPlaceDescription = selectedPlaceObj.description;
        this.setState({
            selectedPlace,
            selectedPlaceName,
            selectedPlaceDescription,
        })
    }

    goToStart = () => {
        this.setState({
            step: 'START'
        });
    }

    goToInfos = () => {
        this.setState({
            step: 'INFO'
        });
    }

    mapBackgroundPhotos = () => {
        if (isEmpty(this.state.backgroundPhotos)) {
            return [
                'https://images.unsplash.com/photo-1542359649-31e03cd4d909?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1867&q=80',
                'https://images.unsplash.com/photo-1521336575822-6da63fb45455?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
                'https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1&auto=format&fit=crop&w=1678&q=80',
            ];
        }
        return this.state.backgroundPhotos.map(photo => photo.urls.regular);
    }

    getClassName = (panelName) => this.state.step === panelName ? 'panel active' : 'panel'

    render() {
        return (
            <Wrapper>
                <BackgroundSlider
                    images={this.mapBackgroundPhotos()}
                    duration={5}
                    transition={3}
                    style={{
                        opacity: '0.5',
                    }}
                />
                <PanelWrapper className={this.getClassName('START')}>
                    <Logo src={LOTLogo} />
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', margin: '0 15px' }}>
                            <Title level={3}>
                                Pick your destination
                            </Title>
                            <Select
                                value={this.state.selectedPlace}
                                onChange={this.updatePlace}
                                style={{ width: '300px' }}
                                placeholder="Destination"
                                optionFilterProp="children"
                                showSearch
                            >
                            {this.state.places.map(place => (
                                <Option
                                    key={`PlaceOption_${place.id}`}
                                    value={place.id}
                                >
                                    {place.name}
                                </Option>
                            ))}
                            </Select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', margin: '0 15px' }}>
                            <Title level={3}>
                                Pick your attraction
                            </Title>
                            <Select
                                value={this.state.selectedAttraction}
                                onChange={this.updateAttraction}
                                style={{ width: '300px' }}
                                placeholder="Attraction"
                                optionFilterProp="children"
                                showSearch
                            >
                            {this.state.attractions.map(attraction => (
                                <Option
                                    key={`AttractionOption_${attraction.id}`}
                                    value={attraction.id}
                                >
                                    {attraction.name}
                                </Option>
                            ))}
                            </Select>
                        </div>
                    </div>
                    {this.state.selectedAttraction && this.state.selectedPlace && (
                        <Button
                            size="large"
                            type="primary"
                            icon="smile"
                            onClick={this.goToInfos}
                            style={{
                                marginTop: '25px'
                            }}
                        >
                            Discover {this.state.selectedAttractionName} in {this.state.selectedPlaceName}
                        </Button>
                    )}
                </PanelWrapper>
                <PanelWrapper className={this.getClassName('INFO')} >
                    <Title level={1} style={{ textAlign: 'left', verticalAlign: 'middle' }}>
                        <Icon type="rollback" onClick={this.goToStart} />
                        <b>Discover {this.state.selectedPlaceName}</b> with <Logo style={{ display: 'inline', width: '150px', marginBottom: '0' }} src={LOTLogo} />
                    </Title>
                    <p>
                        <Title level={4}>
                            <b>About {this.state.selectedPlaceName}</b>
                        </Title>
                        {this.state.selectedPlaceDescription}
                    </p>
                    <ScrollWrapper>
                        <p>
                            <Title level={4}>
                                <b>{this.state.selectedAttractionName}</b>
                            </Title>
                            {this.state.selectedPlaceDescription}
                        </p>
                        <p>
                            <Title level={4}>
                                <b>{this.state.selectedAttractionName}</b>
                            </Title>
                            {this.state.selectedPlaceDescription}
                        </p>
                        <p>
                            <Title level={4}>
                                <b>{this.state.selectedAttractionName}</b>
                            </Title>
                            {this.state.selectedPlaceDescription}
                        </p>
                        <p>
                            <Title level={4}>
                                <b>{this.state.selectedAttractionName}</b>
                            </Title>
                            {this.state.selectedPlaceDescription}
                        </p>
                        <p>
                            <Title level={4}>
                                <b>{this.state.selectedAttractionName}</b>
                            </Title>
                            {this.state.selectedPlaceDescription}
                        </p>
                    </ScrollWrapper>
                </PanelWrapper>
            </Wrapper>
        );
    }
}
export { Wizard };