import React , {useState, useEffect } from 'react'
import MapViewDirections from 'react-native-maps-directions';
import MapView ,{ PROVIDER_GOOGLE , Marker } from 'react-native-maps';
import { View,  Text , SafeAreaView, TouchableOpacity , StyleSheet , Image ,Animated } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper'
import { icons, COLORS , SIZES,FONTS , GOOGLE_API_KEY } from '../constants';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { mapValues, result, size } from 'lodash';
import { rosybrown } from 'color-name';
import { compareLoose } from 'semver';


const OrderDelivery = ({route , navigation}) => {

    const mapView = React.useRef()

    const [resturant , setResturant] = useState(null)
    const [streetName, setStreetName] = useState("")
    const [fromLocation, setFromLocation] = useState(null)
    const [toLocation, setToLocation] = useState(null)
    const [region, setRegion] = useState(null)
    const [duration, setDuration] = useState(0)
    const [isReady, setIsReady] = useState(false)
    const [angle, setAngle] = useState(0)

    useEffect(() => {
        let {resturant , currentLocation} = route.params;
        let fromLoc = currentLocation.gps;
        let toLoc = resturant.location
        let street = currentLocation.streetName

        let mapRegion ={
            latitude :(fromLoc.latitude + toLoc.latitude)/2 ,
            longitude :(fromLoc.longitude + toLoc.longitude)/2 ,
            latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
            longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2

        }

        setResturant(resturant)
        setStreetName(street)
        setFromLocation(fromLoc)
        setToLocation(toLoc)
        setRegion(mapRegion)

    }, [])

    function calculateAngle(coordinates){
        let startLat = coordinates[0]["latitude"]
        let startLng = coordinates[0]["longitude"]
        let endLat = coordinates[1]["latitude"]
        let endLng = coordinates[1]["longitude"]

        let dx= endLat-startLat
        let dy = endLng -startLng

        return Math.atan2(dy, dx)* 180/ Math.PI
    }

    function zoomIn(){
        let newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta /2 ,
            longitudeDelta:region.longitudeDelta /2 ,
        }

        setRegion(newRegion)
        mapView.current.animateToRegion( newRegion , 200 )
    }
    function zoomOut(){
        let newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta * 2 ,
            longitudeDelta:region.longitudeDelta * 2 ,
        }

        setRegion(newRegion)
        mapView.current.animateToRegion( newRegion , 200 )
    }
    
    function renderMap(){
        const destinationMarker = () =>(
            <Marker coordinate={toLocation} >
                <View style={{
                    height:40,
                    width:40,
                    borderRadius:20,
                    alignItems:'center',
                    justifyContent:'center',
                    backgroundColor:COLORS.white
                }}>
                    <View style={{ 
                        height:30, 
                        width:30,
                        borderRadius:20,
                         alignItems:'center',
                         justifyContent:'center',
                         backgroundColor:COLORS.primary}}>
                        <Image source={icons.pin} style={{width:25, height:25 , tintColor:COLORS.white}} />
                    </View>
                </View>
            </Marker>
        )

        const carIcon =() =>(
            <Marker
                coordinate={fromLocation}
                anchor={{ x: 0.5 , y: 0.5}}
                flat={true}
                rotation={angle}
            >

                <Image
                    source={icons.car}
                    style={{ height:40, width:40 }}
                    
                ></Image>   
            </Marker>
        )

        return (
            <View style={{ flex: 1 }}>
                <MapView
                    ref={mapView}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}
                    style={{ flex: 1 }}
                >
                    <MapViewDirections
                        origin={fromLocation}
                        destination={toLocation}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={5}
                        strokeColor={COLORS.primary}
                        optimizeWaypoints={true}
                        onReady={result => {
                            setDuration(result.duration)

                            if (!isReady) {
                                // Fit route into maps
                                mapView.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        right: (SIZES.width / 20),
                                        bottom: (SIZES.height / 4),
                                        left: (SIZES.width / 20),
                                        top: (SIZES.height / 8)
                                    }
                                })

                                // Reposition the car
                                let nextLoc = {
                                    latitude: result.coordinates[0]["latitude"],
                                    longitude: result.coordinates[0]["longitude"]
                                }

                                if (result.coordinates.length >= 2) {
                                    let angle = calculateAngle(result.coordinates)
                                    setAngle(angle)
                                }

                                setFromLocation(nextLoc)
                                setIsReady(true)
                            }
                        }}
                    />
                    {destinationMarker()}
                    {carIcon()}
                </MapView>
            </View>
        )
    }

    function renderDestinationHeader(){
        return(
            <View style={{
                position:'absolute',
                top:50,
                height:50,
                right:0,
                left:0,
                alignItems:'center',
                justifyContent:'center'
            }}>
                <View style={{
                    flexDirection:'row',
                    alignItems:'center',
                    width:SIZES.width,
                    paddingHorizontal:SIZES.padding*2,
                    paddingVertical:SIZES.padding,
                    borderRadius:SIZES.radius,
                    backgroundColor:COLORS.white

                }}>
                    <Image source= {icons.red_pin} style={{
                        height:30,
                        width:30,
                        marginRight:10                       
                    }}/>

                    <View style={{flex:1}}>
                        <Text style={{...FONTS.body3}}>
                            {streetName}
                        </Text>
                    </View>
                    <Text style={{...FONTS.body3}}>{Math.ceil(duration)} mins</Text>
                </View>
            </View>
        )
    }
    function renderDeliveryInfo(){
        return(
            <View style={{
                position:'absolute',
                bottom:50,
                right:0,
                left:0,
                justifyContent:'center',
                alignItems:'center'
            }}>
                <View 
                    style={{
                        width:SIZES.width * 0.9,
                        paddingHorizontal:SIZES.padding *3 ,
                        paddingVertical:SIZES.padding *2 ,
                        borderRadius:SIZES.radius,
                        backgroundColor:COLORS.white
                    }}
                >
                    <View style={{flexDirection:'row', alignItems:'center'}}>

                        {/*Avatar */}
                        <Image 
                            source={resturant?.courier.avatar}
                            style={{height:50, width:50,borderRadius:25}}
                        />

                        <View style={{flex:1 , marginLeft:SIZES.padding}}>
                            {/*Name and Rating */}
                            <View style={{
                                flexDirection:'row', justifyContent:'space-between'
                            }}
                            >
                                <Text style={{...FONTS.h4}}> {resturant?.courier.name}</Text>
                                <View style={{flexDirection:'row'}}>
                                    <Image source={icons.star} style={{height:18, width:18, tintColor:COLORS.primary}}/>
                                    <Text>{resturant?.rating}</Text>
                                </View>
                            </View>

                            <Text style={{
                                color:COLORS.darkgray,
                                ...FONTS.body4
                            }}>{resturant?.name}</Text>
                        </View>
                    </View>

                    {/*Buttons */}
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'space-between',
                        marginTop:SIZES.padding *2
                    }}>
                        <TouchableOpacity style={{
                            flex:1,
                            height:50,
                            //width:150,
                            marginRight:10,
                            backgroundColor:COLORS.primary,
                            borderRadius:10,
                            alignItems:'center',
                            justifyContent:'center'
                        }}
                        onPress = {()=> navigation.navigate("Home")}
                        >
                            <Text style={{
                                ...FONTS.h4,
                                color:COLORS.white
                            }}> Call</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            flex:1,
                            height:50,
                            //width:150,
                            marginLeft:10,
                            backgroundColor:COLORS.secondary,
                            borderRadius:10,
                            alignItems:'center',
                            justifyContent:'center'
                        }}
                        onPress = {()=> navigation.goBack()}
                        
                        >
                            <Text style={{
                                ...FONTS.h4,
                                color:COLORS.white
                            }}> Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )        
    }

    function renderZoomButtons(){
        return(
            <View
                style={{
                    position:'absolute',
                    bottom:SIZES.height * 0.3,
                    right:SIZES.padding *2 ,
                    width:60,
                    height:130,
                    justifyContent:'space-between'
                }}
            >
                <TouchableOpacity
                    style={{
                        width:60,
                        height:60,
                        borderRadius:SIZES.radius,
                        alignItems:'center',
                        justifyContent:'center',
                        backgroundColor:COLORS.white
                    }}
                    onPress={()=> zoomIn()}
                >
                    <Text style={{...FONTS.h1}}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        width:60,
                        height:60,
                        borderRadius:SIZES.radius,
                        alignItems:'center',
                        justifyContent:'center',
                        backgroundColor:COLORS.white
                    }}

                    onPress={()=> zoomOut()}
                >
                    <Text style={{...FONTS.h1}}>-</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
       <View style={{flex:1}}>
           {renderMap()}
           {renderDestinationHeader()}
           {renderDeliveryInfo()}
           {renderZoomButtons()}
       </View>
 )      
}

export default OrderDelivery
