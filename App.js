import React, { Component } from 'react';
import configureUportConnect from 'react-native-uport-connect'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  TextInput,
  AsyncStorage,
} from 'react-native'
import Web3 from 'web3'
import styles from './styles'
import {configureSharesContract, configureSimpleSharesContract} from './sharesContract'

const uport = configureUportConnect({
  appName: 'uPort Demo',
  appUrlScheme: '2oeXufHGDpU51bfKBsZDdu7Je9weJ3r7sVG',
  appAddress: '2oeXufHGDpU51bfKBsZDdu7Je9weJ3r7sVG',
  privateKey: 'c818c2665a8023102e430ef3b442f1915ed8dc3abcaffbc51c5394f03fc609e2',
})

let web3 = null
let sharesContract = null
const simpleSharesContract = configureSimpleSharesContract(new Web3(uport.getProvider()))

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: null,
      avatar: null,
      did: null,
      mnid: null,
      address: null,
      shares: 0,
      sharesToBuy: 0,
      errorMessage: null,
      loginInProgress: null,
      getSharesInProgress: null,
      buySharesInProgress: null,
    }
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLoginResult = this.handleLoginResult.bind(this)
    this.handleBuySharesResult = this.handleBuySharesResult.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.loadShares = this.loadShares.bind(this)
    this.buyShares = this.buyShares.bind(this)
    this.attestName = this.attestName.bind(this)
    this.signClaim = this.signClaim.bind(this)

    uport.onResponse('disclosureReq').then(res => this.handleLoginResult(res.payload))
    uport.onResponse('updateShares').then(res => this.handleBuySharesResult(res.payload))
    uport.onResponse('verSigReq').then(res => this.handleSignClaimResult(res.payload))

    AsyncStorage.getItem('uportState').then(json => {
      const uportState = JSON.parse(json)
      this.setState(uportState)
      uport.setState(uportState)
      web3 = new Web3(uport.getProvider())
      sharesContract = configureSharesContract(uport)
      this.loadShares()
    })
  }

  handleBuySharesResult (txHash) {
    const interval = setInterval(() => {
      web3.eth.getTransactionReceipt(txHash, (error, response) => {
        if (error) {
          clearInterval(interval)
          this.setState({buySharesInProgress: false, errorMessage: error.message})
        }
        if (response) {
          clearInterval(interval)
          this.setState({buySharesInProgress: false})
          this.loadShares()
        }
      })
    }, 1000)

  }

  handleSignClaimResult (result) {
    console.log('signed claim', result)
  }

  handleLoginResult (result) {
    if (!result) {
      this.setState({
        errorMessage: 'Access denied',
        loginInProgress: null
      })
      return
    }

    const uportState = uport.state
    AsyncStorage.setItem('uportState', JSON.stringify(uportState))

    this.setState({
      name: result.name,
      avatar: result.avatar,
      did: result.did,
      mnid: result.mnid,
      address: result.address,
      loginInProgress: null,
    })
    web3 = new Web3(uport.getProvider())
    sharesContract = configureSharesContract(uport)
    
    this.loadShares()
  }

  handleLogin () {
    this.setState({loginInProgress: true, errorMessage: null})

    uport.requestDisclosure({
      requested: ['name', 'avatar'],
      accountType: 'keypair',
      network_id: '0x4',
      notifications: false,
    })
  }

  loadShares() {
    this.setState({getSharesInProgress: true, errorMessage: null})

    simpleSharesContract.getShares.call(this.state.address, (error, sharesNumber) => {
      if (error) {
        this.setState({errorMessage: error.message})
        throw error
      }
      this.setState({getSharesInProgress: false, shares: sharesNumber.toNumber()})
    })
  }
  
  buyShares() {
    this.setState({buySharesInProgress: true, errorMessage: null})
    sharesContract.updateShares(this.state.sharesToBuy, 'updateShares')
  }

  attestName() {
    uport.sendVerification({
      sub: this.state.did,
      claim: {name: this.state.name},
      exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
    }, 'nameClaim')    
  }

  signClaim() {
    uport.requestVerificationSignature({
      sub: this.state.did,
      unsignedClaim: {ClaimType: 'Claim value'},
    })    
  }

  handleLogout () {
    const state = {
      name: null,
      avatar: null,
      address: null,
      mnid: null,
      did: null,
    }
    this.setState(state)
    AsyncStorage.setItem('uportState', JSON.stringify(state))

  }

  render() {
    return (
      <View style={styles.scrollViewWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          >
          <StatusBar
            backgroundColor="#34344f"
            barStyle="light-content"
          />
          {this.state.errorMessage && <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>}

          {!this.state.address && <View>
            <Text style={styles.h1}>
              uPort | Demo
            </Text>
            <TouchableOpacity onPress={this.handleLogin}>
            <View style={styles.button}>
              {!this.state.loginInProgress && <Text style={styles.buttonLabel}>
                Login with uPort
              </Text>}
              {this.state.loginInProgress && <ActivityIndicator 
                size='small'
                color='#FFFFFF'
              />}
            </View>
          </TouchableOpacity></View>}

          {this.state.address && <View>
            <View style={styles.userRow}>
              {this.state.avatar && <Image 
                style={styles.image}
                source={this.state.avatar}
              />}

              <Text style={styles.h1}>
                {this.state.name}
              </Text>
            </View>
              <Text style={styles.small}>
                DID: {this.state.did}
              </Text>
              <Text style={styles.small}>
                Address: {this.state.address}
              </Text>
            <Text style={styles.h1}>
              Shares
            </Text>
            <Text style={styles.h2}>
              Your current shares: {this.state.shares}
            </Text>
            <TouchableOpacity onPress={this.loadShares}>
              <View style={styles.button}>
                {!this.state.getSharesInProgress && <Text style={styles.buttonLabel}>
                  Reload Shares
                </Text>}
                {this.state.getSharesInProgress && <ActivityIndicator size='small' color='#FFFFFF' />}
              </View>
            </TouchableOpacity>
            
            <View style={styles.row}>
            <TextInput
              style={styles.textInput}
              value={this.state.sharesToBuy ? this.state.sharesToBuy.toString() : '0'}
              onChangeText={(sharesToBuy) => this.setState({sharesToBuy: parseInt(sharesToBuy, 10)})}
              keyboardType='numeric'
              underlineColorAndroid='transparent'
              />

            <TouchableOpacity onPress={this.buyShares}>
              <View style={[styles.button, styles.flexButton]}>
                {!this.state.buySharesInProgress && <Text style={styles.buttonLabel}>
                  Buy Shares
                </Text>}
                {this.state.buySharesInProgress && <ActivityIndicator size='small' color='#FFFFFF' />}
              </View>
            </TouchableOpacity>
            </View>
            
            <Text style={styles.h1}>
              Attestations
            </Text>

            <TouchableOpacity onPress={this.attestName}>
              <View style={styles.button}>
                <Text style={styles.buttonLabel}>
                  Attest Name
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={this.signClaim}>
              <View style={styles.button}>
                <Text style={styles.buttonLabel}>
                  Sign claim
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.handleLogout}>
              <View style={styles.button}>
                <Text style={styles.buttonLabel}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>

          </View>}
        </ScrollView>
      </View>
    )
  }
}

