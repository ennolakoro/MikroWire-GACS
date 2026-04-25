// --- AUTO PROVISION MIKROWIRE RT/RW NET (PPPoE + Hotspot Bridge) ---

// 1. KUNCI KONFIGURASI PPPOE (WIFI PELANGGAN)
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.*", {value: 1});
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.ConnectionType", {value: 1}, {value: "IP_Routed"});
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.ServiceList", {value: 1}, {value: "INTERNET"});
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.X_HW_VLAN", {value: 1}, {value: "100"}); // VLAN PPPoE

// Ambil Username & Password dari Tag atau set default
let pppUser = "user_" + declare("DeviceID.SerialNumber", {value: 1}).value[0];
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Username", {value: 1}, {value: pppUser});
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Password", {value: 1}, {value: "mikrowire123"});

// 2. KUNCI KONFIGURASI BRIDGE (HOTSPOT / VOUCHER)
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.*", {value: 1});
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ConnectionType", {value: 1}, {value: "IP_Bridged"});
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ServiceList", {value: 1}, {value: "Other"}); 
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.X_HW_VLAN", {value: 1}, {value: "200"}); // VLAN Hotspot

// 3. BINDING PORT (PORT MAPPING)
// LAN 1 & SSID 1 untuk PPPoE, LAN 2 & SSID 2 untuk Hotspot
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.PortMapping", {value: 1}, {value: "LAN1,SSID1"});
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.PortMapping", {value: 1}, {value: "LAN2,SSID2"});

// Enable SSID 2 untuk Hotspot
declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.Enable", {value: 1}, {value: true});
declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID", {value: 1}, {value: "Voucher @MikroWire"});
