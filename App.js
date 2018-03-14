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
  StatusBar,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';
import ReactTimeout from 'react-timeout';
import * as Progress from 'react-native-progress';

import * as Workout from './workout.js';

const windowWidth = Dimensions.get('window').width + Dimensions.get('window').width * .20;
const windowHeight = Dimensions.get('window').height;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      exerciseIndex: 0,
      exerciseTitle: Workout.moveExercises.exerciseArray[0].title,
      nextTitle: Workout.moveExercises.exerciseArray[1].title,
      images: Workout.moveExercises.exerciseArray[0].imageArray,
      imageIndex: 0,
      isUp: true,
      bounceImage: new Animated.Value(0),
      bounceHeader: new Animated.Value(0),
      fadeNextText: new Animated.Value(0),
    }
  }

  componentWillMount() {
    StatusBar.setBarStyle('light-content', true)
    this.props.setInterval(this.nextImage, 750);
    this.setState({
      bounceImage: new Animated.Value(-circleSize - 35),
      bounceHeader: new Animated.Value(0),
      fadeNextText: new Animated.Value(0),
    });
  }

  componentWillUnmount() {
    this.props.clearInterval();
  }

  render() {
    return (
      <View style={styles.main}>

        <Animated.View style={[
          styles.header,
          {
            transform: [
              {translateY: this.state.bounceHeader},
            ]
          }
        ]}>
          <Text style={styles.headerText}>
            {this.state.exerciseTitle}
          </Text>
        </Animated.View>

        <Animated.View style={[
          styles.container,
          {
            transform: [
              {translateY: this.state.bounceImage},
            ]
          }
        ]} >
          <View style={styles.background} >
            <Image
              style={styles.images}
              source={this.state.images[this.state.imageIndex]}
            />
          </View>
        </Animated.View>

        <View style={styles.progressContainer}>
          <View style={styles.progress}>
            <Progress.Bar progress={0.4} width={Dimensions.get('window').width-30} height={40} color='white' />
          </View>
          <View style={styles.progress}>
            <Progress.Bar progress={.75} width={Dimensions.get('window').width-30} height={12} color='orange' />
          </View>
          <Animated.Text style={[
            styles.nextText,
            {
              opacity: this.state.fadeNextText,
            }
          ]}>
            Next: {this.state.nextTitle}
          </Animated.Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.conceal}>
            <Text style={styles.buttonText}>
              Simulate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  reveal = () => {
    StatusBar.setBarStyle('dark-content', true)

    if (this.state.exerciseIndex == 0) {
      this.setState({
        imageIndex: 0,
        exerciseIndex: 1,
        exerciseTitle: Workout.moveExercises.exerciseArray[1].title,
        nextTitle: Workout.moveExercises.exerciseArray[0].title,
      });
    }
    else {
      this.setState({
        exerciseIndex: 0,
        exerciseTitle: Workout.moveExercises.exerciseArray[0].title,
        nextTitle: Workout.moveExercises.exerciseArray[1].title,
      });
    }

    Animated.spring(this.state.bounceImage, {
      toValue: 100,
      bounciness: 5,
      speed: .5,
    }).start();

    Animated.spring(this.state.bounceHeader, {
      toValue: circleSize + 35,
      bounciness: 0,
      speed: .5,
    }).start();

    Animated.timing(
      this.state.fadeNextText,
      {
        toValue: 1,
        duration: 1000,
      }
    ).start();
  
  };

  conceal = () => {
    StatusBar.setBarStyle('light-content', true)

    Animated.timing(
      this.state.fadeNextText,
      {
        toValue: 0,
        duration: 500,
      }
    ).start();

    Animated.spring(this.state.bounceImage, {
      toValue: -circleSize - 35,
      bounciness: 2,
      speed: .5,
    }).start();

    Animated.spring(this.state.bounceHeader, {
      toValue: 0,
      bounciness: 0,
      speed: .5,
    }).start();

    if (this.state.exerciseIndex == 0) {
      this.setState({
        images: Workout.moveExercises.exerciseArray[1].imageArray,
      });
    }
    else {
      this.setState({
        images: Workout.moveExercises.exerciseArray[0].imageArray,
      });
    }

    this.props.setTimeout(this.reveal, 1000);
  };

  nextImage = () => {
    var curr = this.state.imageIndex;
    this.state.isUp ? curr = curr + 1 : curr = curr - 1;
     if (curr > this.state.images.length - 1) {
       this.setState({isUp: false});
       curr = this.state.images.length - 2;
     }
     else if (curr < 0) {
       this.setState({isUp: true});
       curr = 1;
     }

     this.setState({
       imageIndex: curr,
     })
   }

}

export default ReactTimeout(App)

const circleSize = windowWidth / 2;
const backgroundWH = windowWidth * 2;

const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  titleText: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: windowHeight * .08,
    textAlign: 'center',
    padding: 10,
    paddingTop: windowHeight * .10,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  nextText: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: windowHeight * .04,
    textAlign: 'center',
    padding: 10,
    top: 0,
    width: '100%',
  },
  container: {
    alignSelf: 'center',
    marginTop: 35,
    width: windowWidth,
    overflow: 'hidden', // for hide the not important parts from circle
    margin: 10,
    height: circleSize,
  },
  background: { // this shape is a circle
    borderRadius: backgroundWH, // border borderRadius same as width and height
    width: backgroundWH,
    height: backgroundWH,
    marginLeft: -circleSize, // reposition the circle inside parent view
    position: 'absolute',
    bottom: 0, // show the bottom part of circle
    overflow: 'hidden', // hide not important part of image
  },
  images: {
    height: circleSize, // same width and height for the container
    width: windowWidth,
    position: 'absolute', // position it in circle
    bottom: 0, // position it in circle
    marginLeft: circleSize, // center it in main view same value as marginLeft for circle but positive
    resizeMode: 'contain',
  },
  header: {
    backgroundColor: 'orange',
    position: 'absolute',
    top: -windowHeight / 3,
    height: windowHeight / 3.5,
    width: '100%',
  },
  headerText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 42,
    textAlign: 'center',
    padding: 10,
    paddingTop: windowHeight * .10,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  progressContainer: {
      position: 'absolute',
      width: '100%',
      top: windowHeight - windowHeight * 0.40,
  },
  progress: {
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 20,
  },
  buttonContainer: {
    paddingTop: 25,
    bottom: 10,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    padding: 10,
    margin: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'white',
  },
});
