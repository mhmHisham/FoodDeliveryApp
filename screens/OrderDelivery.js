import React , {useState, useEffect } from 'react'

import MapView, { PROVIDER_GOOGLE , Marker } from 'react-native-maps';
import { View,  Text , SafeAreaView, TouchableOpacity , StyleSheet , Image ,Animated } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper'
import { icons, COLORS , SIZES,FONTS , GOOGLE_API_KEY } from '../constants';


const OrderDelivery = ({route , navigation}) => {

    const [resturant , setResturant] = useState(null)
    const [streetName, setStreetName] = useState("")
    const [fromLocation, setFromLocation] = useState(null)
    const [toLocation, setToLocation] = useState(null)
    const [region, setRegion] = useState(null)

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

    function renderMap(){
        return(
            <View  style={{flex:1}}>
                <MapView provider={PROVIDER_GOOGLE} initialRegion={region} style={{flex:1}} >

                </MapView>
            </View>
        )
    }

    return (
       <View style={{flex:1}}>
           {renderMap()}
       </View>
 )      
}

export default OrderDelivery
