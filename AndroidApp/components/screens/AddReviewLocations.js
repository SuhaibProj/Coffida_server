import React from 'react'
import { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, FlatList, ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem, Body, Left, Thumbnail, Right} from 'native-base';

export default class AddReviewLocations extends Component {
    constructor (props) {
        super(props)
        this.state = {
            locationData: [],
            notFollowing: true,
            location_id: '',
            arrow: '>'
        }
    }

    componentDidMount = async() => {
        this.getLocations();
    }


    getLocations = async () => {
        const session = await AsyncStorage.getItem('@session_token')
        return fetch ('http://10.0.2.2:3333/api/1.0.0/find', {
            headers: {'Content-Type': 'application/json', 'X-Authorization': session,},
        })
        .then((response) => {
            if(response.status === 200) { return response.json(); }
            else if (response.status === 400){ throw "Bad Request"; }
            else if (response.status === 401){ throw "Unauthorised"; }
            else if (response.status === 500){ throw "Server Error"; }
            else{ throw 'Something didnt work'; }
        })
        .then((responseJSON) => {
            this.setState({
                locationData: responseJSON,
            })
            this.state.locationData.toString()
            console.log('The Entire Location Details are:', this.state.locationData )
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    }

/* <Right style = {{justifyContent: 'center'}}>
<TouchableOpacity onPress={() => checkFollowing(item.location_id)}>
    <Image
        style={styleCSS.hearts}
        resizeMode='contain'
        source={ this.state.notFollowing == true ? 
            require('../Images/H.png') : require('../Images/H_RED.png')}
    />
</TouchableOpacity>
</Right> */

    render() {
        let locationDetails = async(location_id) => {
            await AsyncStorage.setItem('@location_id', JSON.stringify(location_id));
            console.log("The Location ID for this is: ",location_id);
            this.props.navigation.navigate('AddReview');
        }

        return (
            <View style = {styleCSS.container}>
                <Text style ={styleCSS.title}>Select Location to Add Review</Text>
                <FlatList
                    data={this.state.locationData}
                    keyExtractor={item => item.location_id.toString()}
                    renderItem={({item}) => (  
                        <ListItem key={item.location_id} avatar>
                            <Left>
                                <TouchableOpacity onPress={() => locationDetails(item.location_id)}>
                                    <Thumbnail source={require('../Images/WC_1.png')}/>
                                </TouchableOpacity>
                            </Left>
                            <Body>
                                <TouchableOpacity onPress={() => locationDetails(item.location_id)}>
                                    <Text style = {{fontSize: 20}}>{item.location_name}</Text>
                                    <Text style = {{color: 'grey'}} note>{item.location_town}</Text>
                                </TouchableOpacity>
                            </Body>
                            <Right>
                                <Text style={{color: 'grey'}}>{this.state.arrow}</Text>
                            </Right>
                        </ListItem>
                    )}    
                />
            </View>
        );
    }
}


const styleCSS = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#cccccc',
    },
    title: {
        marginVertical: 30,
        fontSize: 20,
        alignSelf: 'center',
    },
    textDetails: {
        alignSelf: 'center',
    },
    button: {
        alignSelf: 'center',
        marginVertical: 10,
        width: '75%', 
        backgroundColor: "#808080",
        padding: 10,
        marginBottom: 30,
    },
});
