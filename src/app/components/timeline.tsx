import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  DoorOpen,
  Crosshair,
  Bomb,
  TriangleAlert,
  Flame,
  PowerOff,
  Video,
  Play,
  FastForward,
  SkipForward,
  SkipBack,
  Rewind,
  Calendar,
  Disc,
  EllipsisVertical,
} from "lucide-react";
import { Incident, Camera } from "@/app/types/incident";
import Image from "next/image";

const getIncidentTypeDetails = (type: Incident["type"]) => {
  switch (type) {
    case "Unauthorized Access":
      return {
        Icon: DoorOpen,
        color: "text-yellow-400",
        border: "border-yellow-400",
        iconColor: "#FBBF24",
      };
    case "Gun Threat":
      return {
        Icon: Crosshair,
        color: "text-blue-500",
        border: "border-blue-500",
        iconColor: "#3B82F6",
      };
    case "Bomb Threat":
      return {
        Icon: Bomb,
        color: "text-red-600",
        border: "border-red-600",
        iconColor: "#DC2626",
      };
    case "Fire Alarm":
      return {
        Icon: Flame,
        color: "text-orange-500",
        border: "border-orange-500",
        iconColor: "#F97316",
      };
    case "Power Outage":
      return {
        Icon: PowerOff,
        color: "text-green-500",
        border: "border-green-500",
        iconColor: "#4ADE80",
      };
    default:
      return {
        Icon: TriangleAlert,
        color: "text-gray-400",
        border: "border-gray-400",
        iconColor: "#A1A1AA",
      };
  }
};

const formatTime = (totalSeconds: number, showSeconds = true) => {
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  if (!showSeconds) return `${hours}:${minutes}`;
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}s`;
};

const Timeline = ({
  cameras,
  incidents,
  currentTime,
  onTimeChange,
  setActiveThumbnail,
  setActiveIncident,
  setActiveCamera,
}: {
  cameras: Camera[];
  incidents: Incident[];
  currentTime: number;
  onTimeChange: (newTime: number) => void;
  setActiveThumbnail: (url: string | null) => void;
  setActiveIncident: (incident: string | null) => void;
  setActiveCamera: (camera: string | null) => void;
}) => {
  const SECONDS_IN_DAY = 86400;
  const TIMELINE_WIDTH = 2800;
  const HEADER_HEIGHT = 50;
  const LANE_HEIGHT = 60;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const SVG_HEIGHT = HEADER_HEIGHT + cameras.length * LANE_HEIGHT;

  const timeToX = (timeInSeconds: number) =>
    (timeInSeconds / SECONDS_IN_DAY) * TIMELINE_WIDTH;
  const xToTime = (xPos: number) => (xPos / TIMELINE_WIDTH) * SECONDS_IN_DAY;

  const scrubberX = timeToX(currentTime);

  const [scrubberXManual, setScrubberXManual] = useState(scrubberX);
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    if (!isDragging) {
      setScrubberXManual(scrubberX);
      if (containerRef.current) {
        const container = containerRef.current;
        const targetScrollLeft = scrubberX - container.clientWidth / 2;
        container.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
      }
    }
  }, [scrubberX, isDragging]);

  const handleMouseDown = () => {
    setIsDragging(true);
    isMouseDownRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isMouseDownRef.current) return;

    const containerLeft =
      containerRef.current?.getBoundingClientRect().left || 0;
    const newX = e.clientX - containerLeft;
    const clampedX = Math.max(0, Math.min(newX, TIMELINE_WIDTH));
    setScrubberXManual(clampedX);
    onTimeChange(xToTime(clampedX));
  };

  const handleMouseUp = () => {
    if (isMouseDownRef.current) {
      setIsDragging(false);
      isMouseDownRef.current = false;
    }
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <div className="w-full bg-[#1e1e1e] px-4 select-none flex flex-col">
      <div className="flex w-full">
        {/* Y-AXIS: CAMERA LABELS */}
        <div
          className="w-48 flex-shrink-0"
          style={{ paddingTop: `${HEADER_HEIGHT}px` }}
        >
          {cameras.map((camera) => (
            <div
              key={camera.id}
              style={{ height: `${LANE_HEIGHT}px` }}
              className="flex items-center text-gray-300 font-medium border-t border-r border-gray-700 p-2"
            >
              <Video size={18} className="mr-3 text-gray-500" />
              {camera.name}
            </div>
          ))}
        </div>

        {/* X-AXIS: SCROLLABLE TIMELINE */}
        <div
          ref={containerRef}
          className="flex-grow overflow-x-scroll relative hide-scrollbar"
        >
          <svg width={TIMELINE_WIDTH} height={SVG_HEIGHT} className="block">
            {/* --- HEADER: TIME RULER --- */}
            <g className="ruler">
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
                const x = timeToX(hour * 3600);
                return (
                  <g key={hour}>
                    <line
                      x1={x}
                      y1={HEADER_HEIGHT - 15}
                      x2={x}
                      y2={HEADER_HEIGHT}
                      stroke="#737373"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={HEADER_HEIGHT - 25}
                      textAnchor="middle"
                      fill="#a3a3a3"
                      fontSize="12"
                    >
                      {formatTime(hour * 3600, false)}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* --- LANES & EVENTS --- */}
            {cameras.map((camera, index) => {
              const yPos = HEADER_HEIGHT + index * LANE_HEIGHT;
              const incidentsForCamera = incidents.filter(
                (i) => i.cameraId === camera.id
              );

              return (
                <g key={camera.id} className="lane">
                  <line
                    x1="0"
                    y1={yPos}
                    x2={TIMELINE_WIDTH}
                    y2={yPos}
                    stroke="#404040"
                    strokeWidth="1"
                  />
                  {incidentsForCamera.map((incident) => {
                    const incidentDate = new Date(incident.tsStart);
                    const secondsIntoDay =
                      incidentDate.getUTCHours() * 3600 +
                      incidentDate.getUTCMinutes() * 60 +
                      incidentDate.getUTCSeconds();

                    const x = timeToX(secondsIntoDay);
                    const incidentWidth = timeToX(
                      (new Date(incident.tsEnd).getTime() -
                        new Date(incident.tsStart).getTime()) /
                        1000
                    );
                    const { Icon, color, border, iconColor } =
                      getIncidentTypeDetails(incident.type);

                    return (
                      <foreignObject
                        key={incident.id}
                        x={x}
                        y={yPos + 15}
                        width={Math.max(200, incidentWidth)}
                        height="30"
                      >
                        <div className="h-full w-full px-1">
                          <div
                            style={{
                              backgroundColor: `${color}20`,
                              borderColor: color,
                            }}
                            className={`flex items-center gap-1 h-full rounded-md border px-2 py-1 ${border} w-fit cursor-pointer`}
                            onClick={() => {
                              onTimeChange(secondsIntoDay);
                              setActiveThumbnail(incident.thumbnailUrl);
                              setActiveIncident(
                                `${new Date(
                                  incident.tsStart
                                ).toLocaleDateString()} - ${new Date(
                                  incident.tsStart
                                ).toLocaleTimeString()}`
                              );
                              setActiveCamera(camera.name);
                            }}
                          >
                            <Icon height={14} width={14} color={iconColor} />
                            <span
                              className={`text-xs font-semibold whitespace-nowrap truncate ${color}`}
                            >
                              {incident.type}
                            </span>
                          </div>
                        </div>
                      </foreignObject>
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {/* --- DRAGGABLE SCRUBBER (OVERLAY) --- */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            className="absolute top-0 h-full cursor-grab"
            style={{
              left: scrubberXManual,
              touchAction: "none",
              width: "2px",
              backgroundColor: "#facc15",
              transform: "translateX(-1px)",
            }}
          >
            <div
              className={`absolute -top-1 -translate-x-1/2 left-1/2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full transition-transform ${
                isDragging ? "scale-110" : "scale-100"
              }`}
            >
              {formatTime(currentTime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoPlayer = ({
  activeThumbnail,
  activeIncident,
  activeCamera,
  otherThumbnails,
}: {
  activeThumbnail: string | null;
  activeIncident: string | null;
  activeCamera: string | null;
  otherThumbnails: string[] | null;
}) => (
  <div className="relative h-full rounded-md w-full md:w-1/2">
    <div className="w-full h-full flex items-center justify-center">
      {activeThumbnail ? (
        <motion.img
          key={activeThumbnail}
          src={activeThumbnail}
          alt="Incident Thumbnail"
          className="rounded-md object-cover h-full w-full"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      ) : (
        <p className="text-gray-500">No active incident</p>
      )}
    </div>

    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black p-2 rounded-md">
      <Calendar className="text-white" height={16} width={16} />
      {activeIncident ? (
        <span className="text-xs">{activeIncident}</span>
      ) : null}
    </div>
    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black p-2 rounded-md">
      <Disc className="text-red-500" height={16} width={16} />
      {activeCamera ? <span className="text-xs">{activeCamera}</span> : null}
    </div>

    <div className="hidden absolute bottom-2 right-2 md:flex items-center gap-4">
      {otherThumbnails?.map((thumbnail, index) => (
        <div
          className="flex flex-col gap-2 bg-black p-2 rounded-md hover:opacity-80 transition-opacity cursor-pointer"
          key={index}
        >
          <div className="flex items-center gap-8 justify-between text-xs cursor-pointer">
            <span>Camera {String(index + 1).padStart(2, "0")}</span>
            <EllipsisVertical color="#FFF" height={14} width={14} />
          </div>
          <Image
            src={thumbnail}
            alt={`Camera ${String(index + 1).padStart(2, "0")}`}
            className="object-cover h-16 w-auto"
            width={9999}
            height={9999}
          />
        </div>
      ))}
    </div>
  </div>
);

const Controls = () => (
  <div className="flex items-center gap-4 bg-[#1e1e1e] pl-6 pt-4">
    <button className="text-gray-300 hover:text-white cursor-pointer">
      <SkipBack height={16} width={16} />
    </button>
    <button className="text-gray-300 hover:text-white cursor-pointer">
      <Rewind height={16} width={16} />
    </button>
    <button className="text-gray-300 hover:text-white cursor-pointer">
      <Play size={16} />
    </button>
    <button className="text-gray-300 hover:text-white cursor-pointer">
      <FastForward height={16} width={16} />
    </button>
    <button className="text-gray-300 hover:text-white cursor-pointer">
      <SkipForward height={16} width={16} />
    </button>
  </div>
);

export { Timeline, Controls, VideoPlayer };
