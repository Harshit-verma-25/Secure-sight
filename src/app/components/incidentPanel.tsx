import { Incident } from "@/app/types/incident";
import {
  Bomb,
  CheckCheck,
  Crosshair,
  DoorOpen,
  Flame,
  PowerOff,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const getIncidentTypeDetails = (type: Incident["type"]) => {
  switch (type) {
    case "Unauthorized Access":
      return { Icon: DoorOpen, color: "text-yellow-400" };
    case "Gun Threat":
      return { Icon: Crosshair, color: "text-blue-500" };
    case "Bomb Threat":
      return { Icon: Bomb, color: "text-red-600" };
    case "Fire Alarm":
      return { Icon: Flame, color: "text-orange-500" };
    case "Power Outage":
      return { Icon: PowerOff, color: "text-green-500" };
    default:
      return { Icon: TriangleAlert, color: "text-gray-400" };
  }
};

const IncidentCard = ({
  incident,
  setActiveThumbnail,
  setActiveIncident,
  setActiveCamera,
  setResolveId,
}: {
  incident: Incident;
  setActiveThumbnail: (url: string | null) => void;
  setActiveIncident: (incident: string | null) => void;
  setActiveCamera: (camera: string | null) => void;
  setResolveId: (id: string) => void;
}) => {
  const { Icon, color } = getIncidentTypeDetails(incident.type);
  const [isResolving, setIsResolving] = useState(false);

  const startTime = new Date(incident.tsStart).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const endTime = new Date(incident.tsEnd).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const date = new Date(incident.tsStart).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className={`flex items-center space-x-4 py-2 border-b border-gray-700 transition-all duration-500 ease-in-out ${
        isResolving ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="w-full flex justify-between">
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => {
            setActiveThumbnail(incident.thumbnailUrl);
            setActiveIncident(`${date} - ${startTime}`);
            setActiveCamera(incident.camera.name);
          }}
        >
          <Image
            src={incident.thumbnailUrl}
            alt={incident.type}
            width={120}
            height={60}
            className="rounded-md object-cover h-[60px] md:w-[120px] w-[80px]"
          />
          <div
            className={`flex flex-col justify-between text-sm ${color} h-[60px]`}
          >
            <div className="flex items-center gap-1 font-semibold">
              <Icon height={14} width={14} className="hidden sm:block"/>
              <span>{incident.type}</span>
            </div>

            {/* Desktop */}
            <p className="hidden md:block text-sm text-gray-400">
              {startTime} - {endTime} on {date}
            </p>

            {/* Mobile */}
            <p className="text-xs text-gray-400 md:hidden">
              {startTime} - {endTime}
            </p>
            <p className="text-xs text-gray-400 md:hidden">{date}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsResolving(true);
            setResolveId(incident.id);
          }}
          disabled={isResolving}
          className="flex-shrink-0 text-yellow-500 hover:text-yellow-400 text-sm font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Resolve
        </button>
      </div>
    </div>
  );
};

const IncidentsPanel = ({
  incidents,
  resolveCount,
  setActiveThumbnail,
  setActiveIncident,
  setActiveCamera,
  setResolveId,
}: {
  incidents: Incident[];
  resolveCount: number;
  setActiveThumbnail: (url: string | null) => void;
  setActiveIncident: (incident: string | null) => void;
  setActiveCamera: (camera: string | null) => void;
  setResolveId: (id: string) => void;
}) => {
  return (
    <div className="h-full rounded-md w-full md:w-1/2 bg-[#131313] px-3 py-2">
      {/* Header */}
      <div className="flex justify-between items-center pb-2">
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-[#7F1D1D] rounded-full p-1">
            <div className="flex items-center justify-center bg-[#a11f1f] rounded-full p-1.5">
              <TriangleAlert className="text-[#F87171]" size={14} />
            </div>
          </div>
          <h2 className="md:text-base lg:text-lg font-bold">
            {incidents.length} Unresolved Incidents
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex item-center border border-gray-600 rounded-full px-2 py-1">
            <CheckCheck className="text-green-500" size={16} />
            <span className="min-w-fit text-sm text-gray-300 ml-1">
              {resolveCount} resolved incidents
            </span>
          </div>
        </div>
      </div>

      {/* Incident List */}
      <div className="flex-grow overflow-y-scroll h-[calc(100%-60px)] hide-scrollbar">
        {incidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            setActiveThumbnail={setActiveThumbnail}
            setActiveIncident={setActiveIncident}
            setActiveCamera={setActiveCamera}
            setResolveId={setResolveId}
          />
        ))}
      </div>
    </div>
  );
};

export default IncidentsPanel;
