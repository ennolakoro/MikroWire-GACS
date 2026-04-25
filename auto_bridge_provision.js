/**
 * Provision script for GenieACS to set WAN connection to bridge mode.
 * Can be used as a Provision in GenieACS UI.
 */
const MODEL = declare("InternetGatewayDevice.DeviceInfo.ModelName", {value: 1}).value[0];

// Attempt to set PPPoE connection to Bridged
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.ConnectionType", {value: 1}, {value: "PPPoE_Bridged"});

// Attempt to set IP connection to Bridged
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ConnectionType", {value: 1}, {value: "IP_Bridged"});

// Refresh the WAN connection object to reflect changes
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.*", {value: 1});
