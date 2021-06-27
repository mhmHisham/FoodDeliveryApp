import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { View,  Text , SafeAreaView, TouchableOpacity , StyleSheet , Image ,Animated } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper'
import { icons, COLORS , SIZES,FONTS } from '../constants';

const Resturant = ( {route, navigation}) => {

    const scrollX = new Animated.Value(0);
    const [resturant , setResturant] = useState(null)
    const [currentLocation , setCurrentLocation] =useState(null)
    const  [orderItems , setOrderItems] = useState([])
    useEffect(()=> {
        let {item , currentLocation } =route.params;

        setResturant(item)
        setCurrentLocation(currentLocation)
    })

    function editOrder(action , menuId , price){
        let orderList = orderItems.slice()
        let item =orderList.filter(res => res.menuId == menuId);

        if(action == "+"){
            if(item.length > 0){
               let newQty = item[0].qty +1 
               item[0].qty =newQty
               item[0].total = item[0].qty * price  //update total
            }
            else{
                const newItem ={
                    menuId:menuId,
                    qty :1 ,
                    price:price,
                    total:price
                }
                orderList.push(newItem)
            }

            setOrderItems(orderList)
        }else{
            if(item.length > 0){
                if(item[0].qty >0){
                    let newQty = item[0].qty -1
                    item[0].qty = newQty
                    item.total = item[0].qty * price
                }
            }
            setOrderItems(orderList)
        }
    }

    function getOrderQty(menuId){
        let orderItem = orderItems.filter(res => res.menuId == menuId)

        if(orderItem.length > 0){
            return orderItem[0].qty 
        }else{
            return 0
        }
    }

    function getBasketCount(){
        let itemCount = orderItems.reduce((a,b) => a + (b.qty || 0), 0)

        return itemCount
    }

    function sumOrder(){
        let total = orderItems.reduce((a,b) => a+ (b.total || 0) , 0)

        return total.toFixed(2);
    }

    function renderHeader(){
        return(
            <View style={{
                flexDirection:'row'
                }}>
                <TouchableOpacity style={{
                    width:50,
                    paddingLeft:SIZES.padding*2,
                    justifyContent:'center'
                }}
                onPress={() => navigation.goBack()}
                >
                    <Image source={icons.back} resizeMode="contain" style={{width:30 , height:30}} />
                </TouchableOpacity>

                <View style={{ 
                    flex:1 ,
                     alignContent:'center' ,
                    justifyContent:'center' ,
                    paddingLeft:SIZES.padding *6
                     }}> 
                        <View style={{
                            width:'75%',
                            height:50,
                            backgroundColor:COLORS.lightGray3,
                            alignItems:'center',
                            justifyContent:'center',
                            paddingLeft:SIZES.padding,
                            borderRadius:SIZES.radius,
                        }} > 
                            <Text style={{ ...FONTS.h3}} >{resturant?.name}</Text>
                        </View>
                </View>

                <TouchableOpacity style={{
                    width:50,
                    paddingRight:SIZES.padding *2,
                    justifyContent:'center'
                }}>
                    <Image
                        source={icons.list}
                        resizeMode='contain'
                        style={{
                            width:30,
                            height:30
                        }}
                    />
                </TouchableOpacity>
               
            </View>

       )
    }
    function renderFoodInfo(){
        return(
            <Animated.ScrollView 
                horizontal
                pagingEnabled
                scrollEventThrottle={15}
                snapToAlignment='center'
                showsHorizontalScrollIndicator={false}
                onScroll = {Animated.event([
                    {nativeEvent: { contentOffset : {x :scrollX}}}
                ],{useNativeDriver:false})}
            >
                {
                    resturant?.menu.map((item , index) =>(
                        <View style={{alignItems:'center'}} key={`menu-${index}`}>
                            <View style={{
                                height:SIZES.height * 0.5,
                                
                            }}> 
                                {/*Food image*/}
                                <Image
                                    source={item.photo}
                                    resizeMode ='cover'
                                    style={
                                        {
                                            width:SIZES.width,
                                            height:'100%',
                                            borderRadius:SIZES.radius *10,
                                            padding:25,
                                            
                                        }
                                    }
                                />
                                {/* Quatity */}
                                <View style={{
                                    position:'absolute',
                                    height:60,
                                    width:SIZES.width,
                                    bottom:-20,
                                    justifyContent:'center',
                                    //alignItems:'center',
                                    flexDirection:'row'
                                }}>
                                    <TouchableOpacity style={
                                        {
                                            width:50,
                                            backgroundColor:COLORS.white,
                                            justifyContent:'center',
                                            alignItems:'center',
                                            borderBottomLeftRadius:25,
                                            borderTopLeftRadius:25
                                        }
                                    }
                                    onPress={() => editOrder("-" , item.menuId , item.price)}
                                    >
                                        <Text style={{...FONTS.body1}}> - </Text>
                                    </TouchableOpacity>
                                    <View style={
                                        {
                                            width:50,
                                            backgroundColor:COLORS.white,
                                            justifyContent:'center',
                                            alignItems:'center',
                                        }
                                    }>
                                        <Text style={{...FONTS.body2}}> {getOrderQty(item.menuId)} </Text>
                                    </View>

                                    <TouchableOpacity style={
                                        {
                                            width:50,
                                            backgroundColor:COLORS.white,
                                            justifyContent:'center',
                                            alignItems:'center',
                                            borderBottomRightRadius:25,
                                            borderTopRightRadius:25
                                        }           
                                    }
                                    onPress={() => editOrder("+" , item.menuId , item.price)}
                                    >
                                        <Text style={{...FONTS.body1}}> + </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Name and Description */}
                            <View style={
                                {
                                    alignItems:'center',
                                    paddingHorizontal:SIZES.padding*2,
                                    marginTop:25,
                                    width:SIZES.width
                                }
                            }>
                                <Text style={
                                    {...FONTS.body2 ,textAlign:'center',marginVertical:10}
                                }>
                                    {item.name} - ${item.price}
                                </Text>

                                <Text style={{...FONTS.body3}}> {item.description}</Text>

                            </View>

                            {/* Caleries*/}
                            <View style={
                                {
                                    flexDirection:'row',
                                    marginTop:10
                                }
                            }>
                                <Image source={icons.fire} style={
                                    {
                                        height:20,
                                        width:20,
                                        marginRight:10
                                    }
                                } /> 

                                <Text style={{...FONTS.body3 ,color:COLORS.darkgray}}> {item.calories.toFixed(2)} cal</Text>
                            </View>
                        </View> 
                    ))

                    
                }

            </Animated.ScrollView>
        )
    }
    function renderDots(){
        
        const dotPosition = Animated.divide(scrollX, SIZES.width)
        return(
            <View style={{height:30}}>
                <View style={
                    {
                        flexDirection:'row',
                        alignItems:'center',
                        justifyContent:'center',
                        height:SIZES.padding
                    }
                }>
                    {resturant?.menu.map((item , index)=> {
                        
                        const opacity = dotPosition.interpolate({
                            inputRange:[index -1 , index, index +1 ],
                            outputRange:[0.3 , 10 , 0.3],
                            extrapolate:'clamp'
                        })

                        const dotSize = dotPosition.interpolate({
                            inputRange:[index -1 , index , index +1],
                            outputRange : [SIZES.base * 0.8 , 10 , SIZES.base*0.8],
                            extrapolate:'clamp'
                        })

                        const dotColor = dotPosition.interpolate({
                            inputRange:[index-1 , index , index+1],
                            outputRange : [COLORS.darkgray , COLORS.primary , COLORS.darkgray],
                            extrapolate:'clamp'
                        })
                        return(
                            <Animated.View
                                key={`dot-${index}`}
                                opacity={opacity}
                                style={
                                    {
                                        marginHorizontal:6 ,
                                        borderRadius:SIZES.radius,
                                        height:dotSize,
                                        width:dotSize,
                                        backgroundColor:dotColor
                                    }
                                }
                            />
                        )
                    })}
                </View>
            </View>
        )
    }

    function renderOrder(){
        return(
            <View>
                {
                  renderDots()
                }

                <View style={
                    {
                        backgroundColor:COLORS.white,
                        borderTopLeftRadius:40,
                        borderTopRightRadius:40
                    }
                }>
                    <View style={
                        {
                            flexDirection:'row',
                            justifyContent:'space-between',
                            borderBottomColor:COLORS.lightGray2,
                            borderBottomWidth:1,
                            paddingHorizontal:SIZES.padding*3,
                            paddingVertical:SIZES.padding*2
                        }
                    }>
                        <Text style={{...FONTS.body2}}>{getBasketCount()}  Items In Card</Text>
                        <Text style={{...FONTS.body2}}>$ {sumOrder()}</Text>
                    </View>
                    <View style={
                        {
                            flexDirection:'row',
                            justifyContent:'space-between',
                            paddingHorizontal:SIZES.padding*3,
                            paddingVertical:SIZES.padding*2
                        }
                    }>
                        <View style={{flexDirection:'row'}}>
                            <Image 
                                source={icons.pin} 
                                resizeMode='contain' 
                                style={{height:20,width:20,tintColor:COLORS.darkgray}}/>
                            

                            <Text style={{marginLeft:10,...FONTS.h4}}>Location</Text>
                        </View>
                        
                        <View style={{flexDirection:'row'}}>
                            <Image 
                                source={icons.master_card} 
                                resizeMode='contain' 
                                style={{height:20,width:20,tintColor:COLORS.darkgray}}/>
                            <Text style={{marginLeft:10, ...FONTS.h4 , color:COLORS.darkgray}}>**** 0000</Text>
                        </View>
                    </View>

                    <View style={{padding:SIZES.padding*2 , justifyContent:'center' , alignItems:'center'}}>
                        <TouchableOpacity style={{
                            width:SIZES.width * 0.7,
                            padding:SIZES.padding,
                            borderRadius:SIZES.radius,
                            alignItems:'center',
                            backgroundColor:COLORS.primary
                        }}
                        onPress ={() => navigation.navigate("OrderDelivery" , {
                            resturant:resturant,
                            currentLocation:currentLocation
                        })}
                        >
                            <Text style={{ color:COLORS.white , ...FONTS.h2}}>Order</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    return (
    <SafeAreaView style={styles.container }>
        {renderHeader()}
        {renderFoodInfo()}
        {renderOrder()}
    </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container : {
        flex:1 ,
        backgroundColor:COLORS.li
    }
})

export default Resturant
