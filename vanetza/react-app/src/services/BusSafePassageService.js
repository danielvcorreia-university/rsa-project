import * as mqtt from 'react-paho-mqtt';

const [ client, setClient ] = React.useState(null);
const _topic = ["Hello"];
const _options = {};

class BusSafePassageService {

    update_car() {
        React.useEffect(() => {
            _init();
        },[])
        
        const _init = () => {
            // mqtt.connect(host, port, clientId, _onConnectionLost, _onMessageArrived)
            const c = mqtt.connect("192.168.98.20", Number(1883), "car", _onConnectionLost, _onMessageArrived);
            setClient(c);
        }
        
        // called when client lost connection
        const _onConnectionLost = responseObject => {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost: " + responseObject.errorMessage);
            }
        }
        
        // called when messages arrived
        const _onMessageArrived = message => {
            console.log("onMessageArrived: " + message.payloadString);
        }
        
        // called when disconnecting the client
        const _onDisconnect = () => {
            client.disconnect();
        }
    }

    update_bus() {
        React.useEffect(() => {
            _init();
        },[])
        
        const _init = () => {
            // mqtt.connect(host, port, clientId, _onConnectionLost, _onMessageArrived)
            const c = mqtt.connect("192.168.98.10", Number(1883), "bus", _onConnectionLost, _onMessageArrived);
            setClient(c);
        }
        
        // called when client lost connection
        const _onConnectionLost = responseObject => {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost: " + responseObject.errorMessage);
            }
        }
        
        // called when messages arrived
        const _onMessageArrived = message => {
            console.log("onMessageArrived: " + message.payloadString);
        }
        
        // called when disconnecting the client
        const _onDisconnect = () => {
            client.disconnect();
        }
    }
}

export default new BusSafePassageService();