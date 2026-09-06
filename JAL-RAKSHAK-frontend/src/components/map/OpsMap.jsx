import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { riskStatus, riskTone } from "../../utils/risk";

export default function OpsMap({ devices = [], height = 500 }) {
  const center = devices.length ? [devices[0].latitude, devices[0].longitude] : [12.9716, 77.5946];
  return <div style={{ height }} className="w-full">
    <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full">
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {devices.map(d => {
        const status = riskStatus(d.riskScore);
        const fillColor = status === "CRITICAL" ? "#f87171" : status === "WARNING" ? "#fb923c" : status === "WATCH" ? "#facc15" : "#34d399";
        return <CircleMarker key={d.deviceId} center={[d.latitude, d.longitude]} radius={9} pathOptions={{ color: fillColor, fillColor, fillOpacity: .75, weight: 2 }}>
          <Popup><div className="min-w-44"><div className="text-xs font-bold uppercase tracking-wider text-cyan-300">{d.deviceId}</div><div className="mt-2 font-semibold">{d.location}</div><div className="mt-2 grid grid-cols-2 gap-2 text-xs"><span>Water</span><b>{d.waterLevel} cm</b><span>Risk</span><b>{d.riskScore} — {status}</b><span>Trend</span><b>{d.waterTrend.replaceAll("_"," ")}</b><span>Quality</span><b>{d.sensorQuality}%</b></div></div></Popup>
        </CircleMarker>;
      })}
    </MapContainer>
  </div>;
}
