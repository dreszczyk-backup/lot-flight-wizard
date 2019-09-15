import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Select, Typography, Button, Icon, Card, Col, Row, Tag } from 'antd';
import attractions from '../data/attractions.json';
import places from '../data/places.json';
import Unsplash, { toJson } from 'unsplash-js';
import BackgroundSlider from 'react-background-slider';
import {
    filter,
    isEmpty,
    chunk,
} from 'lodash';

const axios = require('axios');
const placeHolderPhoto = require('../static/500x300.png');

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
    overflow-x: hidden;
    overflow-y: auto;
`;

const BackIcon = styled(Icon)`
    font-size: 20px;
    margin-right: 20px;
    opacity: 0.5;
    position: relative;
    top: -5px;
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
        attractionVenues: [],
        otherVenues: [],
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
            unsplash.search.photos(`${this.state.selectedPlaceName} city`, 1, 5)
                .then(toJson)
                .then(({ results }) => {
                    this.setState({
                        backgroundPhotos: results,
                    })
                });
        }
        if (prevState.step !== this.state.step && this.state.step === 'INFO') {
            this.getAttractionVenues();
            this.getOtherVenues();
        }
        if (prevState.step !== this.state.step && this.state.step !== 'INFO') {
            this.setState({
                attractionVenues: [],
            })
        }
    }

    componentDidMount() {
        console.log(this.state)
    }

    getAuth() {
        return 'client_id=KYPYMMKZMVNIDXKPIPIBECPBCOA5G1EOQ3NH5X1TEXDRX2ZS&client_secret=SRQBC0M5SP2L003IBZU4UTCYP413UCYKHA3JMBR5URHHSN5M&v=20190915';
    }

    getAttractionVenues = () => {
        axios.get(
            `https://api.foursquare.com/v2/venues/search?near=${encodeURIComponent(this.state.selectedPlaceName)}&limit=9&categoryId=${this.state.selectedAttraction}&${this.getAuth()}`
        ).then(({ data: { response } }) => {
            const { venues } = response;
            this.setState({ attractionVenues: venues });
            const venuesDetailsPromises = venues.map(venue => axios.get(
                `https://api.foursquare.com/v2/venues/${venue.id}?${this.getAuth()}`
            ));
            Promise.all(venuesDetailsPromises).then(attractionVenues => {
                this.setState({ attractionVenues: attractionVenues.map(response => ({
                    ...response.data.response.venue,
                })) });
            })
        })
        .catch(function (error) {
            alert('Foursquare API error!', error);
        });
    }

    getOtherVenues = () => {
        axios.get(
            `https://api.foursquare.com/v2/venues/explore?near=${encodeURIComponent(this.state.selectedPlaceName)}&limit=9&&${this.getAuth()}`
        ).then(({ data: { response } }) => {
            const { groups } = response;
            const otherVenues = groups[0].items.map(item => (item.venue));
            this.setState({ otherVenues });
            const groupsDetailsPromises = otherVenues.map(venue => axios.get(
                `https://api.foursquare.com/v2/venues/${venue.id}?${this.getAuth()}`
            ));
            Promise.all(groupsDetailsPromises).then(otherVenues => {
                this.setState({ otherVenues: otherVenues.map(response => ({
                    ...response.data.response.venue,
                })) });
            })
            
        })
        .catch(function (error) {
            alert('Foursquare API error!', error);
        });
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

    getVenuePhoto = (venue) => `${venue.bestPhoto.prefix}500x300${venue.bestPhoto.suffix}`;

    mapChunk = (chunk, index, chunkName) => (
        <Row key={`VenueRow${index}_${chunkName}`} gutter={16} style={{ display: 'flex', marginBottom: '30px' }}>
            {chunk.map(this.mapVenue)}
        </Row>
    )

    mapVenue = (venue) => (
        <Col span={8} key={`VenueCard_${venue.id}`} style={{ display: 'flex' }}>
            <Card
                bordered={false}
                hoverable
                cover={
                    !!venue.bestPhoto
                    ? <img alt={venue.name} src={this.getVenuePhoto(venue)} />
                    : <img alt={venue.name} src={placeHolderPhoto} />
                }
            >
                <Tag
                    color={`#${venue.ratingColor ? venue.ratingColor : '585858'}`}
                    style={{ marginBottom: '15px' }}
                >
                    Rating: {venue.rating ? venue.rating : '-'}
                </Tag>
                <p>
                    <b>{venue.name}</b><br/>
                    {venue.location && venue.location.address}
                </p>
            </Card>
        </Col>
    )

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
                        <BackIcon type="left-square" onClick={this.goToStart} style={{ fontSize: '20px', marginRight: '20px', opacity: '0.5'}} />
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
                                <b>{this.state.selectedAttractionName}</b> in {this.state.selectedPlaceName}
                            </Title>
                        </p>
                        {!!this.state.attractionVenues.length && (
                            chunk(this.state.attractionVenues, 3).map((chunk, index) => this.mapChunk(chunk, index, 'attractionVenues'))
                        )}
                        <p>
                            <Title level={4}>
                                <b>Other attractions</b> in {this.state.selectedPlaceName}
                            </Title>
                        </p>
                        {!!this.state.otherVenues.length && (
                            chunk(this.state.otherVenues, 3).map((chunk, index) => this.mapChunk(chunk, index, 'otherVenues'))
                        )}
                    </ScrollWrapper>
                </PanelWrapper>
            </Wrapper>
        );
    }
}
export { Wizard };