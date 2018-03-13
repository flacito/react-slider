/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  Dimensions,
  StyleSheet,
  Image,
  View,
  Animated,
} from 'react-native';
import ReactTimeout from 'react-timeout'

const images = [
  require('./images/lunge-1.png'),
  require('./images/lunge-2.png'),
  require('./images/lunge-3.png'),
];

const windowWidth = Dimensions.get('window').width + Dimensions.get('window').width * .20
const windowHeight = Dimensions.get('window').height

type Props = {

};

class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      imageIndex: 0,
      isUp: true,
      bounceValue: new Animated.Value(0),
    }
  }

  componentWillMount() {
    this.props.setInterval(this.nextExercise, 1000);
    this.setState({
      bounceValue: new Animated.Value(0),
    });
    this.slide();
  }

  componentWillUnmount() {
    this.props.clearInterval();
  }

  slide = () => {
    Animated.spring(this.state.bounceValue, {
      toValue: windowWidth,
      delay: 1500,
      bounciness: 15,
      speed: .5,
    }).start();
  };

  render() {
    this.slide();
    return (
      <Animated.View style={[
        styles.container,
        {
          transform: [
            {translateY: this.state.bounceValue},
          ]
        }
      ]} >
        <View style={styles.background} >
          <Image
            style={styles.images}
            source={images[this.state.imageIndex]}
          />
        </View>
      </Animated.View>
    );
  }

  nextExercise = () => {
    var curr = this.state.imageIndex;
    this.state.isUp ? curr = curr + 1 : curr = curr - 1;
     if (curr > images.length - 1) {
       this.setState({isUp: false});
       curr = images.length - 1;
     }
     else if (curr < 0) {
       this.setState({isUp: true});
       curr = 0;
     }

     this.setState({
       imageIndex: curr,
     })
   }

}

export default ReactTimeout(App)

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: 35,
    width: windowWidth,
    overflow: 'hidden', // for hide the not important parts from circle
    margin: 10,
    height: windowWidth / 2,
  },
  background: { // this shape is a circle
    borderRadius: windowWidth * 2, // border borderRadius same as width and height
    width: windowWidth * 2,
    height: windowWidth * 2,
    marginLeft: -windowWidth / 2, // reposition the circle inside parent view
    position: 'absolute',
    bottom: 0, // show the bottom part of circle
    overflow: 'hidden', // hide not important part of image
  },
  images: {
    height: windowWidth / 2, // same width and height for the container
    width: windowWidth,
    position: 'absolute', // position it in circle
    bottom: 0, // position it in circle
    marginLeft: windowWidth / 2, // center it in main view same value as marginLeft for circle but positive
    resizeMode: 'contain',
  }
});
