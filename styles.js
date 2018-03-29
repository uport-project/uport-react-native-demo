import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  scrollViewWrapper: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: '#34344f',
  },
  container: {
    paddingTop: 35,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 64,
    alignItems: 'stretch',
  },
  h1: {
    marginBottom: 15,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 15,
    color: '#FFFFFF'
  },
  h2: {
    marginBottom: 10,
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#FFFFFF'
  },
  p: {
    marginBottom: 10,
    fontSize: 15,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  errorMessage: {
    margin: 15,
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#ca5858'
  },
  button: {
    height: 44,
    marginBottom: 15,
    backgroundColor: '#5c58ca',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingRight: 15,
    paddingLeft: 15,
  },
  flexButton: {
    flex: 1,
  },
  buttonLabel: {
    fontSize: 20,    
    textAlign: 'center',
    color: '#FFFFFF'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignSelf: 'center',
  },
  textInput: {
    height: 44,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'rgba(0,0,0,0.2)',
    color: 'white',
    fontSize: 20,
    paddingLeft: 10,
    flex: 1,
    marginRight: 15,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  
});
