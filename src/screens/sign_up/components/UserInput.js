import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  TouchableHighlight
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import getEnvVars from "taurusMobile/environment";

const colorTextInput = "#FF6B35";


export default class UserInput extends Component {
  state = {
    user: "",
    pass: "",
    repass: "",
    email: "",
    errorUser: false,
    errorDate: false,
    errorEmail: false,
    errorPass: false,
    errorRePass: false,
    loading: false,
    uri:"https://i.imgur.com/9HflgDv.jpg",
  };

  signUp = () => {
    //var cryptoPass = encrypt(pass);
    this.setState({ loading: true })

    if (this.validateAll()) {
      const { apiUrl } = getEnvVars

      let formdata = new FormData();

      formdata.append("user[email]", this.state.email)
      formdata.append("user[handle]", this.state.user)
      formdata.append("user[password]", this.state.pass)

      const options = {   
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "query": `mutation {
            signup(user:{handle:"${this.state.user}" email:"${this.state.email}" password:"${this.state.pass}"}){
              id
              handle
              email
              guest
            }
          }`
        })
      }

      fetch(apiUrl,options)
        .then(response => {
          if(response.ok){
            console.log('Success', response);
            this.setState({ loading: false });
            this.props.navigation.navigate('ValidateEmail');
          } else {
            console.log('Error:', response.json())
            this.setState({ loading: false });

          }
        })
        .catch( error => {
          console.log(error)
          this.setState({ loading: false });
          return error;
        })
    } else {
      this.setState({ loading: false })
    }

      
  }

  validateAll = () => {
    this.validate('email', this.state.email)
    this.validate('user', this.state.user)
    this.validate('birthday', this.state.birthday)
    this.validate('password', this.state.pass)

    return !(this.state.errorEmail && this.state.errorUser && this.state.errorDate && this.state.errorPass)
  }

  validate = (input,value) => {
    switch(input){
      case "email":
        var emailRestrictions = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(value){
          if(value.match(emailRestrictions)) {
            this.setState({ errorEmail: false })
          } else {
            this.setState({ errorEmail: true })
          }
        }else{
          this.setState({ errorEmail: false })
        }
        break;

      case "user":
        var usernameRestrictions = /^([a-zA-Z0-9]+)$/;
            
        if(value){
          if( 5 <= value.length && value.length <= 20 && value.match(usernameRestrictions)) {
            this.setState({ errorUser: false })
          } else {
            this.setState({ errorUser: true })
          }
        }else{
          this.setState({ errorUser: false })
        }
        break;

      case "pass":
        if(value){
          if( 8 <= value.length && value.length <= 30) {
              this.setState({ errorPass: false })
          } else {
              this.setState({ errorPass: true })
            }
        }else{
          this.setState({ errorPass: false })
        }
        break;

      case "repass":
        if(value){
          if( value == this.state.pass) {
              this.setState({ errorRePass: false })
          } else {
              this.setState({ errorRePass: true })
            }
        }else{
          this.setState({ errorRePass: false })
        }
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ marginLeft: 8 }}>
          <Text>Ingresa tu nombre de usuario</Text>
        </View>
        <TextInput
          theme={themes}
          error={this.state.errorUser}
          mode="outlined"
          style={{ margin: 8 }}
          value={this.state.user}
          selectionColor={colorTextInput}
          underlineColorAndroid={colorTextInput}
          onChangeText={user => {
            this.setState({ user });
            this.validate("user", user);
          }}
        />
        {this.state.errorUser ? (
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.error} theme={themes}>
              {" "}
              El nombre de usuario debe tener entre 5 - 20 caracteres
            </Text>
          </View>
        ) : null}

        <View style={{ marginLeft: 8 }}>
          <Text>Ingresa tu email</Text>
        </View>
        <TextInput
          theme={themes}
          error={this.state.errorEmail}
          mode="outlined"
          theme={themes}
          style={styles.input}
          value={this.state.email}
          selectionColor={colorTextInput}
          underlineColorAndroid={colorTextInput}
          onChangeText={email => {
            this.setState({ email });
            this.validate("email", email);
          }}
        />
        {this.state.errorEmail ? (
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.error} theme={themes}>
              {" "}
              Por favor escribe un email valido
            </Text>
          </View>
        ) : null}

        <View style={{ marginLeft: 8 }}>
          <Text>Ingresa tu contraseña</Text>
        </View>
        <TextInput
          theme={themes}
          error={this.state.errorPass}
          mode="outlined"
          style={{ margin: 8 }}
          value={this.state.pass}
          selectionColor={colorTextInput}
          underlineColorAndroid={colorTextInput}
          onChangeText={pass => {
            this.setState({ pass });
            this.validate("pass", pass);
          }}
        />
        {this.state.errorPass ? (
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.error} theme={themes}>
              {" "}
              La contraseña debe tener entre 8 - 30 caracteres
            </Text>
          </View>
        ) : null}

        <View style={{ marginLeft: 8 }}>
          <Text>Ingresa nuevamente tu contraseña</Text>
        </View>
        <TextInput
          theme={themes}
          error={this.state.errorRePass}
          mode="outlined"
          style={{ margin: 8 }}
          value={this.state.repass}
          selectionColor={colorTextInput}
          underlineColorAndroid={colorTextInput}
          onChangeText={repass => {
            this.setState({ repass });
            this.validate("repass", repass);
          }}
        />
        {this.state.errorRePass ? (
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.error} theme={themes}>
              {" "}
              Las contraseñas no coinciden{" "}
            </Text>
          </View>
        ) : null}

        <Button
          style={{ margin: 8 }}
          mode="outlined"
          title="Registrarse"
          onPress={this.signUp}
          disabled={this.state.loading}
          loading={this.state.loading}
          theme={themes}
        >
          Registrarse
        </Button>
      </View>
    );
  }
}

const themes = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#6290C3",
    accent: "#272727",
    background: "#FDFFFC",
    text: "#272727",
    disabled: "#FDFFFC",
    placeholder: "#272727"
  }
};

const styles = {
  input: {
    border: 20,
    margin: 8,
    background: "#272727"
  },
  error: {
    color: "red",
    fontStyle: "italic"
  },
  container: {
    flex: 1
  },
  imagesContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between"
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100
  }
};
